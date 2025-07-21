// /api/news/reply.js
import connectMongoDB from "@/lib/services/database/mongodb";
import NewReply from "@/database/models/News/NewReply";
import NewComments from "@/database/models/News/NewComments";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectMongoDB();
      const { newsId, commentId, comment, userId } = req.body;

      const reply = await NewReply.create({
        newsId,
        commentId,
        comment,
        userId,
      });

      // Add reply ID to comment's reply array
      await NewComments.findByIdAndUpdate(commentId, {
        $push: { reply: reply._id },
      });

      return res.status(201).json({ success: true, data: reply });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
