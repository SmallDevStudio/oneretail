import connetMongoDB from "@/lib/services/database/mongodb";
import Follower from "@/database/models/OneSociety/Follower";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const { userId } = req.query;
                const followers = await Follower.find({ userId }).lean();
                res.status(200).json({ success: true, data: followers });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}