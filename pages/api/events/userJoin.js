import connectMongoDB from "@/lib/services/database/mongodb";
import UserJoinEvent from "@/database/models/UserJoinEvent";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { eventId } = req.query;

                const userJoinEvent = await UserJoinEvent.findOne({ eventId: eventId });

                if (userJoinEvent === null) {
                    return res.status(200).json({ success: true, data: [] });
                }

                const empIds = userJoinEvent ? userJoinEvent.empId.map((empId) => empId) : [];

                const users = await Users.find({ empId: { $in: empIds } }).select('userId');

                const populatedUserJoinEvent = userJoinEvent ? {
                    ...userJoinEvent.toObject(),
                    empDetails: users, // เติมข้อมูล empId ที่เกี่ยวข้อง
                } : null;

                res.status(200).json({ success: true, data: populatedUserJoinEvent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const userJoinEvent = await UserJoinEvent.create(req.body);
                res.status(201).json(userJoinEvent);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { eventId } = req.query;
                const { empId } = req.body; // empId เป็นอาร์เรย์ที่ต้องการอัปเดตทั้งหมด
            
                const update = await UserJoinEvent.updateOne(
                    { eventId: eventId }, 
                    { $set: { empId: empId } }, // ใช้ $set เพื่อแทนที่ค่าเดิมทั้งหมด
                    { upsert: true } // ถ้าไม่มีเอกสารที่ตรงกัน ให้สร้างเอกสารใหม่
                );
            
                res.status(200).json({ success: true, data: update });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const userJoinEvent = await UserJoinEvent.findByIdAndDelete(id);
                if (!userJoinEvent) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: userJoinEvent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}