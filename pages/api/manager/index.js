import connectMongoDB from "@/lib/services/database/mongodb";
import Manager from "@/database/models/Manager";

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === 'POST') {
        const { userId, loginDate } = req.body;

        try {
            const manager = await Manager.create({ userId, loginDate });

            res.status(201).json({ success: true, data: manager });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
