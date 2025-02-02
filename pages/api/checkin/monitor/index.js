import connectMongoDB from "@/lib/services/database/mongodb";
import AdminCheckIns from "@/database/models/AdminCheckIns";
import Checkins from "@/database/models/Checkins";
import UserJoinEvent from "@/database/models/UserJoinEvent";
import Users from "@/database/models/users";
import Event from "@/database/models/Event";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // ดึงข้อมูล AdminCheckIns ทั้งหมด และเรียงตาม createdAt (ล่าสุดก่อน)
                const adminCheckins = await AdminCheckIns.find().sort({ createdAt: -1 });

                // ดึง eventIds ที่เกี่ยวข้องจาก AdminCheckIns
                const eventIds = [...new Set(adminCheckins.map((c) => c.eventId))];

                // ดึงเฉพาะ events ที่มีอยู่จริงในฐานข้อมูล
                const events = await Event.find({ _id: { $in: eventIds } });

                // ดึงเฉพาะ eventIds ที่มีอยู่ใน Event จริง
                const validEventIds = events.map(event => event._id.toString());

                // ดึง checkins ที่ eventId อยู่ใน validEventIds เท่านั้น
                const checkins = await Checkins.find({ eventId: { $in: validEventIds } });

                // ดึงข้อมูล UserJoinEvent ตาม eventId ที่ valid
                const userJoinEvents = await UserJoinEvent.find({ eventId: { $in: validEventIds } });

                // ดึง empId ทั้งหมดจาก UserJoinEvent
                const empIds = [...new Set(userJoinEvents.flatMap(uj => uj.empId))];

                // ดึงข้อมูล Users ที่มี empId ตรงกับ UserJoinEvent
                const usersByEmpId = await Users.find({ empId: { $in: empIds } });

                // ดึง userIds ที่เกี่ยวข้องจากทั้ง AdminCheckIns และ Checkins
                const adminUserIds = [...new Set(adminCheckins.map((c) => c.userId))];
                const checkinUserIds = [...new Set(checkins.map((c) => c.userId))];
                const userIds = [...new Set([...adminUserIds, ...checkinUserIds])];

                const users = await Users.find({ userId: { $in: userIds } });

                // Mapping Event และ User เพื่อให้ค้นหาได้เร็วขึ้น
                const eventMap = events.reduce((acc, event) => {
                    acc[event._id.toString()] = event;
                    return acc;
                }, {});

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId.toString()] = user;
                    return acc;
                }, {});

                const userMapByEmpId = usersByEmpId.reduce((acc, user) => {
                    acc[user.empId] = user;
                    return acc;
                }, {});

                // กรอง AdminCheckIns ที่ eventId ไม่มีใน events จริง
                const filteredAdminCheckins = adminCheckins.filter(ac => validEventIds.includes(ac.eventId));

                // จัดกลุ่มข้อมูลตาม eventId และเรียงตาม createdAt ของ AdminCheckIns
                const groupedEvents = filteredAdminCheckins.map((adminCheckin) => {
                    const eventId = adminCheckin.eventId;

                    return {
                        event: eventMap[eventId] || null, // ข้อมูล event
                        adminCheckins: {
                            user: userMap[adminCheckin.userId] || null,
                            on: adminCheckin.on,
                            point: adminCheckin.point,
                            coins: adminCheckin.coins,
                            createdAt: adminCheckin.createdAt,
                        },
                        checkin: checkins
                            .filter((c) => c.eventId === eventId)
                            .map((c) => ({
                                user: userMap[c.userId] || null,
                                createdAt: c.createdAt,
                            })),
                        userJoin: userJoinEvents
                            .filter((uj) => uj.eventId === eventId)
                            .flatMap((uj) => uj.empId.map(empId => userMapByEmpId[empId] || null))
                            .filter(Boolean), // กรองค่า null ออก
                    };
                });

                res.status(200).json({ success: true, data: groupedEvents });
            } catch (error) {
                console.error("Error fetching check-ins:", error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            break;

        case "POST":
            try {
                const checkin = await Checkins.create(req.body);
                res.status(201).json({ success: true, data: checkin });
            } catch (error) {
                console.error("Error creating check-in:", error);
                res.status(400).json({ success: false, message: "Bad Request" });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method Not Allowed" });
            break;
    }
}
