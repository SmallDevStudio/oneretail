import connetMongoDB from "@/lib/services/database/mongodb";
import Satisfaction from "@/database/models/Satisfaction";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'DELETE':
            const { id } = req.query;
            console.log('id', id)
            try {
                const satisfaction = await Satisfaction.findById(id);
                if (!satisfaction) {
                    return res.status(404).json({ success: false, error: 'Satisfaction not found' });
                }

                // Remove the satisfaction from the user
                await Satisfaction.deleteOne({ _id: id });
                
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}