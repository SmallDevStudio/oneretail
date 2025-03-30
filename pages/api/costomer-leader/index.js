import connetMongoDB from "@/lib/services/database/mongodb";
import CostomerPermission from "@/database/models/CostomerPermission";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        // ใช้ findOne() เพื่อดึงข้อมูลที่มีแค่ record เดียว
        const costomerPermissions = await CostomerPermission.findOne();
        if (!costomerPermissions) {
          return res.status(404).json({ success: false, message: "Not found" });
        }

        // ตรวจสอบว่า users เป็น array ของ empId
        const empIds = costomerPermissions.users; // ดึงค่า empId โดยตรงจาก array

        // ตรวจสอบว่า empIds มีค่าหรือไม่
        if (empIds.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "No users found" });
        }

        // ดึงข้อมูล users ที่มี empId อยู่ใน empIds
        const users = await Users.find({ empId: { $in: empIds } });

        // แทนที่ users ด้วยข้อมูลที่ดึงมา
        const costomerPermissionsWithUsers = {
          ...costomerPermissions._doc,
          users: users, // หรืออาจต้องปรับการแสดงผลขึ้นอยู่กับความต้องการ
        };

        // ส่ง response กลับไป
        res
          .status(200)
          .json({ success: true, data: costomerPermissionsWithUsers });
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const existingCostomerPermission = await CostomerPermission.findOne();

        if (existingCostomerPermission) {
          // เมื่อมีการเพิ่มหรืออัพเดทข้อมูลผู้ใช้ ให้แน่ใจว่าเราอัพเดท users ด้วย
          const updatedUsers = req.body.users; // ค่าของ users ที่ส่งมาจาก request

          // อัพเดทข้อมูล users ใหม่
          const updatedCostomerPermission =
            await CostomerPermission.findByIdAndUpdate(
              existingCostomerPermission._id,
              { users: updatedUsers }, // อัพเดทเฉพาะ users
              { new: true }
            );

          res
            .status(200)
            .json({ success: true, data: updatedCostomerPermission });
        } else {
          const costomerPermission = await CostomerPermission.create(req.body);
          res.status(201).json({ success: true, data: costomerPermission });
        }
      } catch (error) {
        console.error("Error processing data:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const existingCostomerPermission = await CostomerPermission.findOne();

        if (existingCostomerPermission) {
          const updatedUsers = req.body.users; // ค่าของ users ที่ส่งมาจาก request

          // อัพเดทข้อมูล users ใหม่
          const updatedCostomerPermission =
            await CostomerPermission.findByIdAndUpdate(
              existingCostomerPermission._id,
              { users: updatedUsers }, // อัพเดทเฉพาะ users
              { new: true }
            );

          res
            .status(200)
            .json({ success: true, data: updatedCostomerPermission });
        } else {
          const costomerPermission = await CostomerPermission.create(req.body);
          res.status(201).json({ success: true, data: costomerPermission });
        }
      } catch (error) {
        console.error("Error processing data:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: "Invalid request method" });
      break;
  }
}
