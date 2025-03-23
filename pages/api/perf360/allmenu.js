// /api/perf360/allmenu
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

        // Build submenu grouped by menu
        const submenuByMenu = {};
        submenu.forEach((sub) => {
          if (!submenuByMenu[sub.menu]) submenuByMenu[sub.menu] = [];
          submenuByMenu[sub.menu].push(sub);
        });

        // Group data by group
        const grouped = {};

        menu.forEach((m) => {
          m.group.forEach((g) => {
            const relevantSub = (submenuByMenu[m._id] || []).filter((s) =>
              s.group.includes(g)
            );
            if (!grouped[g]) grouped[g] = [];
            grouped[g].push({ menu: m, submenu: relevantSub });
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
