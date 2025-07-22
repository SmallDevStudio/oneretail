// /api/news/reply.js
import connectMongoDB from "@/lib/services/database/mongodb";
import NewReply from "@/database/models/News/NewReply";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const replies = await NewReply.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: replies });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const reply = await NewReply.create(req.body);
        res.status(201).json({ success: true, data: reply });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
