import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import SurveyReply from "@/database/models/SurveyReply";


export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case "POST":
            try {
                const reply = await SurveyReply.create(req.body);
                const comment = await SurveyComments.findById(reply.commentId);
                comment.reply.push(reply._id);
                await comment.save();
                return res.status(201).json({ success: true, data: reply });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
            
        case "PUT":
            const { reply, sticker, medias } = req.body;
            try {
                const replyId = await SurveyReply.findByIdAndUpdate(id, 
                    { reply, sticker, medias }, 
                    { new: true }
                );
                return res.status(200).json({ success: true, data: replyId });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
    

        default:
            res.status(400).json({ success: false });
            break;
    }
}