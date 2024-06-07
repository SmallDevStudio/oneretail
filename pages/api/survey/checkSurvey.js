import connetMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";

export default async function handler(req, res) {
    const { method, query } = req
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { userId } = query;
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const survey = await Survey.findOne({
                    userId,
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                });

                if (survey) {
                    res.status(200).json({ completed: true });
                } else {
                    res.status(200).json({ completed: false });
                }
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Method not allowed' });
            break;
    }
}