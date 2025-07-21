import connectMongoDB from "@/lib/services/database/mongodb";
import NewComments from "@/database/models/News/NewComments";

export default async function handler(req, res) {
  const { method } = req;
  const {
    query: { id },
    body: { userId },
  } = req;

  await connectMongoDB();

  if (method === "POST") {
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });

    try {
      const comment = await NewComments.findById(id);
      if (!comment)
        return res
          .status(404)
          .json({ success: false, message: "Comment not found" });

      const hasLiked = comment.likes.some((like) => like.userId === userId);

      if (hasLiked) {
        // Unlike
        comment.likes = comment.likes.filter((like) => like.userId !== userId);
      } else {
        // Like
        comment.likes.push({ userId });
      }

      await comment.save();

      return res.status(200).json({ success: true, likes: comment.likes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
