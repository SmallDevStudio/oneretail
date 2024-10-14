import connetMongoDB from "@/lib/services/database/mongodb";
import GenPostTests from "@/database/models/GenPostTests";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const usePersonalizedPostTest = await GenPostTests.find();
                res.status(200).json({ success: true, data: usePersonalizedPostTest });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const usePersonalizedPostTest = await GenPostTests.create(req.body);
                res.status(201).json(usePersonalizedPostTest);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}