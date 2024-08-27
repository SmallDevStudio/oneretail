import connetMongoDB from "@/lib/services/database/mongodb";
import Satisfaction from "@/database/models/Satisfaction";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const satisfactions = await Satisfaction.find({ userId: req.query.userId });
                res.status(200).json({ success: true, data: satisfactions });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}