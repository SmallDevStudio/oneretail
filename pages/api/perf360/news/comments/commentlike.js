import connectMongoDB from "@/lib/services/database/mongodb";
import NewsComments from "@/database/models/Perf360/NewsComments";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case "PUT":
      const { commentId, userId } = req.body;

      if (!commentId || !userId) {
        return res.status(400).json({ success: false, error: "Missing data" });
      }

      try {
        const comment = await NewsComments.findById(commentId);
        if (!comment) {
          return res
            .status(404)
            .json({ success: false, error: "Comment not found" });
        }

        const alreadyLiked = comment.likes.some(
          (like) => String(like.userId) === String(userId)
        );

        if (alreadyLiked) {
          comment.likes = comment.likes.filter(
            (like) => String(like.userId) !== String(userId)
          );
        } else {
          comment.likes.push({ userId, createAt: new Date() });

          if (String(userId) !== String(comment.userId)) {
            await Notifications.create({
              userId: comment.userId,
              senderId: userId,
              description: `ได้กด like คอมเมนต์ใน Perf360, Comment`,
              contentId: comment._id,
              path: "Perf360",
              subpath: "Comment",
              url: `${process.env.NEXTAUTH_URL}/perf360`,
              type: "Like",
            });
          }
        }

        await comment.save();
        return res.status(200).json({ success: true, data: comment });
      } catch (error) {
        console.error("Error liking comment:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      return res.status(400).json({ success: false });
  }
}
