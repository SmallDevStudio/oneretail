import connectMongoDB from "@/lib/services/database/mongodb";
import ReplyContentComment from "@/database/models/ReplyContentComment";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connectMongoDB();

    switch (method) {

        case 'DELETE':
            try {
                const reply = await ReplyContentComment.findById(id);
                if (!reply) {
                    return res.status(400).json({ success: false });
                }

                await ContentComment.findByIdAndUpdate(reply.commentId, {
                    $pull: { reply: id }
                })
                await ReplyContentComment.findByIdAndDelete(id);
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