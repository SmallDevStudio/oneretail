import connetMongoDB from "@/lib/services/database/mongodb";
import GenContents from "@/database/models/GenContents";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const GenContent = await GenContents.find().sort({ createdAt: -1 });

                res.status(200).json({ success: true, data: GenContent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const usePersonalizedContent = await GenContents.create(req.body);
                res.status(201).json(usePersonalizedContent);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}