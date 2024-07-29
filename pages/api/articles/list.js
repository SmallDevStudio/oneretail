import connectMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method, query } = req;
    const { page = 1, pageSize = 10, search = '' } = query;
    const skip = (page - 1) * pageSize;

    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const searchQuery = search
                    ? {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { tags: { $elemMatch: { name: { $regex: search, $options: 'i' } } } },
                        ],
                    }
                    : {};

                const articles = await Article.find(searchQuery)
                    .skip(skip)
                    .limit(parseInt(pageSize))
                    .sort({ createdAt: -1 });

                const totalRecords = await Article.countDocuments(searchQuery);

                const userPromises = articles.map(async (article) => {
                    const user = await Users.findOne({ userId: article.userId });
                    return { ...article._doc, user: user ? user : null };
                });

                const articlesWithUser = await Promise.all(userPromises);

                res.status(200).json({ success: true, articles: articlesWithUser, totalRecords });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
