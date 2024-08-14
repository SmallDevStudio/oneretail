import connetMongoDB from "@/lib/services/database/mongodb";
import Carousel from "@/database/models/Carousel";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const carousels = await Carousel.find({status: true});
                res.status(200).json(carousels);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const carousel = await Carousel.create(req.body);
                res.status(201).json(carousel);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { id, ...data } = req.body;
                const carousel = await Carousel.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json(carousel);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const { id } = req.body;
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