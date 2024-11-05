import connetMongoDB from "@/lib/services/database/mongodb";
import Checkins from "@/database/models/Checkins";
import UserJoinEvent from "@/database/models/UserJoinEvent";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            const { eventId } = req.query;
            try {
                const checkin = await Checkins.find({ eventId: eventId }).sort({ createdAt: -1 });
                const UserJoinEvents = await UserJoinEvent.findOne({ eventId: eventId });
                res.status(200).json({ success: true, data: checkin, join: UserJoinEvents });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
};