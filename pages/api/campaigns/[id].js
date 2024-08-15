import connetMongoDB from "@/lib/services/database/mongodb";
import Campaign from "@/database/models/Campaign";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const campaign = await Campaign.findById(req.query.id);
                res.status(200).json({ success: true, data: campaign });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { id } = req.query;
                const campaign = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
                res.status(200).json(campaign);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const campaign = await Campaign.findByIdAndDelete(req.query.id);
                res.status(200).json(campaign);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}