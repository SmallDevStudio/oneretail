import connetMongoDB from "@/lib/services/database/mongodb";
import Questionnaires from "@/database/models/Questionnaires";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const questionnaires = await Questionnaires.find()
                    .populate("courseId")
                    .populate("question.questionId")
                    .sort({ createdAt: -1 })
                res.status(200).json({ success: true, data: questionnaires });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const questionnaires = await Questionnaires.create(req.body);
                res.status(201).json({ success: true, data: questionnaires });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { questionnaireId } = req.query;
                const { suggestion, anonymous } = req.body;

                const questionnaires = await Questionnaires.findByIdAndUpdate(questionnaireId, { suggestion, anonymous }, {
                    new: true,
                    runValidators: true,
                });
                res.status(200).json({ success: true, data: questionnaires });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}