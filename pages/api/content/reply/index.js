import connectMongoDB from "@/lib/services/database/mongodb";
import ReplyContentComment from "@/database/models/ReplyContentComment";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {

    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'POST':
            try {
                const reply = await ReplyContentComment.create(req.body);
                await ContentComment.findByIdAndUpdate(req.body.commentId, {
                    $push: { reply: reply._id }
                })
                res.status(201).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

            case 'DELETE':
            try {
                const { replyId } = req.query;

                const reply = await ReplyContentComment.findById(replyId);
                if (!reply) {
                    return res.status(400).json({ success: false });
                }
                
                await ContentComment.findByIdAndUpdate(reply.commentId, 
                    { $pull: { reply: replyId } 
                });

                await ReplyContentComment.findByIdAndDelete(replyId);

                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}