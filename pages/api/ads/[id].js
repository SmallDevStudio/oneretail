import connetMongoDB from "@/lib/services/database/mongodb";
import Ads from "@/database/models/ADS";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const ads = await Ads.findById(id);
                res.status(200).json({ success: true, data: ads });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const ads = await Ads.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(200).json({ success: true, data: ads });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const ads = await Ads.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: ads });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}