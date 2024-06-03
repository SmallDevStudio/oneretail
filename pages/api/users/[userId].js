import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Point from "@/database/models/Point";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { userId } = req.query;
        await connetMongoDB();
        const user = await Users.findOne({ userId: userId });
        res.status(200).json({ user });
    } else if (req.method === 'PUT') {
        const { userId } = req.query;
        try {
          const { points } = req.body;
    
          if (!points) {
            return res.status(400).json({ success: false, message: 'Points are required' });
          }
    
          // อัปเดตคะแนนของผู้ใช้โดยใช้ userId
          const user = await Users.findOneAndUpdate(
            { userId },
            { $inc: { points: points } },
            { new: true }
          );
    
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
    
          // เพิ่มข้อมูลใน collection "point"
          const pointEntry = new Point({
            userId: userId,
            description: "Quiz Game",
            type: "earn",
            point: points,
          });
          await pointEntry.save();
    
          res.status(200).json({ success: true, data: user });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }
};


