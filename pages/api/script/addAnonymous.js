import connetMongoDB from "@/lib/services/database/mongodb";
import Questionnaires from "@/database/models/Questionnaires";

export default async function handler(req, res) {
    await connetMongoDB();
    
    const { method } = req;

    if (method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const questionnaires = await Questionnaires.find({});

        for (const questionnaire of questionnaires) {
            await Questionnaires.updateOne(
                { _id: questionnaire._id },
                { $set: { anonymous: false } }
            )
        }

        res.status(200).json({ success: true, message: 'Anonymous added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

