import connetMongoDB from "@/lib/services/database/mongodb";
import PersonalizedQuizs from "@/database/models/PersonalizedQuizs";

export default async function handler(req, res) {
    const { method } = req
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const questions = await PersonalizedQuizs.find();
                res.status(200).json({ success: true, data: questions });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case 'POST':
            console.log(req.body);
            try {
                const question = await PersonalizedQuizs.create(req.body);
                res.status(201).json(question);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}