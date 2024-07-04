import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import moment from 'moment';

export default async function handler(req, res) {
    const { method, query } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { userId } = query;

                // Calculate start and end of the week
                const startOfWeek = moment().startOf('isoWeek').toDate();
                const endOfWeek = moment().endOf('isoWeek').toDate();

                const survey = await Survey.findOne({
                    userId,
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
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
