// /api/notifications/all/[userId].js

import connectMongoDB from "@/lib/services/database/mongodb";
import Notification from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    if (method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
