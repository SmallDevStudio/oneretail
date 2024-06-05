import connetMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";


export default async function handler(req, res) {
    const { method } = req
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const surveys = await Survey.find({})
                res.status(200).json(surveys)
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break

        case 'POST':
            try {
                const survey = await Survey.create(req.body);
                res.status(201).json({ success: true, data: survey });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Method not allowed' });
            break;

    }
     
}