import connectMongoDB from "@/lib/services/database/mongodb";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "POST":
            try {
                const reply = await Reply.create(req.body);
                await Comment.findByIdAndUpdate(req.body.commentId, {
                    $push: { reply: reply._id }
                });
                res.status(201).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const reply = await Reply.findByIdAndUpdate(req.body.id, req.body, {
                    new: true
                });
                res.status(200).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            const { replyId } = req.query;
            try {
                const reply = await Reply.findById(replyId);
                if (!reply) {
                    return res.status(400).json({ success: false, error: "Reply not found" });
                }

                // Remove the reply ID from the comment's replies array
                await Comment.findByIdAndUpdate(reply.commentId, {
                    $pull: { reply: replyId }
                });

                // Delete the reply
                await Reply.findByIdAndDelete(replyId);

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