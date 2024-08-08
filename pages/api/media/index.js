import connetMongoDB from "@/lib/services/database/mongodb";
import Media from "@/database/models/Media";
import axios from 'axios';

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'POST':
        try {
            const media = await Media.create(req.body);
    
            res.status(201).json({ success: true, data: media });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
        break;
        case 'GET':
        try {
            const media = await Media.find({});
            res.status(200).json(media);
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
        break;

        case "PUT":
            try {
                const { id } = req.query;
                const data = req.body;
                const media = await Media.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json(media);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const { id } = req.query;
                const media = await Media.findByIdAndDelete(id);
                res.status(200).json(media);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}