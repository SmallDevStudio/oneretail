import connetMongoDB from "@/lib/services/database/mongodb";
import News from "@/database/models/Perf360/News";
import NewsActivity from "@/database/models/Perf360/NewsActivity";
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
        const newsFilter = { active: true };
        if (group) {
          newsFilter.group = { $in: [group] };
        }

        // ดึง News ทั้งหมดที่ตรงกับเงื่อนไข
        const newss = await News.find(newsFilter).sort({ createdAt: -1 });
        const newsIds = newss.map((p) => p._id);

        // filter NewsActivity
        const activityFilter = {
          newsId: { $in: newsIds },
        };

        if (startDate || endDate) {
          activityFilter.createdAt = {};
          if (startDate) activityFilter.createdAt.$gte = new Date(startDate);
          if (endDate) activityFilter.createdAt.$lte = new Date(endDate);
        }

        const activities = await NewsActivity.find(activityFilter).lean();
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

        // แปลง News ให้มี click/view activity
        const enrichedNews = newss.map((news) => {
          const relatedActs = activities.filter(
            (act) => act.newsId.toString() === news._id.toString()
          );

          const click = relatedActs
            .filter((a) => a.activity === "click")
            .map((a) => ({
              ...a,
              createdAt: a.createdAt?.toISOString(),
              ...userMap[a.userId],
            }));

          const views = relatedActs
            .filter((a) => a.activity === "view")
            .map((a) => ({
              ...a,
              createdAt: a.createdAt?.toISOString(),
              ...userMap[a.userId],
            }));

          return {
            ...news.toObject(),
            createdAt: news.createdAt?.toISOString(),
            click,
            views,
          };
        });

        res.status(200).json({ success: true, data: enrichedNews });
      } catch (error) {
        console.error("Error fetching News activity:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
