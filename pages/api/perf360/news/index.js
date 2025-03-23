import connetMongoDB from "@/lib/services/database/mongodb";
import News from "@/database/models/Perf360/News";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await News.find();

        const grouped = news.reduce((acc, item) => {
          const category = item.category || "อื่นๆ";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});

        res.status(200).json({ success: true, data: grouped });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const news = await News.create(req.body);
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error creating News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
