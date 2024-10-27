import connetMongoDB from "@/lib/services/database/mongodb";
import AdminCheckIns from "@/database/models/AdminCheckIns";
import Event from "@/database/models/Event";

export default async function handler(req, res) {
    const { method } = req;
    const { eventId } = req.query;

    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const checkin = await AdminCheckIns.findOne({ eventId: eventId });

                res.status(200).json({ success: true, data: checkin });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const checkin = await AdminCheckIns.create(req.body);
                res.status(201).json(checkin);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            const { id } = req.query;
            try {
                const checkin = await AdminCheckIns.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!checkin) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json(checkin);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}