import connetMongoDB from "@/lib/services/database/mongodb";
import Examinations from "@/database/models/Examinations";
import ExamQuestions from "@/database/models/ExamQuestions";

export default async function handler(req, res) {
    await connetMongoDB();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const examinations = await Examinations.find({ isDeleted: false })
                .populate("questions")
                .sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: examinations });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            const { title, description, group, position, questions, creator } = req.body;
            try {
                let questionIds = [];

                if (questions.length > 0) {
                    for (const question of questions) {
                        const examQuestion = new ExamQuestions(question);
                        await examQuestion.save();
                        questionIds.push(examQuestion._id);
                    }
                }

                const examination = new Examinations({
                    title,
                    description,
                    group,
                    position,
                    questions: questionIds,
                    creator,
                });
                await examination.save();
                res.status(201).json({ success: true, data: examination });
               
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}