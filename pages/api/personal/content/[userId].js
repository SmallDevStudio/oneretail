import connetMongoDB from "@/lib/services/database/mongodb";
import GenContents from "@/database/models/GenContents";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const GenContent = await GenContents.find({ userId });

                res.status(200).json({ success: true, data: GenContent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}