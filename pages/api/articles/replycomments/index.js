import connectMongoDB from "@/lib/services/database/mongodb";
import ReplyArticleComment from "@/database/models/ReplyArticleComment";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'POST':
            try {
                const { commentId, userId, reply } = req.body;
                const newReply = await ReplyArticleComment.create({ commentId, userId, reply });
                res.status(201).json({ success: true, data: newReply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { id, likes } = req.body;
                const updatedReply = await ReplyArticleComment.findByIdAndUpdate(id, { likes }, { new: true });
                res.status(200).json({ success: true, data: updatedReply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const { replyId } = req.query;
                await ReplyArticleComment.findByIdAndDelete(replyId);
                res.status(200).json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
