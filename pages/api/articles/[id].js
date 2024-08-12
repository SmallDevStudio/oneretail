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
                const article = await Article.findById(id).lean(); // This returns a single article object
                if (!article) {
                    return res.status(404).json({ success: false, error: "Article not found" });
                }

                const user = await Users.findOne({ userId: article.userId }).lean();
                const userMap = { [article.userId]: user };

                const quizzes = await ArticleQuiz.find({ articleId: id }).lean();
                let randomQuiz = null;
                if (quizzes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * quizzes.length);
                    randomQuiz = quizzes[randomIndex];
                }

                const comments = await ArticleComments.find({ articleId: article._id }).lean();
                const commentUserIds = comments.map(comment => comment.userId);
                const commentUsers = await Users.find({ userId: { $in: commentUserIds } }).lean();
                const commentUserMap = commentUsers.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatedComments = await Promise.all(comments.map(async (comment) => {
                    const replies = await ReplyArticleComment.find({ commentId: comment._id }).lean();
                    const replyUserIds = replies.map(reply => reply.userId);
                    const replyUsers = await Users.find({ userId: { $in: replyUserIds } }).lean();
                    const replyUserMap = replyUsers.reduce((acc, user) => {
                        acc[user.userId] = user;
                        return acc;
                    }, {});

                    const populatedReplies = replies.map(reply => ({
                        ...reply,
                        user: replyUserMap[reply.userId]
                    }));

                    return {
                        ...comment,
                        user: commentUserMap[comment.userId],
                        replies: populatedReplies
                    };
                }));

                const populatedArticle = {
                    ...article,
                    user: userMap[article.userId],
                    comments: populatedComments,
                    quiz: randomQuiz
                };

                res.status(200).json({ success: true, data: populatedArticle });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;


        case 'PUT':
            try {
                const { title, content, medias, thumbnail, tagusers, status, point,
                    coins, pinned, recommend, tags, position, group, subgroup, rating, 
                    likes, views
                 } = req.body;
                 console.log(point);
                const ArticleUpdate = await Article.findByIdAndUpdate(id, {
                    title, content, medias, thumbnail, tagusers, status, point,
                    coins, pinned, recommend, tags, position, group, subgroup, rating,
                    likes, views
                }, {
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
