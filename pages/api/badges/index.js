import connetMongoDB from "@/lib/services/database/mongodb";
import Badges from "@/database/models/Badges";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const badges = await Badges.find();
                res.status(200).json({ success: true, data: badges });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case 'POST':
            try {
                const badge = await Badges.create(req.body);
                res.status(201).json(badge);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { id } = req.query;
                const { ...data } = req.body;
                const badge = await Badges.findByIdAndUpdate(id, data, { new: true, runValidators: true });
                if (!badge) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: badge });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.query;
                const badge = await Badges.findByIdAndDelete(id);
                if (!badge) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: badge });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}