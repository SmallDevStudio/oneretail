import connectMongoDB from "@/lib/services/database/mongodb";
import Comment from "@/database/models/Comment";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'PUT':
            const { commentId, userId } = req.body;

            try {
                const comment = await Comment.findById(commentId);

                if (!comment) {
                    return res.status(404).json({ success: false, error: "Comment not found" });
                }

                const alreadyLiked = comment.likes.some(like => like.userId === userId);
                const user = await Users.findOne({ userId: userId });

                if (alreadyLiked) {
                    comment.likes = comment.likes.filter(like => like.userId !== userId);
                } else {
                    comment.likes.push({ userId });

                    await Notifications.create({
                        userId: comment.userId,
                        description: `${user.fullname} ได้กด like คอมเมนต์ใน Share Your Story, Comment`,
                        contentId: comment._id,
                        path: 'Share Your Story',
                        subpath: 'Comment',
                        url: `${process.env.NEXTAUTH_URL}/stores?tab=share-your-story#${comment.postId}`,
                        type: 'Like'
                    });
                }

                await comment.save();

                res.status(200).json({ success: true, data: comment });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}