import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import SurveyReply from "@/database/models/SurveyReply";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "POST":
            try {
                const reply = await SurveyReply.create(req.body);
                await SurveyComments.findByIdAndUpdate(req.body.commentId, {
                    $push: { reply: reply._id }
                });
                res.status(201).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { id, ...data } = req.body;
                const reply = await SurveyReply.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!reply) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}