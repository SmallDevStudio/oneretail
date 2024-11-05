import connetMongoDB from "@/lib/services/database/mongodb";
import Checkins from "@/database/models/Checkins";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            const { userId, eventId } = req.query;
            try {
                const checkin = await Checkins.find({ eventId: eventId, userId: userId });
                res.status(200).json({ success: true, data: checkin });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
};