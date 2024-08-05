import connetMongoDB from "@/lib/services/database/mongodb";
import Media from "@/database/models/Media";


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

        default:
            res.status(400).json({ success: false });

            break;
    }
};