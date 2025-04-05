import connetMongoDB from "@/lib/services/database/mongodb";
import Popup from "@/database/models/Perf360/Popup";
import PopupActivity from "@/database/models/Perf360/PopupActivity";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const { group, startDate, endDate } = req.query;

        // สร้าง filter พื้นฐาน
        const popupFilter = { active: true };
        if (group) {
          popupFilter.group = { $in: [group] };
        }

        // ดึง popup ทั้งหมดที่ตรงกับเงื่อนไข
        const popups = await Popup.find(popupFilter).sort({ createdAt: -1 });
        const popupIds = popups.map((p) => p._id);

        // filter popupActivity
        const activityFilter = {
          popupId: { $in: popupIds },
        };

        if (startDate || endDate) {
          activityFilter.createdAt = {};
          if (startDate) activityFilter.createdAt.$gte = new Date(startDate);
          if (endDate) activityFilter.createdAt.$lte = new Date(endDate);
        }

        const activities = await PopupActivity.find(activityFilter).lean();
        const userIds = [...new Set(activities.map((a) => a.userId))];
        const users = await Users.find({ userId: { $in: userIds } })
          .select("empId userId fullname pictureUrl")
          .lean();
        const empIds = users.map((u) => u.empId);
        const emps = await Emp.find({ empId: { $in: empIds } })
          .select("empId teamGrop position")
          .lean();

        // Map users และ emp เพื่อใช้งานง่าย
        const userMap = {};
        users.forEach((u) => {
          const emp = emps.find((e) => e.empId === u.empId);
          userMap[u.userId] = { ...u, ...(emp || {}) };
        });

        // แปลง popup ให้มี click/view activity
        const enrichedPopup = popups.map((popup) => {
          const relatedActs = activities.filter(
            (act) => act.popupId.toString() === popup._id.toString()
          );

          const click = relatedActs
            .filter((a) => a.activity === "click")
            .map((a) => ({
              ...a,
              ...userMap[a.userId],
            }));

          const views = relatedActs
            .filter((a) => a.activity === "view")
            .map((a) => ({
              ...a,
              ...userMap[a.userId],
            }));

          return {
            ...popup.toObject(),
            click,
            views,
          };
        });

        res.status(200).json({ success: true, data: enrichedPopup });
      } catch (error) {
        console.error("Error fetching popup activity:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
