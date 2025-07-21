import connectMongoDB from "@/lib/services/database/mongodb";
import NewComments from "@/database/models/News/NewComments";
import NewReply from "@/database/models/News/NewReply";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const comments = await NewComments.find({ newsId: id }).lean();
        const commentIds = comments.map((c) => c._id);

        // ดึง replies ที่เกี่ยวข้องกับ comments เหล่านี้
        const replies = await NewReply.find({
          commentId: { $in: commentIds },
        }).lean();

        // รวบรวม userId ทั้งหมดจาก comments และ replies
        const allUserIds = [
          ...new Set([
            ...comments.map((c) => c.userId),
            ...replies.map((r) => r.userId),
          ]),
        ];

        const users = await Users.find({ userId: { $in: allUserIds } })
          .select("userId fullname pictureUrl empId role")
          .lean();

        // สร้าง map เพื่อให้แมป user ได้ง่าย
        const userMap = {};
        users.forEach((u) => {
          userMap[u.userId] = u;
        });

        // แมป user ให้ comment และ reply
        const commentWithReplies = comments.map((c) => {
          return {
            ...c,
            user: userMap[c.userId] || null,
            reply: replies
              .filter((r) => r.commentId.toString() === c._id.toString())
              .map((r) => ({
                ...r,
                user: userMap[r.userId] || null,
              })),
          };
        });

        return res
          .status(200)
          .json({ success: true, data: commentWithReplies });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
