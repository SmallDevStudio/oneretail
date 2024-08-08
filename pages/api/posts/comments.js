import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'POST':
            try {
                const comment = await Comment.create(req.body);
                await Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment._id } });
                res.status(201).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case 'PUT':
            try {
                const { id, ...data } = req.body;
                const comment = await Comment.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!comment) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            case 'DELETE':
                const { commentId } = req.query;
                try {
                    const comment = await Comment.findById(commentId);
    
                    if (!comment) {
                        return res.status(400).json({ success: false, error: "Comment not found" });
                    }
    
                    // Delete all replies related to the comment
                    await Reply.deleteMany({ commentId });
    
                    // Delete the comment
                    await Comment.findByIdAndDelete(commentId);
    
                    // Remove the comment ID from the post's comments array
                    await Post.findByIdAndUpdate(comment.postId, {
                        $pull: { comments: commentId },
                    });
    
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