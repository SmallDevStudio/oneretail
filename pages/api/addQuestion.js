import connetMongoDB from "@/lib/services/database/mongodb";
import Question from "@/database/models/Question";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === 'POST') {
        try {
          const { question, options, correctAnswer, group } = req.body;
          const newQuestion = new Question({ question, options, correctAnswer, group });
          await newQuestion.save();
          res.status(201).json({ success: true, data: newQuestion });
        } catch (error) {
          res.status(400).json({ success: false, error });
        }
      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }
};
