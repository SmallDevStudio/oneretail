import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Point from "@/database/models/Point";


export default async function handler(req, res) {
    const { userId } = req.query;
    await connetMongoDB();

    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
      }

    if (req.method === "GET") {
        try {
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

           

            res.status(200).json({
            userId,
            point: pointData.point,
            totalpoint: pointData.totalPoints,
            });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    } else {
        res.status(400).json({ success: false });
    }
}