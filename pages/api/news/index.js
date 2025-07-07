import connetMongoDB from "@/lib/services/database/mongodb";
import News from "@/database/models/News";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await News.find({ active: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const news = await News.create(req.body);
        res.status(201).json(news);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
