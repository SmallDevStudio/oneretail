import connectMongoDB from "@/lib/services/database/mongodb";
import News1 from "@/database/models/News/News1";

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
      const news = await News1.findById(id);
      if (!news)
        return res
          .status(404)
          .json({ success: false, message: "News not found" });

      const hasLiked = news.likes.some((like) => like.userId === userId);

      if (hasLiked) {
        // Unlike
        news.likes = news.likes.filter((like) => like.userId !== userId);
      } else {
        // Like
        news.likes.push({ userId });
      }

      await news.save();

      return res.status(200).json({ success: true, likes: news.likes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
