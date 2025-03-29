import connetMongoDB from "@/lib/services/database/mongodb";
import SubmenuActivity from "@/database/models/Perf360/SubmenuActivity";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const submenu = await SubmenuActivity.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: submenu });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      const { submenuId, userId, activity } = req.body;
      try {
        if (activity === "view") {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const recentSubMenu = await SubmenuActivity.findOne({
            submenuId,
            userId,
            activity: "view",
            createdAt: { $gte: fiveMinutesAgo },
          });

          if (recentSubMenu) {
            return res
              .status(200)
              .json({ success: true, message: "View recently recorded" });
          }
        }

        await SubmenuActivity.create({ submenuId, userId, activity });
        return res
          .status(201)
          .json({ success: true, message: "Activity recorded" });
      } catch (error) {
        console.error("Error creating SubMenu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
