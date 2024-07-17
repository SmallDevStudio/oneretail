import connetMongoDB from "@/lib/services/database/mongodb";
import CoinsPilot from "@/database/models/CoinsPilot";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const coinspilot = await CoinsPilot.find({});
                res.status(200).json(coinspilot);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'POST':
            const { userId, loginDate } = req.body;
            try {
                const coinspilot = await CoinsPilot.create({ userId, loginDate });
                res.status(201).json(coinspilot);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}