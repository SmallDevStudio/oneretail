import connetMongoDB from "@/lib/services/database/mongodb";
import Gallery from "@/database/models/Gallery";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const gallery = await Gallery.findById(id).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: gallery });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const gallery = await Gallery.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(200).json({ success: true, data: gallery });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedGallery = await Gallery.deleteOne({ _id: id });
                res.status(200).json({ success: true, data: deletedGallery });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
