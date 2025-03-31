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
        // ✅ ดึงข้อมูล Users และ Emp
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

        const teamGroup = emp.teamGrop; // ✅ ใช้ teamGrop เพื่อตรวจสอบ group

        // ✅ ดึงเฉพาะ popup, news, menu, submenu ที่ group ตรงกับ teamGrop
        const popup = await Popup.find({
          active: true,
          group: { $in: teamGroup },
        }).sort({ createdAt: -1 });
        const news = await News.find({
          active: true,
          group: { $in: teamGroup },
        });
        const menu = await Menu.find({
          active: true,
          group: { $in: teamGroup },
        }).sort({ order: 1 });
        const submenu = await SubMenu.find({
          active: true,
          group: { $in: teamGroup },
        }).sort({ order: 1 });

        // ✅ จัดกลุ่ม submenu ตาม position
        const filteredSubMenu = submenu.filter((s) => {
          // ถ้า position เป็น [] หรือไม่มี ให้แสดงทั้งหมด
          if (!s.position || s.position.length === 0) return true;

          // ถ้า emp.position ตรงกับ submenu.position อย่างน้อย 1 ค่า ให้แสดงผล
          return emp.position && s.position.includes(emp.position);
        });

        // ✅ จัดกลุ่ม submenu เข้า menu
        const menuWithSubmenus = menu.map((m) => {
          const relatedSubmenus = submenu.filter(
            (s) => s.menu === m._id.toString()
          );
          return {
            ...m._doc,
            submenu: relatedSubmenus,
          };
        });

        // ✅ ดึง activity ของ news
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

        // ✅ ดึงจำนวน comments ของแต่ละ news
        const commentsCount = await NewsComments.aggregate([
          { $match: { newsId: { $in: newsIds } } },
          {
            $group: {
              _id: "$newsId",
              count: { $sum: 1 },
            },
          },
        ]);

        // ✅ แปลง commentsCount เป็น Map
        const commentsMap = commentsCount.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {});

        // ✅ รวม activity กับ news และเพิ่ม comments.length
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
          commentsLength: commentsMap[n._id] || 0, // ✅ เพิ่ม comments.length
        }));

        const filteredNews = enrichedNews.filter((n) => {
          // ถ้า news.position ไม่มีค่าให้แสดงทั้งหมด
          if (!n.position || n.position.length === 0) return true;

          // ถ้า news.position มีค่า ให้เช็คว่าตรงกับ emp.position หรือไม่
          return n.position.some((pos) =>
            userWithEmp.emp.position.includes(pos)
          );
        });

        // ✅ จัดกลุ่ม news ตาม category
        const groupedNews = filteredNews.reduce((acc, item) => {
          const category = item.category || "อื่นๆ";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});

        // ✅ ส่งออกทุกอย่างรวมกัน
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
