import connetMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";
import ReviewQuiz from "@/database/models/ReviewQuiz";
import Questionnaires from "@/database/models/Questionnaires";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                // ดึงข้อมูล Courses ทั้งหมด
                const courses = await Courses.find().sort({ createdAt: -1 });

                // ใช้ Promise.all เพื่อดึงข้อมูลที่เกี่ยวข้องในแต่ละ Course
                const courseData = await Promise.all(
                    courses.map(async (course) => {
                        // ดึงคำถามของ Course
                        const questions = await ReviewQuiz.find({ courseId: course._id });

                        // ดึงข้อมูลแบบสอบถามของ Course
                        const questionnaires = await Questionnaires.find({ courseId: course._id });

                        // คำนวณค่าเฉลี่ยของ Rating
                        const ratings = questionnaires.map((q) => q.rating || 0);
                        const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
                        const averageRating = ratings.length ? totalRatings / ratings.length : 0;

                        // ดึง Suggestion ที่มีในแต่ละ Course
                        const suggestions = questionnaires
                            .filter((q) => q.suggestion?.trim())
                            .map((q) => q.suggestion);

                        return {
                            course: course.toObject(),
                            questions,
                            rating: averageRating,
                            suggestions,
                            questionnaires,
                        };
                    })
                );

                res.status(200).json({ success: true, data: courseData });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            const { title, description, category, group, active, questions, creator } = req.body;

            try {
                // สร้างเอกสารใน Courses
                const course = await Courses.create({
                    title,
                    description,
                    category,
                    group,
                    active,
                    creator,
                });

                // ตรวจสอบว่ามี questions และวนลูปเพื่อสร้างใน ReviewQuiz
                const quizPromises = questions.map(async (q) => {
                    return await ReviewQuiz.create({
                        courseId: course._id,
                        question: q.question,
                        description: q.description,
                        options: q.options,
                    });
                });

                // รอให้คำถามทั้งหมดถูกบันทึก
                const quizzes = await Promise.all(quizPromises);

                res.status(201).json({ success: true, data: course, quizzes });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
