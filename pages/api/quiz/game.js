import connectMongoDB from "@/lib/services/database/mongodb";
import Quiz from "@/database/models/Quiz";

export default async function handler(req, res) {
    const { method, query } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const quizzes = await Quiz.find({ active: true });

                res.status(200).json({ success: true, data: quizzes });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Method not allowed" });
            break;
    }
};
