import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "DELETE":
            try {
                const { id } = req.query;
                const comment = await SurveyComments.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}