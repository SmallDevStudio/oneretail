import connetMongoDB from "@/lib/services/database/mongodb";
import ArticleAnswer from "@/database/models/ArticleAnswer";
import Article from "@/database/models/Article";
import ArticleQuiz from "@/database/models/ArticleQuiz";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "POST":
            try {
                const { articleId, questionId, isAnswer, answer, userId, point } = req.body;

                const articleAnswer = await ArticleAnswer.create({
                    articleId,
                    questionId,
                    isAnswer,
                    answer,
                    userId,
                    point,
                });

                res.status(201).json({ success: true, data: articleAnswer });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "GET":
            try {
                const { articleId, userId } = req.query;
                const articleAnswers = await ArticleAnswer.find({ articleId, userId }).sort({ createdAt: -1 });

                res.status(200).json({ success: true, data: articleAnswers });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}
