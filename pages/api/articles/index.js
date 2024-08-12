import connetMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";
import Users from "@/database/models/users";
import ArticleQuiz from "@/database/models/ArticleQuiz";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const articles = await Article.find({ status: 'published' }).sort({ createdAt: -1 });
                if (articles.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                };
                const userPromises = articles.map(async (article) => {
                    const user = await Users.findOne({userId: article.userId});
                    return { ...article._doc, 
                        user: user ? user : null,
                    };
                });

                // const users = await Users.find({ userId: { $in: articleIds } });

                const articlesWithUser = await Promise.all(userPromises);
                
                res.status(200).json({ success: true, data: articlesWithUser });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        
        case 'POST':
            try {
                const article = await Article.create(req.body);
                res.status(201).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'PUT':
            try {
                const { id } = req.query;
                const data = req.body;
                const article = await Article.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.query;
                const article = await Article.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}