
import connectMongoDB from "@/lib/services/database/mongodb";
import Group from "@/database/models/Group";

export default async function handler(req, res) {
    await connectMongoDB();
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const groups = await Group.find({});
                res.status(200).json({ success: true, groups });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}