import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    await connetMongoDB();
    if (req.method === "POST") {
        const { fullname, phone, address, pictureUrl, role, active, empId, userId } = req.body;

        // ตรวจสอบว่ามี empId ใน Emp collection หรือไม่
        const emp = await Emp.findOne({ empId });
        if (!emp) {
            res.status(400).json({ error: "empId not found" });
        }

         // ตรวจสอบว่า empId ไม่ซ้ำกับใน User collection
         const existingUser = await Users.findOne({ empId });
         if (existingUser) {
             res.status(400).json({ error: "empId already exists" });
         }

         const user = await Users.create({ fullname, phone, address, pictureUrl, role, active, empId, userId, birthdate: null });
         res.status(201).json({ user });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}