import connetMongoDB from "@/lib/services/database/mongodb";
import Stickers from "@/database/models/Stickers";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const stickers = await Stickers.find();
                res.status(200).json({ success: true, data: stickers });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const sticker = await Stickers.create(req.body);
                res.status(201).json(sticker);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}