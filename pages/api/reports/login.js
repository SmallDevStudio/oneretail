import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // ดึงข้อมูล Point ที่มี description เป็น "Login Reward"
                const points = await Point.find({ description: "Login Reward" }).sort({ createdAt: -1 });
                
                // ดึง userId จากข้อมูล Point
                const userIds = points.map(point => point.userId);
                
                // ดึงข้อมูล Users ที่มี userId ตรงกัน
                const users = await Users.find({ userId: { $in: userIds } });

                // สร้าง map ของ Users สำหรับการเข้าถึงที่ง่าย
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // รวมข้อมูล Point และ Users
                const populatedData = points.map(point => {
                    const user = userMap[point.userId];
                    
                    return {
                        userId: point.userId,
                        empId: user ? user.empId : null,
                        fullname: user ? user.fullname : null,
                        date: moment(point.createdAt).format('D'),
                        month: moment(point.createdAt).format('MMMM'),
                        createdAt: moment(point.createdAt).format('LLL'),
                    };
                });

                res.status(200).json({ success: true, data: populatedData });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}
