import connetMongoDB from "@/lib/services/database/mongodb";
import Carousel from "@/database/models/Carousel";

export default async function handler(req, res) {
    const { id } = req.query;
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const carousel = await Carousel.findOne({ _id: id });
                res.status(200).json(carousel);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { ...data } = req.body;
                const carousel = await Carousel.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json(carousel);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const carousel = await Carousel.findByIdAndDelete(id);
                res.status(200).json(carousel);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}