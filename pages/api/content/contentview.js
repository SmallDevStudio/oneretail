import connetMongoDB from "@/lib/services/database/mongodb";
import ContentViews from "@/database/models/ContentViews";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const views = await ContentViews.find({}).sort({ createdAt: -1 });
                res.status(200).json(views);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "POST":
            try {
                const { contentId, userId } = req.body;
                const content = await ContentViews.create({ contentId, userId });
                res.status(201).json(content);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}