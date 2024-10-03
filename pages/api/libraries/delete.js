import connetMongoDB from "@/lib/services/database/mongodb";
import Library from "@/database/models/Library";

export default async function handler(req, res) {
    const { method } = req;
    const { public_id } = req.query;
    await connetMongoDB();

    switch (method) {

        case "DELETE":
            try {
                const library = await Library.findOneAndDelete({ public_id });
                if (!library) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json(library);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}