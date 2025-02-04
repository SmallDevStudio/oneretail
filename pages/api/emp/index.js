import connetMongoDB from "@/lib/services/database/mongodb";
import Emp from "@/database/models/emp";
export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET' :
            try {
                const emps = await Emp.find({}).sort({ createdAt: -1 });

                res.status(200).json({success: true, data: emps});
            } catch (error) {
                console.error('Error fetching emp:', error);
                res.status(400).json({ success: false, error: error.message });
            }
        break;

        case 'POST' :
            try {
                const emp = await Emp.create(req.body);
                res.status(201).json({success: true, data: emp});
            } catch (error) {
                console.error('Error creating emp:', error);
                res.status(400).json({ success: false, error: error.message });
            }
        break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
} 