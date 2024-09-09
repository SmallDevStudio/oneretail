import connectMongoDB from "@/lib/services/database/mongodb";
import ExamAnswer from "@/database/models/ExamAnswer";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "POST":
            // Create a new exam answer
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

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}