import connetMongoDB from "@/lib/services/database/mongodb";
import Quiz from "@/database/models/Quiz";

export default async function handler(req, res) {
    const { method } = req;
    connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const quiz = await Quiz.find();
                res.status(200).json(quiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const quiz = await Quiz.create(req.body);
                res.status(201).json(quiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}