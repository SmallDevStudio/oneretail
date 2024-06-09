import connetMongoDB from "@/lib/services/database/mongodb";
import Question from "@/database/models/Question";

export default async function handler(req, res) {
    await connetMongoDB();
    const questions = await Question.find({});
    res.status(200).json(questions);
}