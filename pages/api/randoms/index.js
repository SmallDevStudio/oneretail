import connetMongoDB from "@/lib/services/database/mongodb";
import Ramdoms from "@/database/models/Ramdoms";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const ramdoms = await Ramdoms.find();
                res.status(200).json({ success: true, data: ramdoms });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            const { userId, point } = req.body;
            try {
                const random = await Ramdoms.create({
                    userId: userId,
                    point: point
                });

                if (random) {
                    const createPoint = await Point.create({
                        userId: userId,
                        description: `กิจกรรม 12.12`,
                        contentId: random._id,
                        path: 'randoms',
                        type: 'earn',
                        point: random.point
                    });
    
                    const message = `คุณได้รับ ${createPoint.point} คะแนน จาก ${createPoint.description} `;
                    sendLineMessage(userId, message);
                } else {
                    res.status(400).json({ success: false });
                }
                res.status(201).json({ success: true, data: random });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}