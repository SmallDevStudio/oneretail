import connectMongoDB from "@/lib/services/database/mongodb";
import ExamAnswer from "@/database/models/ExamAnswer";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'DELETE':
            const { id } = req.query;

            try {
                const answer = await ExamAnswer.findById(id);

                if (!answer) {
                    return res.status(404).json({ success: false, error: 'Answer not found' });
                }

                await ExamAnswer.findByIdAndDelete(id);

                res.status(200).json({ success: true });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}