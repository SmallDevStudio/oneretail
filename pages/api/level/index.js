import connetMongoDB from "@/lib/services/database/mongodb";
import Level from "@/database/models/Level";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const levels = await Level.find({}).sort({ level: 1 });
                res.status(200).json(levels);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}