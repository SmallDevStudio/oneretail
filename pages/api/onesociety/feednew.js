import connectMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";
import PinPost from "@/database/models/PinPost";

export default async function handler(req, res) {
  const { method } = req;
  const { page = 1, limit = 20 } = req.query; // Default page = 1, limit = 20
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 2. ดึงข้อมูล PinPost ที่ถูก pin (`pinned: true`)
        const pinPosts = await PinPost.find({ pinned: true });
        const pinnedPostIds = pinPosts.map((pin) => pin.postId.toString());

         // ดึงโพสต์ทั้งหมดตาม Pagination
         const posts = await Post.find({})
         .sort({ createdAt: -1 }) // ใหม่ไปเก่า
         .skip(skip)
         .limit(parseInt(limit))
         .lean(); // ใช้ lean() เพื่อลด overhead


        // 3. ดึงข้อมูลผู้ใช้สำหรับโพสต์ทั้งหมด
        const userIds = posts.map((post) => post.userId);
        const users = await Users.find({ userId: { $in: userIds } })
          .select("userId fullname pictureUrl role");

        const userMap = users.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});

        // 4. Populate posts พร้อม comments และ replies
        const populatedPost = await Promise.all(
          posts.map(async (post) => {
            const comments = await Comment.find({ postId: post._id }).lean();
            const commentUserIds = comments.map((comment) => comment.userId);
            const commentUsers = await Users.find({
              userId: { $in: commentUserIds },
            });
            const commentUserMap = commentUsers.reduce((acc, user) => {
              acc[user.userId] = user;
              return acc;
            }, {});

            const populatedComments = await Promise.all(
              comments.map(async (comment) => {
                const replies = await Reply.find({ commentId: comment._id }).lean();
                const replyUserIds = replies.map((reply) => reply.userId);
                const replyUsers = await Users.find({
                  userId: { $in: replyUserIds },
                });
                const replyUserMap = replyUsers.reduce((acc, user) => {
                  acc[user.userId] = user;
                  return acc;
                }, {});

                const populatedReplies = replies.map((reply) => ({
                  ...reply._doc,
                  user: replyUserMap[reply.userId],
                }));

                return {
                  ...comment._doc,
                  user: commentUserMap[comment.userId],
                  reply: populatedReplies,
                };
              })
            );

            return {
              ...post._doc,
              hasPin: pinnedPostIds.includes(post._id.toString()), // ✅ เพิ่ม hasPin: true ถ้าโพสต์ถูก pin
              user: userMap[post.userId],
              comments: populatedComments,
            };
          })
        );

        // 5. จัดเรียงโพสต์ใหม่
        const sortedPosts = populatedPost.sort((a, b) => {
          // ให้โพสต์ที่ถูก Pin (`hasPin: true`) อยู่บนสุด
          if (a.hasPin && !b.hasPin) return -1;
          if (!a.hasPin && b.hasPin) return 1;
          // ถ้าไม่มี pin ทั้งคู่ ให้เรียงตาม `createdAt` (ใหม่ไปเก่า)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // ตรวจสอบว่ามีโพสต์เพิ่มเติมหรือไม่
        const totalPosts = await Post.countDocuments({});
        const hasMore = totalPosts > skip + parseInt(limit);


        // 7. ส่ง response โดยให้โพสต์ที่ถูก pin อยู่ด้านบน
        res.status(200).json({
          success: true,
          data: sortedPosts, // ✅ โพสต์ที่ถูก pin อยู่บนสุด
          hasMore, // แจ้งให้ Frontend รู้ว่ามีโพสต์เพิ่มเติมหรือไม่
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: "Invalid request method" });
      break;
  }
}
