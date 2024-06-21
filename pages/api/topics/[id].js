import connetMongoDB from "@/lib/services/database/mongodb";
import Topic from "@/database/models/Topic";

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const topic = await Topic.findById(req.query.id);
                if (!topic) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: topic });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const topic = await Topic.findByIdAndUpdate(req.query.id, req.body, {
                    new: true,
                    runValidators: true
                });
                if (!topic) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: topic });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedTopic = await Topic.deleteOne({ _id: req.query.id });
                if (!deletedTopic) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
};