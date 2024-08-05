import connetMongoDB from "@/lib/services/database/mongodb";
import Notification from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;
    connetMongoDB();
    switch (method) {
        case 'GET':
            try {
                const notifications = await Notification.find({ userId: req.query.userId });
                res.status(200).json({ success: true, data: notifications });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}