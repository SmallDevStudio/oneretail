import connetMongoDB from "@/lib/services/database/mongodb";
import GenPostTests from "@/database/models/GenPostTests";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const usePersonalizedPostTest = await GenPostTests.findOne({ userId });
                res.status(200).json({ success: true, data: usePersonalizedPostTest });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}