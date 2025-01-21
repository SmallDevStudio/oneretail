import connetMongoDB from "@/lib/services/database/mongodb";
import Examinations from "@/database/models/Examinations";
import ExaminationAnswer from "@/database/models/ExaminationAnswer";
import UserAnswer from "@/database/models/UserAnswer";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import ExamQuestions from "@/database/models/ExamQuestions";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                // Fetch all examinations
                const examinations = await Examinations.find({}).lean();

                // Fetch answers related to the examinations
                const examIds = examinations.map((examination) => examination._id);
                const answers = await ExaminationAnswer.find({ examId: { $in: examIds } }).lean();

                // Fetch user answers related to the answers
                const answerIds = answers.map((answer) => answer._id);
                const userAnswers = await UserAnswer.find({ examAnswerId: { $in: answerIds } }).lean();

                // Fetch user details manually
                const userIds = [...new Set(answers.map((answer) => answer.userId))];
                const users = await Users.find({ userId: { $in: userIds } }).lean();

                // Fetch emp details manually
                const empIds = users.map((user) => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                // Fetch questions related to user answers
                const questionIds = [...new Set(userAnswers.flatMap((ua) => ua.answers.map((a) => a.questionId)))];
                const questions = await ExamQuestions.find({ _id: { $in: questionIds } }).lean();

                // Map users with emp data
                const usersWithEmp = users.map((user) => {
                    const emp = emps.find((e) => e.empId === user.empId);
                    return {
                        ...user,
                        emp: emp || null, // Add emp details or null if not found
                    };
                });

                // Map data
                const examinationPopulated = examinations.map((examination) => {
                    const relatedAnswers = answers.filter(
                        (answer) => answer.examId.toString() === examination._id.toString()
                    );

                    // Add userAnswerCount and detailed user mapping
                    const populatedAnswers = relatedAnswers.map((answer) => {
                        const user = usersWithEmp.find((u) => u.userId === answer.userId);
                        const relatedUserAnswers = userAnswers
                            .filter((ua) => ua.examAnswerId.toString() === answer._id.toString())
                            .map((ua) => ({
                                ...ua,
                                answers: ua.answers.map((a) => ({
                                    ...a,
                                    question: questions.find(
                                        (q) => q._id.toString() === a.questionId.toString()
                                    ),
                                })),
                            }));

                        return {
                            ...answer,
                            user,
                            userAnswers: relatedUserAnswers,
                        };
                    });

                    return {
                        ...examination,
                        answers: populatedAnswers,
                        userAnswerCount: populatedAnswers.length,
                    };
                });

                res.status(200).json({ success: true, data: examinationPopulated });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid request method" });
            break;
    }
}
