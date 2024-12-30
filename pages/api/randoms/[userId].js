import connetMongoDB from "@/lib/services/database/mongodb";
import Ramdoms from "@/database/models/Ramdoms";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
    const { userId } = req.query;
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            const { campaign } = req.query;
            try {
                const ramdoms = await Ramdoms.find({ userId: userId, campaign: campaign }).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: ramdoms });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}