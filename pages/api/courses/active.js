import connetMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
        case "PUT": 
            try {
                const { active } = req.body;
                const course = await Courses.findByIdAndUpdate(id, { active }, { new: true });
                res.status(200).json(course);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}