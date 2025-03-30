import connetMongoDB from "@/lib/services/database/mongodb";
import CostomerPermission from "@/database/models/CostomerPermission";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        // ดึงข้อมูล User ตาม userId
        const user = await Users.findOne({ userId: userId });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        // ดึงข้อมูล CostomerPermission
        const costomerPermission = await CostomerPermission.findOne();
        if (!costomerPermission) {
          return res
            .status(404)
            .json({ success: false, message: "Costomer Permission not found" });
        }

        // เช็คว่า user.empId อยู่ใน costomerPermission.users หรือไม่
        const hasUser = costomerPermission.users.includes(user.empId);

        return res.status(200).json({ success: true, hasUser });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
