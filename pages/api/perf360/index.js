import connetMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";
import SubMenu from "@/database/models/Perf360/SubMenu";
import News from "@/database/models/Perf360/News";
import NewsComments from "@/database/models/Perf360/NewsComments";
import Popup from "@/database/models/Perf360/Popup";
import NewsActivity from "@/database/models/Perf360/NewsActivity";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const users = await Users.findOne({ active: true, userId: userId });
        if (!users) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        const emp = await Emp.findOne({ empId: users.empId });
        if (!emp) {
          return res
            .status(404)
            .json({ success: false, message: "Emp not found" });
        }

        const teamGroup = emp.teamGrop;
        const now = new Date(); // เวลาปัจจุบัน

        // ✅ กรอง popup และ news ตามช่วงเวลา
        const popup = await Popup.find({
          active: true,
          group: { $in: teamGroup },
          $or: [
            { start_date: { $exists: false }, end_date: { $exists: false } }, // ไม่มี start_date, end_date
            { start_date: { $lte: now }, end_date: { $exists: false } }, // มี start_date แต่ไม่มี end_date
            { start_date: { $exists: false }, end_date: { $gte: now } }, // ไม่มี start_date แต่มี end_date
            { start_date: { $lte: now }, end_date: { $gte: now } }, // อยู่ในช่วงระหว่าง start_date และ end_date
          ],
        }).sort({ createdAt: -1 });

        const news = await News.find({
          active: true,
          group: { $in: teamGroup },
          $or: [
            { start_date: { $exists: false }, end_date: { $exists: false } },
            { start_date: { $lte: now }, end_date: { $exists: false } },
            { start_date: { $exists: false }, end_date: { $gte: now } },
            { start_date: { $lte: now }, end_date: { $gte: now } },
          ],
        });

        const menu = await Menu.find({
          active: true,
          group: { $in: teamGroup },
        }).sort({ order: 1 });

        const submenu = await SubMenu.find({
          active: true,
          group: { $in: teamGroup },
        }).sort({ order: 1 });

        const filteredSubMenu = submenu.filter((s) => {
          if (!s.position || s.position.length === 0) return true;
          return emp.position && s.position.includes(emp.position);
        });

        const menuWithSubmenus = menu.map((m) => {
          const relatedSubmenus = filteredSubMenu.filter(
            (s) => s.menu === m._id.toString()
          );
          return {
            ...m._doc,
            submenu: relatedSubmenus,
          };
        });

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

        const commentsCount = await NewsComments.aggregate([
          { $match: { newsId: { $in: newsIds } } },
          {
            $group: {
              _id: "$newsId",
              count: { $sum: 1 },
            },
          },
        ]);

        const commentsMap = commentsCount.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {});

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

        const enrichedNews = news.map((n) => ({
          ...n.toObject(),
          click: activityMap[n._id]?.click || 0,
          views: activityMap[n._id]?.views || 0,
          commentsLength: commentsMap[n._id] || 0,
        }));

        const filteredNews = enrichedNews.filter((n) => {
          if (!n.position || n.position.length === 0) return true;
          return n.position.some((pos) => emp.position.includes(pos));
        });

        const groupedNews = filteredNews.reduce((acc, item) => {
          const category = item.category || "อื่นๆ";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});

        res.status(200).json({
          success: true,
          user: { ...users._doc, emp },
          menu: menuWithSubmenus,
          news: groupedNews,
          popup,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
