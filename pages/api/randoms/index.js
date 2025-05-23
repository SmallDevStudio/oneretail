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
            const { userId, point, campaign } = req.body;
            try {
                const random = await Ramdoms.create({
                    userId: userId,
                    point: point,
                    campaign: campaign
                });

                if (random) {
                    const createPoint = await Point.create({
                        userId: userId,
                        description: `Chinese New Year 2025`,
                        contentId: random._id,
                        path: 'randoms',
                        type: 'earn',
                        point: random.point
                    });
    
                    const message = `${createPoint.description} คุณได้รับ ${createPoint.point} คะแนน`;
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