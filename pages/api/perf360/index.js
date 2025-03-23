import connetMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";
import SubMenu from "@/database/models/Perf360/SubMenu";
import News from "@/database/models/Perf360/News";
import Popup from "@/database/models/Perf360/Popup"; // ✅ เพิ่ม import

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const menu = await Menu.find({ active: true }).sort({ order: 1 });
        const submenu = await SubMenu.find({ active: true }).sort({ order: 1 });
        const news = await News.find({ active: true });
        const popup = await Popup.find({ active: true }).sort({
          createdAt: -1,
        }); // ✅ ดึง popup

        // จัดกลุ่ม submenu เข้า menu
        const menuWithSubmenus = menu.map((m) => {
          const relatedSubmenus = submenu.filter(
            (s) => s.menu === m._id.toString()
          );
          return {
            ...m._doc,
            submenu: relatedSubmenus,
          };
        });

        // จัดกลุ่ม news ตาม category
        const groupedNews = news.reduce((acc, item) => {
          const category = item.category || "อื่นๆ";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});

        // ✅ ส่งออกทุกอย่างรวมกัน
        res.status(200).json({
          success: true,
          menu: menuWithSubmenus,
          news: groupedNews,
          popup: popup,
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
