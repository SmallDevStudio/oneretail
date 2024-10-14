import connetMongoDB from "@/lib/services/database/mongodb";
import GenPreTests from "@/database/models/GenPreTests";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const usePersonalizedPreTest = await GenPreTests.find();
                res.status(200).json({ success: true, data: usePersonalizedPreTest });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const usePersonalizedPreTest = await GenPreTests.create(req.body);
                res.status(201).json({ success: true, data: usePersonalizedPreTest});   
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}