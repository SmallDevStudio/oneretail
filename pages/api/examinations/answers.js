import connectMongoDB from "@/lib/services/database/mongodb";
import ExamAnswer from "@/database/models/ExamAnswer";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "POST":
            try {
                const newExamAnswer = await ExamAnswer.create(req.body);

                res.status(201).json({ success: true, data: newExamAnswer });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }

        case "GET":
            try {
                const { userId } = req.query;
                const examAnswers = await ExamAnswer.find({ userId });

                res.status(200).json({success: true, data: examAnswers});
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

            case "PUT":
                console.log(req.body);
                try {
                    const { id, examId, answerCount, completed } = req.body;
                    const existingAnswer = await ExamAnswer.findById(id);

                    if (!existingAnswer) {
                        return res.status(404).json({ success: false, message: "Exam answer not found" });
                    }

                    // Prepare to update examIds, handling both strings and objects
                    const updatedExamIds = new Set([...existingAnswer.examId]);
                    examId.forEach(ans => {
                        if (typeof ans === 'string') {
                            updatedExamIds.add(ans);
                        } else if (ans && ans.questionId) {
                            updatedExamIds.add(ans.questionId);
                        }
                    });

                    existingAnswer.examId = Array.from(updatedExamIds);
                    existingAnswer.answerCount = answerCount;
                    existingAnswer.completed = completed;

                    await existingAnswer.save();
                    res.status(200).json({ success: true, data: existingAnswer });
                } catch (error) {
                    console.error("PUT Error:", error);
                    res.status(400).json({ success: false, error: error.message });
                }
                break;
    

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}