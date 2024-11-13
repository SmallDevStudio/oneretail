import connetMongoDB from "@/lib/services/database/mongodb";
import MemoryGame from "@/database/models/MemoryGame";

export default async function handler(req, res) {
    const { userId } = req.query;
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const memoryGames = await MemoryGame.find({ userId: userId, complete: true }).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: memoryGames });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}