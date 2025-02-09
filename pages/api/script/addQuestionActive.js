import connetMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";

export default async function handler(req, res) {
    await connetMongoDB();
    
    const { method } = req;

    if (method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const course = await Courses.find({});

        for (const courses of course) {
            await Courses.updateOne(
                { _id: courses._id },
                { $set: { questionnairesActive: true } }
            )
        }

        res.status(200).json({ success: true, message: 'QuestionnairesActive added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

