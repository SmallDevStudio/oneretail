import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Category from "@/database/models/Category";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === "GET") {
        try {
            const { category_id } = req.query;
            const contents = await Content.find({ categories: category_id });
            res.status(200).json(contents);
        } catch (error) {
            res.status(400).json({ success: false });
        }
    } else {
        res.status(400).json({ success: false });
    }
}
