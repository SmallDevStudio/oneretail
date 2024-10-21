import connetMongoDB from "@/lib/services/database/mongodb";
import Forms from "@/database/models/Forms";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case 'PUT':
            try {
                const { formId, status } = req.body;
                const form = await Forms.findByIdAndUpdate(formId, 
                    { status }, 
                    { new: true }
                );
                res.status(200).json(form);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
    }
}