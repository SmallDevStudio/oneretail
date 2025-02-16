import connetMongoDB from "@/lib/services/database/mongodb";
import EventCheckin from "@/database/models/Checkin/EventCheckin";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;  // แก้ตรงนี้ให้ตรงกับ URL

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {  
                console.log(id);
                const checkin = await EventCheckin.findById(id);  // ใช้ findById แทน
                if (!checkin) {
                    return res.status(404).json({ success: false, message: "Event not found" });
                }
                res.status(200).json({ success: true, data: checkin });
            } catch (error) {
                console.error(error);  // log error
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const checkin = await EventCheckin.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                res.status(200).json(checkin);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const checkin = await EventCheckin.findByIdAndDelete(id);
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
