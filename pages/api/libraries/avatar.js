import connetMongoDB from "@/lib/services/database/mongodb";
import Library from "@/database/models/Library";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const library = await Library.find({ userId, folder: "avatar" }).sort({ createdAt: -1 });

                if (!library) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: library });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}