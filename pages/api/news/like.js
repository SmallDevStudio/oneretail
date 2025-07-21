// /api/news/like.js
import connectMongoDB from "@/lib/services/database/mongodb";
import NewComments from "@/database/models/News/NewComments";
import NewReply from "@/database/models/News/NewReply";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectMongoDB();
      const { targetId, userId, type } = req.body; // type: 'comment' or 'reply'

      const Model = type === "comment" ? NewComments : NewReply;

      const target = await Model.findById(targetId);
      const alreadyLiked = target.likes.some((like) => like.userId === userId);

      if (alreadyLiked) {
        // Unlike
        await Model.findByIdAndUpdate(targetId, {
          $pull: { likes: { userId } },
        });
      } else {
        // Like
        await Model.findByIdAndUpdate(targetId, {
          $push: { likes: { userId, createAt: new Date() } },
        });
      }

      return res.status(200).json({ success: true, liked: !alreadyLiked });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
