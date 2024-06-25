import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";

export default async function handler(req, res) {
    await connectMongoDB();

    const { userId, contentId } = req.query;

    if (req.method === 'GET') {
        try {
            const point = await Point.findOne({ userId, contentId, type: 'earn' });

            if (point) {
                return res.status(200).json({ hasReceivedPoints: true });
            } else {
                return res.status(200).json({ hasReceivedPoints: false });
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
