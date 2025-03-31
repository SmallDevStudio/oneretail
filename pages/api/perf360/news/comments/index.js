import connetMongoDB from "@/lib/services/database/mongodb";
import NewsComments from "@/database/models/Perf360/NewsComments";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await NewsComments.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const news = await NewsComments.create(req.body);
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error creating News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const { commentId } = req.query;
        const news = await NewsComments.findByIdAndDelete(commentId);
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error deleting News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
