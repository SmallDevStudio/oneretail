import connetMongoDB from "@/lib/services/database/mongodb";
import MemoryGame from "@/database/models/MemoryGame";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const memoryGames = await MemoryGame.find({}).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: memoryGames });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const memoryGame = await MemoryGame.create(req.body);

                res.status(201).json({ success: true, data: memoryGame });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { id, ...data } = req.body;
                const memoryGame = await MemoryGame.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json({ success: true, data: memoryGame });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const memoryGame = await MemoryGame.findByIdAndDelete(req.body.id);
                res.status(200).json({ success: true, data: memoryGame });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}