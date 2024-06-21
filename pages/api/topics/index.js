import connetMongoDB from "@/lib/services/database/mongodb";
import Topic from "@/database/models/Topic";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const topics = await Topic.find({});
                res.status(200).json({ success: true, data: topics });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const topic = await Topic.create(req.body);
                res.status(201).json({ success: true, data: topic });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
};