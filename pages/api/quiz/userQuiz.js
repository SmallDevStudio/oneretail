import connetMongoDB from "@/lib/services/database/mongodb";
import UserQuiz from "@/database/models/UserQuiz";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    if (method === 'GET') {
      const { userId } = req.query;
  
      try {
        const userQuiz = await UserQuiz.findOne({ userId });
        if (!userQuiz) {
          return res.status(200).json({ hasPlayedToday: false });
        }
  
        // ตรวจสอบว่ามี record วันนี้ที่ score > 0
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const hasPlayedToday = userQuiz.scores.some((score) => {
          const scoreDate = new Date(score.date);
          scoreDate.setHours(0, 0, 0, 0);
          return scoreDate.getTime() === today.getTime() && score.score > 0; // Check score > 0
        });
  
        res.status(200).json({ hasPlayedToday });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    } else if (method === 'POST') {
      const { userId, score } = req.body;
  
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        // ตรวจสอบว่า record วันนี้มีอยู่แล้วหรือไม่
        const userQuiz = await UserQuiz.findOneAndUpdate(
          {
            userId,
            'scores.date': { $gte: today },
          },
          { $set: { 'scores.$.score': score } }, // อัปเดตคะแนนหากมี record
          { upsert: false, new: true }
        );
  
        if (!userQuiz) {
          // หากไม่มี record สำหรับวันนี้ ให้เพิ่มใหม่
          await UserQuiz.findOneAndUpdate(
            { userId },
            {
              $push: { scores: { date: new Date(), score } },
            },
            { upsert: true, new: true }
          );
        }
  
        res.status(200).json({ message: 'Score saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
    
    