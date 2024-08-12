import connectMongoDB from "@/lib/services/database/mongodb";
import ArticleQuiz from "@/database/models/ArticleQuiz";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const {articleId} = req.query;
                const articleQuizzes = await ArticleQuiz.find({ articleId: articleId });
                res.status(200).json({ success: true, data: articleQuizzes });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            case "POST":
                try {
                    const quizData = req.body;
                    if (quizData._id) {
                        // Update existing quiz
                        const updatedQuiz = await ArticleQuiz.findByIdAndUpdate(quizData._id, quizData, { new: true });
                        res.status(200).json(updatedQuiz);
                    } else {
                        // Create a new quiz
                        const articleQuiz = await ArticleQuiz.create(quizData);
                        res.status(201).json(articleQuiz);
                    }
                } catch (error) {
                    res.status(400).json({ success: false });
                }
                break;
        case "PUT":
            try {
                const { id, ...data } = req.body;
                const articleQuiz = await ArticleQuiz.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json(articleQuiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "DELETE":
            try {
                const {quizId} = req.body
                const articleQuiz = await ArticleQuiz.findByIdAndDelete(quizId);
                res.status(200).json(articleQuiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}