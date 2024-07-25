import connectMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                // Fetch all published articles with status 'published'
                const articles = await Article.find({ status: 'published', published: true });

                // Sort articles
                const sortedArticles = articles.sort((a, b) => {
                    if (a.pinned !== b.pinned) {
                        return a.pinned ? -1 : 1;
                    }
                    if (a.popular !== b.popular) {
                        return a.popular ? -1 : 1;
                    }
                    if (a.new !== b.new) {
                        return a.new ? -1 : 1;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                const userPromises = sortedArticles.map(async (article) => {
                    const user = await Users.findOne({ userId: article.userId });
                    return { ...article._doc, user: user ? user : null };
                });

                const articlesWithUser = await Promise.all(userPromises);

                res.status(200).json({ success: true, data: articlesWithUser });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
