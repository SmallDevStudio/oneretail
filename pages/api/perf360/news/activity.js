import connetMongoDB from "@/lib/services/database/mongodb";
import NewsActivity from "@/database/models/Perf360/NewsActivity";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await NewsActivity.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      const { newsId, userId, activity } = req.body;
      try {
        if (activity === "view") {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const recentNews = await NewsActivity.findOne({
            newsId,
            userId,
            activity: "view",
            createdAt: { $gte: fiveMinutesAgo },
          });

          if (recentNews) {
            return res
              .status(200)
              .json({ success: true, message: "View recently recorded" });
          }
        }

        await NewsActivity.create({ newsId, userId, activity });
        return res
          .status(201)
          .json({ success: true, message: "Activity recorded" });
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
