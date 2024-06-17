// pages/api/userQuiz.js
import connectMongoDB from "@/lib/services/database/mongodb";
import UserQuiz from "@/database/models/UserQuiz";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    try {
      const { userId, score, date } = req.body;

      if (!userId || score === undefined || !date) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const userQuiz = new UserQuiz({
        userId,
        score,
        date,
      });

      await userQuiz.save();

      res.status(201).json({ success: true, data: userQuiz });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const userQuizzes = await UserQuiz.find({});

      res.status(200).json({ success: true, data: userQuizzes });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid request method' });
  }
}
