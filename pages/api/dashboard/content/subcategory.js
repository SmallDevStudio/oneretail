
import connectMongoDB from "@/lib/services/database/mongodb";
import Subcategory from "@/database/models/Subcategory";

export default async function handler(req, res) {
    await connectMongoDB();
    const { method, query } = req;

    switch (method) {
        case 'GET':
            try {
                const { category } = query;
                if (!category) {
                    return res.status(400).json({ success: false, error: 'Category is required' });
                }
                const subcategories = await Subcategory.find({ category });
                res.status(200).json({ success: true, subcategories });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}