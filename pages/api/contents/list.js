import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const contents = await Content.find({ publisher: true, recommend: true })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .populate("categories")
                    .populate("subcategories")
                    .populate("groups");
                    
                res.status(200).json({ success: true, data: contents });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
