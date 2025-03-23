import connetMongoDB from "@/lib/services/database/mongodb";
import NewsCategory from "@/database/models/Perf360/NewsCategory";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await NewsCategory.find();
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const news = await NewsCategory.create(req.body);
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error creating News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const news = await NewsCategory.findByIdAndUpdate(
          req.body._id,
          req.body
        );
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error updating News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const news = await NewsCategory.findByIdAndDelete(req.body._id);
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
