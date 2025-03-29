import connetMongoDB from "@/lib/services/database/mongodb";
import News from "@/database/models/Perf360/News";
import NewsActivity from "@/database/models/Perf360/NewsActivity";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await News.find();
        const newsIds = news.map((n) => n._id);

        const activities = await NewsActivity.aggregate([
          { $match: { newsId: { $in: newsIds } } },
          {
            $group: {
              _id: { newsId: "$newsId", activity: "$activity" },
              count: { $sum: 1 },
            },
          },
        ]);

        const activityMap = {};

        activities.forEach(({ _id, count }) => {
          const { newsId, activity } = _id;
          if (!activityMap[newsId]) {
            activityMap[newsId] = { click: 0, views: 0 };
          }
          if (activity === "click") {
            activityMap[newsId].click = count;
          }
          if (activity === "view") {
            activityMap[newsId].views = count;
          }
        });

        const enrichedPopups = news.map((n) => ({
          ...n.toObject(),
          click: activityMap[n._id]?.click || 0,
          views: activityMap[n._id]?.views || 0,
        }));

        const grouped = enrichedPopups.reduce((acc, item) => {
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
