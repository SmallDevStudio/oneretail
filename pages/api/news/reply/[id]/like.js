import connectMongoDB from "@/lib/services/database/mongodb";
import NewReply from "@/database/models/News/NewReply";

export default async function handler(req, res) {
  await connectMongoDB();
  const { method } = req;
  const { id } = req.query;
  const { userId } = req.body;

  switch (method) {
    case "POST":
      try {
        const reply = await NewReply.findById(id);
        if (!reply)
          return res
            .status(404)
            .json({ success: false, message: "Reply not found" });

        const hasLiked = reply.likes.some((like) => like.userId === userId);

        if (hasLiked) {
          // Unlike
          reply.likes = reply.likes.filter((like) => like.userId !== userId);
        } else {
          // Like
          reply.likes.push({ userId });
        }

        await reply.save();
        res.status(200).json({ success: true, likes: reply.likes.length });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
