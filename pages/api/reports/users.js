import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Level from "@/database/models/Level";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === "GET") {
        const { skip = 0, limit = 100 } = req.query;

        try {
            const users = await Users.find({})
                .skip(Number(skip))
                .limit(Number(limit));

            if (users.length === 0) {
                return res.status(200).json({ success: true, data: [] }); // ส่งข้อมูลเปล่าหากไม่มีผู้ใช้ในหน้า
            }

            const empId = users.map(user => user.empId);
            const emps = await Emp.find({ empId: { $in: empId } });
            const empMap = emps.reduce((acc, emp) => {
                acc[emp.empId] = emp;
                return acc;
            }, {});

            const userIds = users.map(user => user.userId);

            const points = await Point.find({ userId: { $in: userIds } });
            const coins = await Coins.find({ userId: { $in: userIds } });
            const levels = await Level.find().sort({ level: 1 });

            const populatedUsers = users.map(user => {
                user = user.toObject();
                const emp = empMap[user.empId] || {};

                const userPoints = points.filter(point => point.userId === user.userId);
                const pointData = userPoints.reduce((acc, point) => {
                    if (point.type === 'earn') {
                        acc.totalPoints += point.point;
                        acc.point += point.point;
                    } else if (point.type === 'pay') {
                        acc.point -= point.point;
                    }
                    return acc;
                }, { point: 0, totalPoints: 0 });

                const userCoins = coins.filter(coin => coin.userId === user.userId);
                const coinsData = userCoins.reduce((acc, coin) => {
                    if (coin.type === 'earn') {
                        acc.totalCoins += coin.coins;
                        acc.coins += coin.coins;
                    } else if (coin.type === 'pay') {
                        acc.coins -= coin.coins;
                    }
                    return acc;
                }, { coins: 0, totalCoins: 0 });
                
                let userLevel = 1;
                let requiredPoints = 0;
                let nextLevelRequiredPoints = 0;

                for (const level of levels) {
                if (pointData.totalPoints >= level.requiredPoints) {
                        userLevel = level.level;
                        requiredPoints = level.requiredPoints;
                    } else {
                        nextLevelRequiredPoints = level.requiredPoints;
                        break;
                    }
                }

                return {
                    ...user,
                    teamGrop: emp.teamGrop || '',
                    sex: emp.sex || '',
                    branch: emp.branch || '',
                    department: emp.department || '',
                    group: emp.group || '',
                    chief_th: emp.chief_th || '',
                    chief_eng: emp.chief_eng || '',
                    position: emp.position || '',
                    point: pointData.point || 0,
                    totalPoints: pointData.totalPoints || 0,
                    coins: coinsData.coins || 0,
                    totalCoins: coinsData.totalCoins || 0,
                    level: userLevel,
                };
            });

            return res.status(200).json({ success: true, data: populatedUsers });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
