import connetMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const articles = await Article.find({});
                res.status(200).json({ success: true, data: articles });
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