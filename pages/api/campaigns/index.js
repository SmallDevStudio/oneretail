import connetMongoDB from "@/lib/services/database/mongodb";
import Campaign from "@/database/models/Campaign";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const campaigns = await Campaign.find({});
                res.status(200).json({ success: true, data: campaigns });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const campaign = await Campaign.create(req.body);
                res.status(201).json({ success: true, data: campaign });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}