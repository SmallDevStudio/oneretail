import connectMongoDB from "@/lib/services/database/mongodb";
import Examinations from "@/database/models/Examinations";
import ExamQuestions from "@/database/models/ExamQuestions";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();
    const { id } = req.query;

    switch (method) {
        case "GET":
            try {
                // ดึงข้อมูล Examination
                const examination = await Examinations.findOne({ _id: id }).lean();
                if (!examination) {
                    return res.status(404).json({ success: false, message: "Examination not found" });
                }

                // ดึงข้อมูล questions แบบ manual
                const questionIds = examination.questions || []; // ใช้ question IDs จาก Examination
                const questions = await ExamQuestions.find({ _id: { $in: questionIds } }).lean();

                const examinationWithQuestions = {
                    ...examination,
                    questions, // ใส่ข้อมูลคำถามแบบเต็ม
                };

                res.status(200).json({ success: true, data: examinationWithQuestions });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            const { title, description, group, position, questions } = req.body;
            try {
                let questionIds = []; // Array to store all question IDs

                if (questions.length > 0) {
                    for (const question of questions) {
                        if (question._id) {
                            // Update existing question
                            const updatedQuestion = await ExamQuestions.findByIdAndUpdate(
                                question._id,
                                {
                                    question: question.question,
                                    description: question.description,
                                    options: question.options,
                                    correctAnswer: question.correctAnswer,
                                },
                                { new: true }
                            );
                            questionIds.push(updatedQuestion._id);
                        } else {
                            // Create new question
                            const newQuestion = new ExamQuestions({
                                question: question.question,
                                description: question.description,
                                options: question.options,
                                correctAnswer: question.correctAnswer,
                            });
                            await newQuestion.save();
                            questionIds.push(newQuestion._id);
                        }
                    }
                }

                // Update the examination document with new question IDs
                const updatedExamination = await Examinations.findByIdAndUpdate(
                    id,
                    {
                        title,
                        description,
                        group,
                        position,
                        questions: questionIds,
                    },
                    { new: true }
                );

                res.status(200).json({ success: true, data: updatedExamination });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
