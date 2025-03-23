import connetMongoDB from "@/lib/services/database/mongodb";
import NewsCategory from "@/database/models/Perf360/NewsCategory";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await connetMongoDB();

  switch (method) {
    case "PUT":
      try {
        const news = await NewsCategory.findByIdAndUpdate(id, req.body);
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error updating News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const news = await NewsCategory.findByIdAndDelete(id);
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
