import connectMongoDB from "@/lib/services/database/mongodb";
import Questionnaires from "@/database/models/Questionnaires";
import ReviewQuiz from "@/database/models/ReviewQuiz";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await connectMongoDB();

        const questionnaires = await Questionnaires.find();

        for (const item of questionnaires) {
            let totalPoints = 0;
            let maxPoints = 0;

            for (const q of item.question) {
                const questionData = await ReviewQuiz.findById(q.questionId);
                if (questionData) {
                    const index = questionData.options.indexOf(q.answer);
                    if (index !== -1) {
                        const point = index + 1;
                        totalPoints += point;
                        maxPoints += questionData.options.length;
                    }
                }
            }

            const newRating = maxPoints > 0 ? (totalPoints / maxPoints) * 5 : 0;

            await Questionnaires.findByIdAndUpdate(item._id, {
                rating: parseFloat(newRating.toFixed(2))
            });
        }

        res.status(200).json({ success: true, message: 'Questionnaires ratings updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
}
