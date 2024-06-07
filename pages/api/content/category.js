import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";


export default async function handler(req, res) {

    await connetMongoDB();

    if (req.method === "GET") {
        try {
            const { categories } = req.query;
            const contents = await Content.find({ categories });
            res.status(200).json({ success: true, data: contents });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    } else {
        res.status(400).json({ success: false });
    }
}