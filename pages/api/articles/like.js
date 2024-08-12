// api/club/like.js
import connectMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'PUT':
            const { articleId, userId } = req.body;

            try {
                const article = await Article.findById(articleId);

                if (!article) {
                    return res.status(404).json({ success: false, error: "Article not found" });
                }

                const alreadyLiked = article.likes.some(like => like.userId === userId);
                const user = await Users.findOne({ userId: userId });

                if (alreadyLiked) {
                    article.likes = article.likes.filter(like => like.userId !== userId);
                } else {
                    article.likes.push({ userId });

                    if (userId !== article.userId) {
                        await Notifications.create({
                            userId: article.userId,
                            senderId: userId,
                            description: `ได้กด like โพสใน Article`,
                            referId: article._id,
                            path: 'Article',
                            subpath: 'Post',
                            url: `${process.env.NEXTAUTH_URL}articles/${article._id}`,
                            type: 'Like'
                        });
                    }
                }

                await article.save();

                res.status(200).json({ success: true, data: article });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
