import connetMongoDB from "@/lib/services/database/mongodb";
import JoinEvent from "@/database/models/Checkin/JoinEvent";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const joinEvents = await JoinEvent.find();
                res.status(200).json({ success: true, data: joinEvents });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const { eventCheckinId, user } = req.body;

                // ตรวจสอบว่ามีข้อมูลนี้อยู่แล้วหรือไม่
                const existingJoin = await JoinEvent.findOne({ 
                    eventCheckinId: eventCheckinId, 
                    'user.userId': user.userId 
                });

                if (existingJoin) {
                    return res.status(200).json({ success: true, message: 'User already joined this event.' });
                }

                // ถ้าไม่มี ให้สร้างใหม่
                const joinEvent = await JoinEvent.create(req.body);
                res.status(201).json({ success: true, data: joinEvent });
            } catch (error) {
                console.error("Error in POST:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}
