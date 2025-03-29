import connetMongoDB from "@/lib/services/database/mongodb";
import PopupActivity from "@/database/models/Perf360/PopupActivity";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const popup = await PopupActivity.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: popup });
      } catch (error) {
        console.error("Error fetching satisfactions:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      const { popupId, userId, activity } = req.body;
      try {
        if (activity === "view") {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const recentView = await PopupActivity.findOne({
            popupId,
            userId,
            activity: "view",
            createdAt: { $gte: fiveMinutesAgo },
          });

          if (recentView) {
            return res
              .status(200)
              .json({ success: true, message: "View recently recorded" });
          }
        }

        await PopupActivity.create({ popupId, userId, activity });
        return res
          .status(201)
          .json({ success: true, message: "Activity recorded" });
      } catch (error) {
        console.error("Error creating Popup:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
