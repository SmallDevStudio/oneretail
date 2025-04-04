// /api/perf360/admin/usetime
import connetMongoDB from "@/lib/services/database/mongodb";
import PerfActivity from "@/database/models/Perf360/PerfActivity";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        // 1. ดึงกิจกรรมทั้งหมด
        const activities = await PerfActivity.find().sort({ createdAt: -1 });

        // 2. ดึง Users ที่เกี่ยวข้อง
        const userIds = activities.map((a) => a.userId);
        const users = await Users.find({ userId: { $in: userIds } });

        // 3. ดึง Emp ที่เกี่ยวข้อง
        const empIds = users.map((u) => u.empId);
        const emps = await Emp.find({ empId: { $in: empIds } });

        // 4. รวมข้อมูลเข้าด้วยกัน
        const data = activities.map((activity) => {
          const user = users.find((u) => u.userId === activity.userId);
          const emp = emps.find((e) => e.empId === user?.empId);

          return {
            user: {
              ...user?._doc,
              emp: emp || null,
            },
            createdAt: activity.createdAt,
          };
        });

        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
