import connetMongoDB from "@/lib/services/database/mongodb";
import ReviewQuiz from "@/database/models/ReviewQuiz";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const questions = await ReviewQuiz.find();
                res.status(200).json({ success: true, data: questions });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const question = await ReviewQuiz.create(req.body);
                res.status(201).json(question);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}