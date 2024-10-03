import connetMongoDB from "@/lib/services/database/mongodb";
import Library from "@/database/models/Library";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const library = await Library.findById(req.query.id);
                res.status(200).json({ success: true, data: library });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { id, ...data } = req.body;
                const library = await Library.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!library) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json(library);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const library = await Library.findByIdAndDelete(id);
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