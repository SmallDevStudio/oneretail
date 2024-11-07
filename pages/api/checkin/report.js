import connectMongoDB from "@/lib/services/database/mongodb";
import Checkins from "@/database/models/Checkins";
import UserJoinEvent from "@/database/models/UserJoinEvent";
import Users from "@/database/models/users";
import mongoose from "mongoose";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "GET":
            const { eventId } = req.query;

            try {
                // ตรวจสอบว่า eventId มีรูปแบบที่ถูกต้องหรือไม่
                if (!mongoose.Types.ObjectId.isValid(eventId)) {
                    return res.status(400).json({ success: false, error: "Invalid eventId format" });
                }

                // ดึงข้อมูล checkins และ UserJoinEvent พร้อมกัน
                const [checkins, userJoinEvent] = await Promise.all([
                    Checkins.find({ eventId }).sort({ createdAt: -1 }),
                    UserJoinEvent.findOne({ eventId })
                ]);

                if (!checkins.length && !userJoinEvent) {
                    return res.status(404).json({ success: false, error: "Event or checkin data not found" });
                }

                // ดึง userId จาก checkins และ empId จาก UserJoinEvent
                const userIds = checkins.map((checkin) => checkin.userId);
                const empIds = userJoinEvent ? userJoinEvent.empId : [];

                // ดึงข้อมูลผู้ใช้จาก Users โดยใช้ userId และ empId ที่ดึงมา
                const users = await Users.find({ 
                    $or: [
                        { userId: { $in: userIds } }, 
                        { empId: { $in: empIds } }
                    ] 
                });

                // สร้างแผนที่ผู้ใช้ด้วย userId และ empId
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user; // ใช้ userId เป็นคีย์
                    acc[user.empId] = user; // ใช้ empId เป็นคีย์
                    return acc;
                }, {});

                // เติมข้อมูลผู้ใช้ใน checkins
                const populatedCheckins = checkins.map((checkin) => ({
                    ...checkin.toObject(),
                    user: userMap[checkin.userId] || null
                }));

                // เติมข้อมูลผู้ใช้ใน UserJoinEvent
                const populatedUserJoinEvent = userJoinEvent ? {
                    ...userJoinEvent.toObject(),
                    empDetails: empIds.map((empId) => userMap[empId] || null).filter(Boolean) // เติมข้อมูล empId ที่เกี่ยวข้อง
                } : null;

                // ส่งข้อมูลกลับ
                res.status(200).json({ success: true, data: populatedCheckins, join: populatedUserJoinEvent });
            } catch (error) {
                console.error("Error fetching report data:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}
