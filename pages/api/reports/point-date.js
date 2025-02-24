import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const { startDate, endDate } = req.query;

                // ดึงข้อมูล Points ตามช่วงวันที่
                const points = await Point.find({
                    type: "earn",
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                });

                // ดึงข้อมูล Coins ตามช่วงวันที่
                const coins = await Coins.find({
                    type: "earn",
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                });

                // รวม userId จากทั้ง Points และ Coins
                const userIds = new Set([
                    ...points.map(point => point.userId),
                    ...coins.map(coin => coin.userId)
                ]);

                // ดึงข้อมูล Users ที่เกี่ยวข้อง
                const users = await Users.find({ userId: { $in: [...userIds] } })
                    .select("empId fullname userId phone");

                // ดึง empId ของ Users และดึงข้อมูล Emp
                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } });

                // สร้าง Map สำหรับ lookup ข้อมูล Users และ Emp
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                // แมปข้อมูล Users และ Emp ให้กับ Points
                const mappedPoints = points.map(point => {
                    const user = userMap[point.userId] || {};
                    const emp = empMap[user.empId] || {};

                    return {
                        ...point.toObject(),
                        userId: user.userId || null,
                        empId: user.empId || null,
                        fullname: user.fullname || null,
                        phone: user.phone || null,
                        empData: emp || null,
                    };
                });

                // แมปข้อมูล Users และ Emp ให้กับ Coins
                const mappedCoins = coins.map(coin => {
                    const user = userMap[coin.userId] || {};
                    const emp = empMap[user.empId] || {};

                    return {
                        ...coin.toObject(),
                        userId: user.userId || null,
                        empId: user.empId || null,
                        fullname: user.fullname || null,
                        phone: user.phone || null,
                        empData: emp || null,
                    };
                });

                // คำนวณ Total Points และ Total Coins
                const totalPoints = points.reduce((sum, point) => sum + (point.point || 0), 0);
                const totalCoins = coins.reduce((sum, coin) => sum + (coin.coins || 0), 0);

                res.status(200).json({
                    success: true,
                    points: mappedPoints,
                    coins: mappedCoins,
                    totalPoints,
                    totalCoins
                });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, error: "Method not allowed" });
            break;
    }
}
