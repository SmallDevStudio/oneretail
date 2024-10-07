import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import SurveyReply from "@/database/models/SurveyReply";


export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case "DELETE":
            try {
                const reply = await SurveyReply.findById(id);
                if (!reply) {
                    return res.status(404).json({ success: false, error: "Reply not found" });
                }

                const comment = await SurveyComments.findById(reply.commentId);
                comment.reply = comment.reply.filter((replyId) => replyId.toString() !== id);
                await comment.save();

                await SurveyReply.findByIdAndDelete(id);

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