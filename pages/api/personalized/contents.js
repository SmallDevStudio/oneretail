import connetMongoDB from "@/lib/services/database/mongodb";
import ContentGen from "@/database/models/ContentGen";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                if (!id) {
                    return res.status(400).json({ success: false, message: 'ID is required' });
                }

                const content = await ContentGen.findOne({ _id: id })
                .populate('contents');
                
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { name, contents, active } = req.body;
                const content = await ContentGen.findByIdAndUpdate(
                    id, {
                        name,
                        contents,
                        active
                    }, {
                    new: true,
                    runValidators: true
                });
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const content = await ContentGen.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}