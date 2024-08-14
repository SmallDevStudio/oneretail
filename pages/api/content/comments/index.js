import connectMongoDB from "@/lib/services/database/mongodb";
import ContentComment from "@/database/models/ContentComment";
import ReplyContentComment from "@/database/models/ReplyContentComment";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { contentId } = req.query;

                // Fetch all comments for the given contentId
                const comments = await ContentComment.find({ contentId }).sort({ createdAt: -1 }).lean();

                if (comments.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                }

                // Populate the user for each comment
                const userIds = comments.map(comment => comment.userId);
                const users = await Users.find({ userId: { $in: userIds } }).lean();
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // Fetch and populate replies for each comment
                const populatedComments = await Promise.all(
                    comments.map(async (comment) => {
                        const replies = await ReplyContentComment.find({ commentId: comment._id }).lean();
                        const replyUserIds = replies.map(reply => reply.userId);
                        const replyUsers = await Users.find({ userId: { $in: replyUserIds } }).lean();
                        const replyUserMap = replyUsers.reduce((acc, user) => {
                            acc[user.userId] = user;
                            return acc;
                        }, {});

                        const populatedReplies = replies.map(reply => ({
                            ...reply,
                            user: replyUserMap[reply.userId] || null,
                        }));

                        return {
                            ...comment,
                            user: userMap[comment.userId] || null,
                            replies: populatedReplies,
                        };
                    })
                );

                res.status(200).json({ success: true, data: populatedComments });
            } catch (error) {
                console.error('Error fetching comments:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const { comment, userId, contentId } = req.body;
                const newComment = await ContentComment.create({ comment, userId, contentId });

                res.status(201).json({ success: true, data: newComment });
            } catch (error) {
                console.error('Error creating comment:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

            case 'DELETE':
            try {
                const { commentId } = req.query;
                const comment = await ContentComment.findById(commentId);
                if (!comment) {
                    return res.status(404).json({ success: false, error: "Comment not found" });
                }
                await ReplyContentComment.deleteMany({ commentId });
                await ContentComment.findByIdAndDelete(commentId);
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
