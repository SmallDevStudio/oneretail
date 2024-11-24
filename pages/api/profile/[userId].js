import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import Level from "@/database/models/Level";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";

export default async function handler(req, res) {
    const { userId } = req.query;
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const user = await Users.findOne({ userId: userId });
                const emp = await Emp.findOne({ empId: user.empId });

                const points = await Point.find({ userId });

                const pointData = points.reduce((acc, point) => {
                    if (point.type === 'earn') {
                      acc.totalPoints += point.point;
                      acc.point += point.point;
                    } else if (point.type === 'pay') {
                      acc.point -= point.point;
                    }
                    return acc;
                  }, { point: 0, totalPoints: 0 });
                // คำนวณคะแนนรวมและ totalPoints
                const levels = await Level.find().sort({ level: 1 });

                if (!levels || levels.length === 0) {
                return res.status(404).json({ success: false, message: 'No levels found' });
                }
        
                // หาระดับเลเวลของผู้ใช้จาก totalPoints
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
        
                // สร้างข้อมูลที่ต้องการแสดงผล
                const pointResoult = {
                    point: pointData.point,
                    totalPoints: pointData.totalPoints,
                };

                const coins = await Coins.find({ userId });
        
                const totalEarn = coins
                .filter(coin => coin.type === 'earn')
                .reduce((sum, coin) => sum + coin.coins, 0);
            
                const totalPay = coins
                .filter(coin => coin.type === 'pay')
                .reduce((sum, coin) => sum + coin.coins, 0);
            
                const balance = totalEarn - totalPay;

                const coinsData = {
                totalCoins:totalEarn,
                coins: balance,
                };

                res.status(200).json({ success: true, data: { 
                        user, 
                        emp,
                        level: userLevel,
                        points: pointResoult,
                        coins: coinsData
                }});
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}