import connectMongoDB from "@/lib/services/database/mongodb";
import Redeem from "@/database/models/Redeem";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connectMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { status } = req.body;
                const updatedRedeem = await Redeem.findByIdAndUpdate(id, { status }, { new: true });
                res.status(200).json({ success: true, data: updatedRedeem });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
};
            