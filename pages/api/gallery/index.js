import connetMongoDB from "@/lib/services/database/mongodb";
import Gallery from "@/database/models/Gallery";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const gallery = await Gallery.find();
                res.status(200).json({ success: true, data: gallery });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const gallery = await Gallery.create(req.body);
                res.status(201).json(gallery);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
    