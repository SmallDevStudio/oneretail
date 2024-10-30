// pages/api/points.js
import connectMongoDB from "@/lib/services/database/mongodb";
import UserQuiz from "@/database/models/UserQuiz";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  await connectMongoDB();
  if (req.method === 'POST') {
    try {
      const { userId, points } = req.body;

      if (!userId || points === undefined) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const now = new Date();
      const today = now.toDateString();

      // ตรวจสอบว่าผู้ใช้มีข้อมูลใน UserQuiz หรือไม่
      let user = await UserQuiz.findOne({ userId });

      // ถ้าไม่มี ให้สร้างข้อมูลใหม่
      if (!user) {
        user = new UserQuiz({ userId, scores: [] });
      }

      // ตรวจสอบว่าผู้ใช้ได้รับคะแนนในวันนี้หรือยัง
      const hasPlayedToday = user.scores.some(score => new Date(score.date).toDateString() === today);

      if (hasPlayedToday) {
        // ถ้าเคยเล่นแล้ววันนี้ ให้บันทึกเวลาเล่นและคะแนน แต่ไม่เพิ่มคะแนนอีก
        user.scores.push({ score: 0 });
      } else {
        // บันทึกคะแนนในประวัติ
        user.scores.push({ score: points });

        if (points > 0) {
          // ถ้ายังไม่เคยเล่นวันนี้และคะแนนมากกว่า 0 ให้บันทึกเวลาเล่นและคะแนน พร้อมทั้งเพิ่มคะแนน
          const pointEntry = new Point({
            userId,
            description: 'Quiz Game',
            type: 'earn',
            contentId: null,
            point: points,
            path: 'quiz',
            subpath: null,
          });
          await pointEntry.save();

          // ส่งข้อความไปที่ LINE
          const message = `คุณได้รับ ${points} คะแนนจากการเล่น Quiz Game!`;
          sendLineMessage(userId, message);
        }
      }

      await user.save();

      res.status(201).json({ success: true, data: user });
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
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
