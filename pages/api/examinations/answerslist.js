import connectMongoDB from "@/lib/services/database/mongodb";
import ExamAnswer from "@/database/models/ExamAnswer";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const exams = await ExamAnswer.find({}).sort({ createdAt: -1 });
                const userIds = exams.map(exam => exam.userId);
                const users = await Users.find({ userId: { $in: userIds } });

                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } });

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const enrichedExams = exams.map(exam => {
                    const user = userMap[exam.userId];
                    const emp = empMap[user.empId];
                    return {
                        examCount: exam.exams.length,
                        user,
                        emp
                    };
                });

                const sortedExams = enrichedExams.sort((a, b) => b.createdAt - a.createdAt);

                // res.status(200).json({ success: true, data: sortedExams });

                res.status(200).json({ success: true, data: sortedExams });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}