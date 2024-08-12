import connectMongoDB from "@/lib/services/database/mongodb";
import ReplyArticleComment from "@/database/models/ReplyArticleComment";
import ArticleComments from "@/database/models/ArticleComments";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'POST':
            try {
                const newReply = await ReplyArticleComment.create(req.body);
                await ArticleComments.findByIdAndUpdate(req.body.commentId, 
                    { $push: { reply: newReply._id } });
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
                const reply = await ReplyArticleComment.findById(replyId);
                if (!reply) {
                    return res.status(400).json({ success: false });
                }
                
                await ArticleComments.findByIdAndUpdate(reply.commentId, 
                    { $pull: { reply: replyId } 
                });

                await ReplyArticleComment.findByIdAndDelete(replyId);

                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
