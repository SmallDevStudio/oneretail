import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            const { empId } = req.query;

            if (!empId) {
                return res.status(400).json({ error: 'empId is required' });
            }

            try {
                // ตรวจสอบว่ามีผู้ใช้งานที่มี empId นี้อยู่แล้วหรือไม่
                const existingUser = await Users.findOne({ empId });

                if (existingUser) {
                    // ถ้าเจอ ให้ส่ง response กลับพร้อมกับบอกว่า empId ถูกใช้งานแล้ว
                    return res.status(200).json({ exists: true });
                } else {
                    // ถ้าไม่เจอ ให้ส่ง response กลับพร้อมกับบอกว่า empId ยังไม่มีการใช้งาน
                    return res.status(200).json({ exists: false });
                }
            } catch (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ error: 'Database query error' });
            }
            break;
        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
};