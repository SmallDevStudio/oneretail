import connetMongoDB from "@/lib/services/database/mongodb";
import Emp from "@/database/models/emp";

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
                // ตรวจสอบว่ามีข้อมูล `emp` ที่มี empId นี้หรือไม่
                const empRecord = await Emp.findOne({ empId });

                if (empRecord) {
                    // ถ้าเจอ `empId` ตรงกับในระบบ ให้ส่งข้อมูล `name` กลับ
                    return res.status(200).json({ exists: true, name: empRecord.name });
                } else {
                    // ถ้าไม่เจอ `empId` ในระบบ
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
}
