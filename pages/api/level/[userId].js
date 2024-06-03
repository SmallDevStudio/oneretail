import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Level from "@/database/models/Level";

export default async function handler(req, res) {
    const { method, query: { userId } } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            // คำนวณคะแนนรวมของผู้ใช้
            const points = await Point.find({ userId: userId });
    
            if (!points || points.length === 0) {
              return res.status(404).json({ success: false, message: 'No points found for this user' });
            }
    
            const totalPoints = points.reduce((acc, point) => {
              if (point.type === 'earn') {
                return acc + point.point;
              } else if (point.type === 'pay') {
                return acc - point.point;
              }
              return acc;
            }, 0);
    
            // หาระดับเลเวลของผู้ใช้
            const levels = await Level.find().sort({ level: 1 });
            let userLevel = 1;
    
            for (const level of levels) {
              if (totalPoints >= level.requiredPoints) {
                userLevel = level.level;
              } else {
                break;
              }
            }
    
            res.status(200).json({ level: userLevel, points: totalPoints });
          } catch (error) {
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, message: 'Method not allowed' });
          break;
      }
};