import connetMongoDB from "@/lib/services/database/mongodb";
import Question from "@/database/models/Question";


export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === 'POST') {
      try {
        const { questions } = req.body;
  
        if (!questions || !Array.isArray(questions)) {
          return res.status(400).json({ success: false, message: 'Invalid data format' });
        }
  
        // ตรวจสอบข้อมูลที่ซ้ำกัน
        const existingQuestions = await Question.find({
          question: { $in: questions.map(q => q.question) }
        });
  
        const newQuestions = questions.filter(q => 
          !existingQuestions.some(eq => eq.question === q.question)
        );
  
        if (newQuestions.length === 0) {
          return res.status(200).json({ success: false, message: 'No new questions to add' });
        }
  
        const createdQuestions = await Question.insertMany(newQuestions);
  
        res.status(201).json({ success: true, data: createdQuestions });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  };