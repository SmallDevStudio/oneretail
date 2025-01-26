import connetMongoDB from "@/lib/services/database/mongodb";
import Follower from "@/database/models/OneSociety/Follower";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const { userId, targetId } = req.query;

                // ดึงข้อมูล follower
                const followers = await Follower.findOne({ userId, targetId }).lean();

                res.status(200).json({ success: true, data: followers });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Method not allowed" });
            break;
    }
}
