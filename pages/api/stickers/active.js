import connetMongoDB from "@/lib/services/database/mongodb";
import Stickers from "@/database/models/Stickers";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query
    await connetMongoDB();

    switch (method) {
        case 'PUT':
            const { active } = req.body
            try {
                const sticker = await Stickers.findByIdAndUpdate(id, {active}, { new: true });
                res.status(200).json(sticker);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}