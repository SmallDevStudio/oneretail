import connectMongoDB from "@/lib/services/database/mongodb";
import ReplyArticleComment from "@/database/models/ReplyArticleComment";

export default async function handler(req, res) {
    const { method } = req;
    const { replyId } = req.query;

    await connectMongoDB();

    switch (method) {
        case 'PUT':
            try {
                const { userId } = req.body;
                const reply = await ReplyArticleComment.findById(replyId);
                if (!reply) {
                    return res.status(404).json({ success: false, message: 'Reply not found' });
                }

                const likesSet = new Set(reply.likes.map(String));
                if (likesSet.has(userId)) {
                    likesSet.delete(userId);
                } else {
                    likesSet.add(userId);
                }

                reply.likes = Array.from(likesSet);
                await reply.save();

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
