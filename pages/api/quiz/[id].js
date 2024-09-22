import connetMongoDB from "@/lib/services/database/mongodb";
import Quiz from "@/database/models/Quiz";

export default async function handler(req, res) {
    const { method } = req;
    connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const { id } = req.query;
                const quiz = await Quiz.findById(id);
                res.status(200).json(quiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { id } = req.query;
                const { ...data } = req.body;
                const quiz = await Quiz.findByIdAndUpdate(id, data, { new: true, runValidators: true });
                if (!quiz) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json(quiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const { id } = req.query;
                const quiz = await Quiz.findByIdAndDelete(id);
                res.status(200).json(quiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            

        default:
            res.status(400).json({ success: false });
            break;
    }
}