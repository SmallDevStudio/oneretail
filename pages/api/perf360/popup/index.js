import connetMongoDB from "@/lib/services/database/mongodb";
import Popup from "@/database/models/Perf360/Popup";
import PopupActivity from "@/database/models/Perf360/PopupActivity";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const popups = await Popup.find({ active: true }).sort({
          createdAt: -1,
        });

        const popupIds = popups.map((popup) => popup._id);

        const activities = await PopupActivity.aggregate([
          { $match: { popupId: { $in: popupIds } } },
          {
            $group: {
              _id: { popupId: "$popupId", activity: "$activity" },
              count: { $sum: 1 },
            },
          },
        ]);

        const activityMap = {};

        activities.forEach(({ _id, count }) => {
          const { popupId, activity } = _id;
          if (!activityMap[popupId]) {
            activityMap[popupId] = { click: 0, views: 0 };
          }
          if (activity === "click") {
            activityMap[popupId].click = count;
          }
          if (activity === "view") {
            activityMap[popupId].views = count;
          }
        });

        const enrichedPopups = popups.map((popup) => ({
          ...popup.toObject(),
          click: activityMap[popup._id]?.click || 0,
          views: activityMap[popup._id]?.views || 0,
        }));

        enrichedPopups.sort((a, b) => b.click - a.click); // เรียงตามจำนวน click

        res.status(200).json({ success: true, data: enrichedPopups });
      } catch (error) {
        console.error("Error fetching popups:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const popup = await Popup.create(req.body);
        res.status(201).json({ success: true, data: popup });
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
