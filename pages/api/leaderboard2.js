import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
      case 'GET':
        try {
          // กำหนดวันที่เริ่มต้น
          const startDate = new Date('2024-08-15T00:00:00Z');
          // ดึงข้อมูลคะแนนของผู้ใช้ทั้งหมด
          const points = await Point.find({ createdAt: { $gte: startDate } });
  
          // รวมคะแนนของผู้ใช้แต่ละคน
          const userPoints = points.reduce((acc, point) => {
            const userId = point.userId.toString();
            if (!acc[userId]) {
              acc[userId] = { userId, totalPoints: 0 };
            }
            if (point.type === 'earn') {
              acc[userId].totalPoints += point.point;
            }
            return acc;
          }, {});
  
          // แปลงผลลัพธ์เป็นอาเรย์
          const userPointsArray = Object.values(userPoints);
  
          // ดึงข้อมูลผู้ใช้และรวมกับคะแนน
          const users = await Users.find({ userId: { $in: userPointsArray.map(up => up.userId) } });
  
          const leaderboard = userPointsArray.map(up => {
            const user = users.find(u => u.userId === up.userId);
            return {
              userId: up.userId,
              fullname: user ? user.fullname : "Unknown User",
              pictureUrl: user ? user.pictureUrl : null,
              totalPoints: up.totalPoints,
            };
          });
  
          // จัดอันดับตามคะแนน
          leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
  
          res.status(200).json({ success: true, data: leaderboard });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
        break;
      default:
        res.status(400).json({ success: false, message: 'Method not allowed' });
        break;
    }
}