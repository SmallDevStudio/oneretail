// /api/notifications/markAsRead.js

import connectMongoDB from "@/lib/services/database/mongodb";
import Notification from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    if (method !== 'PUT') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { ids } = req.body;
        await Notification.updateMany(
            { _id: { $in: ids } },
            { isReading: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
