import connetMongoDB from "@/lib/services/database/mongodb";
import PerfActivity from "@/database/models/Perf360/PerfActivity";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const activities = await PerfActivity.find();
        res.status(200).json({ success: true, data: activities });
      } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      const { userId } = req.body;
      try {
        const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

        const existingActivities = await PerfActivity.find({
          userId,
          createdAt: { $gte: oneHourAgo },
        });

        if (existingActivities.length > 0) {
          return res
            .status(200)
            .json({ success: true, message: "Activity recently recorded" });
        }

        const activity = await PerfActivity.create(req.body);
        res.status(201).json({ success: true, data: activity });
      } catch (error) {
        console.error("Error creating activity:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
