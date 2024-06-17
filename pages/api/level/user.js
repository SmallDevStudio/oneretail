import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import Level from "@/database/models/Level";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            // ดึงข้อมูลผู้ใช้
            const user = await Users.findOne({ userId });
    
            if (!user) {
              return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            // ดึงข้อมูลคะแนนของผู้ใช้ทั้งหมด
            const points = await Point.find({ userId });
    
            if (!points || points.length === 0) {
              return res.status(404).json({ success: false, message: 'No points found for this user' });
            }
    
            // คำนวณคะแนนรวมและ totalPoints
            const pointData = points.reduce((acc, point) => {
              if (point.type === 'earn') {
                acc.totalPoints += point.point;
                acc.point += point.point;
              } else if (point.type === 'pay') {
                acc.point -= point.point;
              }
              return acc;
            }, { point: 0, totalPoints: 0 });
    
            // ดึงข้อมูลเลเวล
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
    
            const levelPoint = pointData.totalPoints - requiredPoints;
    
            // สร้างข้อมูลที่ต้องการแสดงผล
            const result = {
              user: {
                fullname: user.fullname,
                phone: user.phone,
                address: user.address,
                pictureUrl: user.pictureUrl,
                role: user.role,
                active: user.active,
                empId: user.empId,
                userId: user.userId
              },
              point: pointData.point,
              totalPoints: pointData.totalPoints,
              level: userLevel,
              requiredPoints: requiredPoints,
              nextLevelRequiredPoints: nextLevelRequiredPoints,
              levelPoint: levelPoint
            };
    
            res.status(200).json(result);
          } catch (error) {
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, message: 'Method not allowed' });
          break;
      }
    }