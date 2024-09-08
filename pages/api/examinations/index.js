import connectMongoDB from "@/lib/services/database/mongodb";
import Examinations from "@/database/models/Examination";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const examinations = await Examinations.find().sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: examinations });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            // Create a new examination
            try {
                const examination = await Examinations.create(req.body);
                res.status(201).json({ success: true, data: examination });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
