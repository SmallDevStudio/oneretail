import connetMongoDB from "@/lib/services/database/mongodb";
import Stickers from "@/database/models/Stickers";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const stickers = await Stickers.find({ active: true }).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: stickers });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}