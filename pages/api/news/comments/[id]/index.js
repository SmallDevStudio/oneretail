import connectMongoDB from "@/lib/services/database/mongodb";
import NewComments from "@/database/models/News/NewComments";
import NewReply from "@/database/models/News/NewReply";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const {
    method,
    query: { id }, // id ของ news
  } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        // 1. ดึง comments ของ news นี้
        const comments = await NewComments.find({ newsId: id }).lean();

        // 2. ดึง replies ของ comments ทั้งหมด
        const commentIds = comments.map((c) => c._id.toString());
        const replies = await NewReply.find({
          commentId: { $in: commentIds },
        }).lean();

        // 3. รวม userId ทั้งจาก comments และ replies
        const userIdsSet = new Set([
          ...comments.map((c) => c.userId),
          ...replies.map((r) => r.userId),
        ]);

        const userIds = Array.from(userIdsSet);

        // 4. ดึง users ที่เกี่ยวข้อง
        const users = await Users.find({ userId: { $in: userIds } })
          .select("userId fullname pictureUrl empId role")
          .lean();

        // 5. Map userId => user object
        const userMap = {};
        users.forEach((user) => {
          userMap[user.userId] = user;
        });

        // 6. รวม replies กับ user
        const repliesGrouped = {};
        replies.forEach((reply) => {
          const user = userMap[reply.userId] || null;
          const replyWithUser = { ...reply, user };
          const cid = reply.commentId.toString();
          if (!repliesGrouped[cid]) repliesGrouped[cid] = [];
          repliesGrouped[cid].push(replyWithUser);
        });

        // 7. รวม comments กับ user และ replies
        const result = comments.map((comment) => {
          const user = userMap[comment.userId] || null;
          return {
            ...comment,
            user,
            replies: repliesGrouped[comment._id.toString()] || [],
          };
        });

        return res.status(200).json({ success: true, data: result });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}
