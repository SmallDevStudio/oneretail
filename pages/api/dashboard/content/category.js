
import connectMongoDB from "@/lib/services/database/mongodb";
import Category from "@/database/models/Category";

export default async function handler(req, res) {
    await connectMongoDB();
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const categories = await Category.find({});
                res.status(200).json({ success: true, categories });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}