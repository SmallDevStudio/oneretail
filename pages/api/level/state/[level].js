import connetMongoDB from "@/lib/services/database/mongodb";
import Level from "@/database/models/Level";

export default async function handler(req, res) {
    const { method, query: { level } } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const levelNumber = parseInt(level, 10);
                const levels = await Level.findOne({level: levelNumber});
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