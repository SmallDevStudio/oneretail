import connetMongoDB from "@/lib/services/database/mongodb";
import JoinEvent from "@/database/models/Checkin/JoinEvent";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    const { userId, eventCheckinId } = req.query;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const filter = {};
                if (eventCheckinId) filter.eventCheckinId = eventCheckinId;
                if (userId) filter['user.userId'] = userId;

                const joinEvents = await JoinEvent.find(filter);

                // ดึง userId จาก joinEvents
                const userIds = joinEvents.map(joinEvent => joinEvent.user.userId);

                // ดึงข้อมูล Users ทั้งหมดที่มี userId ตรงกัน
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl empId phone');

                // สร้าง Map เพื่อจับคู่ userId กับข้อมูล user
                const userMap = {};
                users.forEach(user => {
                    userMap[user.userId] = user;
                });

                // ใส่ข้อมูล user เข้าไปในแต่ละ joinEvent
                const joinEventsWithUsers = joinEvents.map(joinEvent => {
                    const user = userMap[joinEvent.user.userId];
                    return {
                        ...joinEvent._doc,
                        user: user ? user : joinEvent.user  // ถ้าไม่เจอ user ก็ใช้ค่าเดิม
                    };
                });

                res.status(200).json({ success: true, data: joinEventsWithUsers });
            } catch (error) {
                console.error("Error fetching join events:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const { eventCheckinId, user } = req.body;

                const existingJoin = await JoinEvent.findOne({ 
                    eventCheckinId: eventCheckinId, 
                    'user.userId': user.userId 
                });

                if (existingJoin) {
                    return res.status(200).json({ success: true, message: 'User already joined this event.' });
                }

                const joinEvent = await JoinEvent.create(req.body);
                res.status(201).json({ success: true, data: joinEvent });
            } catch (error) {
                console.error("Error in POST:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid method" });
            break;
    }
}
