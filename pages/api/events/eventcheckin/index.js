import connetMongoDB from "@/lib/services/database/mongodb";
import EventCheckin from "@/database/models/Checkin/EventCheckin";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const checkin = await EventCheckin.find();
                res.status(200).json({ success: true, data: checkin });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            console.log(req.body);
            try {
                const checkin = await EventCheckin.create(req.body);
                res.status(201).json(checkin);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}