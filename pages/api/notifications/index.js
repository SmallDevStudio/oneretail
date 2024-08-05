import connetMongoDB from "@/lib/services/database/mongodb";
import Notification from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;
    connetMongoDB();
    switch (method) {
        case "POST":
            try {
                const notification = await Notification.create(req.body);
                res.status(200).json(notification);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}