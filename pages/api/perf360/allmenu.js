import connetMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";
import SubMenu from "@/database/models/Perf360/SubMenu";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const menu = await Menu.find().sort({ order: 1 }).lean();
        const submenu = await SubMenu.find().sort({ order: 1 }).lean();

        // Group submenu by menuId
        const submenuByMenu = {};
        submenu.forEach((sub) => {
          if (!submenuByMenu[sub.menu]) submenuByMenu[sub.menu] = [];
          submenuByMenu[sub.menu].push(sub);
        });

        // Group menus by group string
        const grouped = {};
        menu.forEach((m) => {
          const g = m.group;
          if (!grouped[g]) grouped[g] = [];
          grouped[g].push({
            menu: m,
            submenu: submenuByMenu[m._id?.toString()] || [],
          });
        });

        res.status(200).json({ success: true, data: grouped });
      } catch (error) {
        console.error("Error fetching Menu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
