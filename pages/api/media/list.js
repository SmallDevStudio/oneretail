import connetMongoDB from "@/lib/services/database/mongodb";
import Media from "@/database/models/Media";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const media = await Media.find({ userId });
                res.status(200).json(media);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}