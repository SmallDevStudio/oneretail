import connectMongoDB from "@/lib/services/database/mongodb";
import AdminCheckIns from "@/database/models/AdminCheckIns";
import Checkins from "@/database/models/Checkins";
import UserJoinEvent from "@/database/models/UserJoinEvent";
import Users from "@/database/models/users";
import Event from "@/database/models/Event";

export default async function handler(req, res) {
    const { method } = req;
    const { eventId } = req.query;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // ตรวจสอบว่า eventId ถูกส่งมาหรือไม่
                if (!eventId) {
                    return res.status(400).json({ success: false, message: "Missing eventId" });
                }

                // ดึงข้อมูล Event
                const event = await Event.findById(eventId);
                if (!event) {
                    return res.status(404).json({ success: false, message: "Event not found" });
                }

                // ดึงข้อมูล AdminCheckIn
                const adminCheckin = await AdminCheckIns.findOne({ eventId }).sort({ createdAt: -1 });

                // ดึงข้อมูล Checkins และเรียงจากล่าสุดไปเก่าสุด
                const checkins = await Checkins.find({ eventId }).sort({ createdAt: -1 });

                // ดึงข้อมูล UserJoinEvent
                const userJoinEvent = await UserJoinEvent.findOne({ eventId });

                // ดึง userIds จาก adminCheckin และ checkins
                const userIds = [
                    ...(adminCheckin ? [adminCheckin.userId] : []),
                    ...new Set(checkins.map((c) => c.userId))
                ];

                // ดึงข้อมูล Users ตาม userId
                const users = await Users.find({ userId: { $in: userIds } });

                // ดึง empIds จาก UserJoinEvent
                const empIds = userJoinEvent ? userJoinEvent.empId : [];

                // ดึงข้อมูล Users ตาม empId
                const usersByEmpId = await Users.find({ empId: { $in: empIds } });

                // Mapping users
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const userMapByEmpId = usersByEmpId.reduce((acc, user) => {
                    acc[user.empId] = user;
                    return acc;
                }, {});

                // สร้าง Response Object
                const responseData = {
                    event,
                    adminCheckin: adminCheckin
                        ? {
                            user: userMap[adminCheckin.userId] || null,
                            on: adminCheckin.on,
                            point: adminCheckin.point,
                            coins: adminCheckin.coins,
                            createdAt: adminCheckin.createdAt,
                            id: adminCheckin._id
                        }
                        : null,
                    checkin: checkins.map((c) => ({
                        user: userMap[c.userId] || null,
                        createdAt: c.createdAt,
                    })),
                    userJoin: empIds.map(empId => userMapByEmpId[empId] || null).filter(Boolean),
                };

                res.status(200).json({ success: true, data: responseData });
            } catch (error) {
                console.error("Error fetching check-in data:", error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            break;
           
        default:
            res.status(405).json({ success: false, message: "Method Not Allowed" });
            break;
    }
}
