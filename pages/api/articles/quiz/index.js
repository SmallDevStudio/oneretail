import connectMongoDB from "@/lib/services/database/mongodb";
import ArticleQuiz from "@/database/models/ArticleQuiz";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "POST": {
            try {
                const articleQuiz = await ArticleQuiz.create(req.body);
                res.status(201).json(articleQuiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        }

        case "GET": {
            try {
                const articleQuiz = await ArticleQuiz.find();
                res.status(200).json(articleQuiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        }

        default: {
            res.status(400).json({ success: false });
            break;
        }
    }
}