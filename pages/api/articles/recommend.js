import connetMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const articles = await Article.find({ status: 'published' }).sort({ pinned: -1, createdAt: -1 })
                    .limit(10)
                    .sort({ createdAt: -1 });
                if (articles.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                };
                
                res.status(200).json({ success: true, data: articles });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}