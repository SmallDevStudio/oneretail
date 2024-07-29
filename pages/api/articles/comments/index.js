import connectMongoDB from "@/lib/services/database/mongodb";
import ArticleComments from "@/database/models/ArticleComments";
import Users from "@/database/models/users";
import ReplyArticleComment from "@/database/models/ReplyArticleComment";

export default async function handler(req, res) {
    const { method } = req;
    const { articleId } = req.query;

    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const comments = await ArticleComments.find({ articleId: articleId });

                const commentIds = comments.map(comment => comment._id);
                const replyComments = await ReplyArticleComment.find({ commentId: { $in: commentIds } });

                const userIds = [
                    ...comments.map(comment => comment.userId),
                    ...replyComments.map(reply => reply.userId),
                ];

                const users = await Users.find({ userId: { $in: userIds } });

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const enrichedComments = comments.map(comment => ({
                    ...comment._doc,
                    user: userMap[comment.userId] || null,
                    replies: replyComments
                        .filter(reply => reply.commentId.toString() === comment._id.toString())
                        .map(reply => ({
                            ...reply._doc,
                            user: userMap[reply.userId] || null,
                        })),
                }));

                res.status(200).json({ success: true, data: enrichedComments });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const { comment, userId, articleId } = req.body;
                const newComment = await ArticleComments.create({
                    articleId: articleId,
                    userId: userId,
                    comment: comment,
                });

                res.status(201).json({ success: true, data: newComment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { commentId } = req.query;
                const { userId } = req.body;
                const updatedComment = await ArticleComments.findByIdAndUpdate(commentId, { 
                    likes: [
                        {
                            userId: userId,
                            date: Date.now()
                        }
                    ]
                }, { new: true });
                res.status(200).json({ success: true, data: updatedComment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const { commentId } = req.query;
                await ArticleComments.findByIdAndDelete(commentId);
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
