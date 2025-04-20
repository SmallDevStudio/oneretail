import connectMongoDB from "@/lib/services/database/mongodb";
import PostViewLog from "@/database/models/PostViewLog";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectMongoDB();

  const { userId, postId, publicId, mediaType, duration, startTime, endTime } =
    req.body;

  try {
    await PostViewLog.create({
      userId,
      postId,
      publicId,
      mediaType,
      duration,
      startTime,
      endTime,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Post view log error:", err);
    res.status(500).json({ success: false });
  }
}
