import connetMongoDB from "@/lib/services/database/mongodb";
import Question from "@/database/models/Question";

export default async function handler(req, res) {
    await connetMongoDB();
    if (req.method === 'PUT') {
        try {
          const { id, question, options, correctAnswer } = req.body;
          await Question.findByIdAndUpdate(id, { question, options, correctAnswer });
          res.status(200).json({ success: true });
        } catch (error) {
          res.status(400).json({ success: false, error });
        }
      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }
};