import connectMongoDB from "@/lib/services/database/mongodb";
import Manager from "@/database/models/Manager";

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            const manager = await Manager.findOne({ userId });

            res.status(200).json({ hasLoggedIn: !!manager });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
