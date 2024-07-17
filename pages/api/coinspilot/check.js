import connectMongoDB from "@/lib/services/database/mongodb";
import CoinsPilot from "@/database/models/CoinsPilot";

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            const pilot = await CoinsPilot.findOne({ userId });

            res.status(200).json({ hasLoggedIn: !!pilot });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}