import connectMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";
import Users from "@/database/models/users";
import ArticleComments from "@/database/models/ArticleComments";
import ReplyArticleComment from "@/database/models/ReplyArticleComment";
import ArticleQuiz from "@/database/models/ArticleQuiz";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const article = await Article.findById(id).lean();
                const user = await Users.findOne({ userId: article.userId }).lean();

                const comments = await ArticleComments.find({ articleId: id }).lean();
                const commentIds = comments.map(comment => comment._id);
                const replyComments = await ReplyArticleComment.find({ commentId: { $in: commentIds } }).lean();

                const userIds = [
                    article.userId,
                    ...comments.map(comment => comment.userId),
                    ...replyComments.map(reply => reply.userId),
                ];

                const users = await Users.find({ userId: { $in: userIds } }).lean();

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const enrichedComments = comments.map(comment => ({
                    ...comment,
                    user: userMap[comment.userId] || null,
                    replies: replyComments.filter(reply => reply.commentId.toString() === comment._id.toString()).map(reply => ({
                        ...reply,
                        user: userMap[reply.userId] || null,
                    }))
                }));

                // Fetch quizzes associated with the article
                const quizzes = await ArticleQuiz.find({ articleId: id }).lean();

                res.status(200).json({ 
                    success: true, 
                    data: { 
                        article: { 
                            ...article, 
                            user: user || null 
                        }, 
                        comments: enrichedComments,
                        quizzes: quizzes || [] // Include quizzes in the response
                    } 
                });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { id } = req.query;
                const ArticleUpdate = await Article.findByIdAndUpdate(id, req.body, {
                    new: true,
                });

                res.status(200).json({ success: true, data: ArticleUpdate });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const article = await Article.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
