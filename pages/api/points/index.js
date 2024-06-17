import connetMongoDB from "@/lib/services/database/mongodb";
import UserQuiz from "@/database/models/UserQuiz";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  await connetMongoDB();
  if (req.method === 'POST') {
    try {
      const { userId, points } = req.body;

      if (!userId || points === undefined) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      // ตรวจสอบว่าผู้ใช้เล่นเกมครั้งล่าสุดเมื่อใด
      const user = await UserQuiz.findOne({ userId });
      const now = new Date();
      const lastPlayed = user.lastPlayed ? new Date(user.lastPlayed) : null;
      const isSameDay = lastPlayed && now.toDateString() === lastPlayed.toDateString();

      if (isSameDay) {
        return res.status(400).json({ success: false, message: 'You can only play the quiz once per day' });
      }

      // บันทึกข้อมูลใน collection "point"
      const pointEntry = new Point({
        userId,
        description: 'Quiz Game',
        type: 'earn',
        contentId: null,
        point: points,
      });
      await pointEntry.save();

      // อัปเดตเวลาที่เล่นเกมครั้งล่าสุดและบันทึกคะแนนในประวัติ
      user.lastPlayed = now;
      user.scores.push({ score: points });
      await user.save();

      // ส่งข้อความไปที่ LINE
      const message = `คุณได้รับ ${points} คะแนนจากการเล่น Quiz Game!`;
      sendLineMessage(userId, message);

      res.status(201).json({ success: true, data: pointEntry });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const points = await Point.find({});
      res.status(200).json({ success: true, data: points });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
