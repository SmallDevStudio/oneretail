import connetMongoDB from "@/lib/services/database/mongodb";
import Share from "@/database/models/Library/Share";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const shares = await Share.find();
                res.status(200).json({ success: true, data: shares });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const share = await Share.create(req.body);
                res.status(201).json(share);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            
        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}