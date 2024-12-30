import connetMongoDB from "@/lib/services/database/mongodb";
import QuestionnaireComments from "@/database/models/QuestionnaireComments";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "DELETE":
            try {
                const { questionnaireId } = req.query;
                const comments = await QuestionnaireComments.deleteMany({ questionnaireId });
                res.status(200).json({ success: true, data: comments });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}