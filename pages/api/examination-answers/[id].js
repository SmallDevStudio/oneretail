import connectMongoDB from "@/lib/services/database/mongodb";
import ExaminationAnswer from "@/database/models/ExaminationAnswer";
import UserAnswer from "@/database/models/UserAnswer";

export default async function handler(req, res) {
  await connectMongoDB();
  const { method } = req;
  const { id } = req.query;


  switch (method) {
    case "GET":
      try {
        const { userId } = req.query;
        const examinationAnswers = await ExaminationAnswer.findOne({ examId: id, userId });
        res.status(200).json({ success: true, data: examinationAnswers });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

      case "POST":
        const { userId, answers, isComplete } = req.body;

        if (!userId || !Array.isArray(answers)) {
            return res.status(400).json({ success: false, message: "Invalid data format" });
        }

        try {
            let examination = await ExaminationAnswer.findOne({ examId: id, userId });

            if (examination && examination.isComplete) {
                return res.status(400).json({ success: false, message: "Examination has already been completed" });
            }

            if (!examination) {
                // Create examination if not exists
                examination = await ExaminationAnswer.create({
                    examId: id,
                    userId,
                    isComplete: false,
                });
            }

            // Save each round of answers
            const userAnswer = await UserAnswer.create({
                examAnswerId: examination._id,
                userId,
                answers,
            });

            // Update ExaminationAnswer with new UserAnswer
            examination.answers.push(userAnswer._id);
            examination.isComplete = isComplete;
            await examination.save();

            res.status(201).json({ success: true, data: examination });
        } catch (error) {
            console.error("Error saving answers:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
        break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
