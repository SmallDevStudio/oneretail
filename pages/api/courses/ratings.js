import connetMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";
import ReviewQuiz from "@/database/models/ReviewQuiz";
import Questionnaires from "@/database/models/Questionnaires";
import QuestionnaireComments from "@/database/models/QuestionnaireComments";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const course = await Courses.findOne({ _id: id });
                if (!course) {
                    return res.status(404).json({ success: false, message: "Course not found" });
                }

                const questions = await ReviewQuiz.find({ courseId: id }).sort({ createdAt: 1 });

                const courseWithQuestions = {
                    ...course.toObject(),
                    questions,
                };

                const questionnaires = await Questionnaires.find({ courseId: id });

                // คำนวณคะแนนเฉลี่ย
                const ratings = questionnaires.map((questionnaire) => questionnaire.rating);
                const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
                const averageRating = ratings.length ? totalRatings / ratings.length : 0;

                // ดึงข้อมูล suggestions
                const suggestions = await Promise.all(
                    questionnaires
                        .filter((questionnaire) => questionnaire.suggestion?.trim()) // ตรวจสอบว่า suggestion ไม่เป็น null/undefined/ว่าง
                        .map(async (questionnaire) => {
                            // ดึงข้อมูล comments จาก QuestionnaireComments
                            const comments = await QuestionnaireComments.find({
                                questionnaireId: questionnaire._id,
                            });

                            let user = null;
                            if (!questionnaire.anonymous) {
                                // ดึงข้อมูล user หากไม่ anonymous
                                user = await Users.findOne({ userId: questionnaire.userId });
                            }

                            // ดึงข้อมูล user แบบ manual สำหรับ comments
                            const userIds = comments.map((comment) => comment.userId);
                            const users = await Users.find({ userId: { $in: userIds } });

                            // แมปข้อมูล user กับ comments
                            const commentsWithUsers = comments.map((comment) => ({
                                ...comment.toObject(),
                                user: users.find((user) => user.userId === comment.userId),
                            }));

                            return {
                                _id: questionnaire._id,
                                userId: questionnaire.anonymous ? null : questionnaire.userId, // null ถ้า anonymous
                                suggestion: questionnaire.suggestion,
                                rating: questionnaire.rating,
                                createAt: questionnaire.createdAt,
                                user: questionnaire.anonymous ? null : user, // null ถ้า anonymous
                                comments: commentsWithUsers, // comments พร้อมข้อมูล user
                                anonymous: questionnaire.anonymous, // เพิ่ม anonymous ใน response
                            };
                        })
                );

                // ส่งข้อมูลกลับไปยัง Client
                res.status(200).json({
                    success: true,
                    data: courseWithQuestions,
                    questionnaires,
                    rating: averageRating,
                    suggestions, // ส่ง suggestions ที่มีข้อมูล comments, user และ anonymous
                });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "DELETE":
            try {
                await ReviewQuiz.deleteMany({ courseId: id });
                const course = await Courses.findByIdAndDelete(id);
                if (!course) {
                    return res.status(404).json({ success: false, message: "Course not found" });
                }
                res.status(200).json({ success: true, data: course });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid method" });
            break;
    }
}
