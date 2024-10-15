import connetMongoDB from "@/lib/services/database/mongodb";
import ContentGen from "@/database/models/ContentGen";
import Users from "@/database/models/users";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const contents = await ContentGen.find()
                .populate('contents')
                .sort({ createdAt: -1 })

                res.status(200).json({ success: true, data: contents });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case 'POST':
            try {
                const group = await ContentGen.create(req.body);
                res.status(201).json({ success: true, data: group });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        
        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}