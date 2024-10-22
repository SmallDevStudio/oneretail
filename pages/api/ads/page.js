import connetMongoDB from "@/lib/services/database/mongodb";
import Ads from "@/database/models/ADS";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const ads = await Ads.find({ position: "page", status: true });
                res.status(200).json({ success: true, data: ads });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}