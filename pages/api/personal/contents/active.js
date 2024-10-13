import connetMongoDB from "@/lib/services/database/mongodb";
import PersonalizedContents from "@/database/models/PersonalizedContents";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case 'PUT':
            try {
                const { active } = req.body;
                const content = await PersonalizedContents.findByIdAndUpdate(
                    id, {
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
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}