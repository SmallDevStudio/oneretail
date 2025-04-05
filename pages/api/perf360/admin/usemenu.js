import connetMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";
import SubMenu from "@/database/models/Perf360/SubMenu";
import SubmenuActivity from "@/database/models/Perf360/SubmenuActivity";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const { group, startDate, endDate } = req.query;

        // ✅ ดึง SubMenu ทั้งหมด
        const allSubmenus = await SubMenu.find().lean();

        // ✅ ถ้ามี group → filter, ถ้าไม่มี → ใช้ทั้งหมด
        const filteredSubmenus = group
          ? allSubmenus.filter((s) => s.group === group)
          : allSubmenus;

        const allowedSubmenuIds = filteredSubmenus.map((s) => s._id.toString());

        // ✅ เงื่อนไข filter activity
        const activityFilter = {
          submenuId: { $in: allowedSubmenuIds },
        };

        if (startDate && endDate) {
          activityFilter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
        }

        // ✅ ดึง activity
        const activities = await SubmenuActivity.find(activityFilter).sort({
          createdAt: -1,
        });

        // ✅ ดึง Menu
        const menuIds = filteredSubmenus.map((s) => s.menu);
        const menus = await Menu.find({ _id: { $in: menuIds } }).lean();

        // ✅ ดึง Users และ Emp
        const userIds = activities.map((a) => a.userId);
        const users = await Users.find({ userId: { $in: userIds } }).select(
          "userId fullname pictureUrl empId"
        );
        const empIds = users.map((u) => u.empId);
        const emps = await Emp.find({ empId: { $in: empIds } });

        // ✅ รวมข้อมูล
        const result = activities.map((activity) => {
          const submenu = filteredSubmenus.find(
            (s) => s._id.toString() === activity.submenuId.toString()
          );
          const menu = menus.find((m) => m._id.toString() === submenu?.menu);
          const user = users.find((u) => u.userId === activity.userId);
          const emp = emps.find((e) => e.empId === user?.empId);

          return {
            menu: menu?.title || "ไม่พบเมนู",
            submenu: submenu?.title || "ไม่พบซับเมนู",
            group: submenu?.group || "",
            activity: activity.activity,
            createdAt: activity.createdAt,
            user: {
              ...user?._doc,
              ...(emp ? emp._doc : {}),
            },
          };
        });

        res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching submenu activity:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
