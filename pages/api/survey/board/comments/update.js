import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";


export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case "PUT":
            const { comment, sticker, medias } = req.body;
            try {
                const commentId = await SurveyComments.findByIdAndUpdate(
                    id, 
                    { 
                        comment,
                        sticker,
                        medias
                     }, { new: true }
                );
                return res.status(200).json({ success: true, data: commentId });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        default:
            res.status(400).json({ success: false });
            break;
    }
}