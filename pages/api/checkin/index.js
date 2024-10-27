import connetMongoDB from "@/lib/services/database/mongodb";
import Checkins from "@/database/models/Checkins";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const checkin = await Checkins.find().sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: checkin });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const checkin = await Checkins.create(req.body);
                res.status(201).json(checkin);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
};