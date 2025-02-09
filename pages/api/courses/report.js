import connectMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";
import ReviewQuiz from "@/database/models/ReviewQuiz";
import Questionnaires from "@/database/models/Questionnaires";
import Gallery from "@/database/models/Gallery";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const { id } = req.query;
        // ดึงข้อมูล Course จาก Courses (โดยใช้ findOne และ sort โดย createdAt ในกรณีที่มีหลายรายการ)
        const course = await Courses.findOne({ _id: id }).sort({ createdAt: -1 }).lean();
        if (!course) {
          return res.status(404).json({ success: false, message: "Course not found" });
        }

        // ดึงข้อมูลคำถามทั้งหมดที่เกี่ยวข้องกับ course นี้จาก ReviewQuiz
        const questions = await ReviewQuiz.find({ courseId: id }).lean();

        // ดึงข้อมูล questionnaires สำหรับ course นี้
        const questionnaires = await Questionnaires.find({ courseId: id })
        .sort({ createdAt: -1 })
        .lean();

        // ดึงข้อมูล gallery สำหรับ course นี้
        const gallery = await Gallery.find({ courseId: id }).lean();

        // คำนวณค่าเฉลี่ยของ rating จาก questionnaires
        const ratings = questionnaires.map((q) => q.rating || 0);
        const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
        const averageRating = ratings.length ? totalRatings / ratings.length : 0;

        // ดึง suggestion ที่มีใน questionnaires (ไม่ว่างเปล่า)
        const suggestions = questionnaires
          .filter((q) => q.suggestion && q.suggestion.trim())
          .map((q) => q.suggestion);

        // ดึงข้อมูลผู้ใช้จาก Users โดยใช้ userId จาก questionnaires
        const userIds = questionnaires.map((q) => q.userId);
        const users = await Users.find({ userId: { $in: userIds } }).lean();

        // ดึง question IDs จาก questionnaires ใน field "question" (เป็น array ของ { questionId, answer })
        const allQuizIds = questionnaires.flatMap((q) =>
          q.question.map((qItem) => qItem.questionId)
        );
        const uniqueQuizIds = [...new Set(allQuizIds.map((id) => id.toString()))];
        // ดึงข้อมูลรายละเอียดคำถามจาก ReviewQuiz ที่ตรงกับ question IDs เหล่านี้
        const quizs = await ReviewQuiz.find({ _id: { $in: uniqueQuizIds } }).lean();

        // Map questionnaires ให้รวมข้อมูลของ user และรายละเอียดของคำถามในแต่ละ questionnaire
        const questionnairesWithUser = questionnaires.map((q) => {
          // หาข้อมูลผู้ใช้ที่ตรงกับ q.userId
          const user = users.find((u) => u.userId === q.userId);
          // Map field "question" (เป็น array) เพื่อเพิ่มข้อมูลรายละเอียดของคำถามและคำนวณ "point"
          const mappedQuestions = q.question.map((qItem) => {
            // หาข้อมูลคำถามที่ตรงกับ qItem.questionId จาก quizs
            const questionData = quizs.find(
              (qd) => qd._id.toString() === qItem.questionId.toString()
            );
            // คำนวณ point: หา index ของคำตอบที่ผู้ใช้เลือกใน questionData.options แล้วบวก 1
            let point = null;
            if (questionData && Array.isArray(questionData.options)) {
              const answerIndex = questionData.options.findIndex(
                (option) => option === qItem.answer
              );
              if (answerIndex >= 0) {
                point = answerIndex + 1;
              }
            }
            return {
              ...qItem,
              questionData, // รวมข้อมูลรายละเอียดของคำถาม (เช่น text, options)
              point,        // เพิ่ม field "point"
            };
          });

          return {
            ...q,
            user,          // รวมข้อมูลผู้ใช้
            question: mappedQuestions, // แทนที่ field question ด้วย array ที่ map แล้ว
          };
        });

        // สร้าง object courseData สำหรับส่งกลับ
        const courseData = {
          ...course,
          questions,                      // รายการคำถามทั้งหมดจาก ReviewQuiz สำหรับ course นี้
          questionnaires: questionnairesWithUser, // questionnaires ที่ map แล้ว
          gallery,
          averageRating,
          suggestions,
        };

        res.status(200).json({ success: true, data: courseData });
      } catch (error) {
        console.error("Error fetching course data:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid request method" });
      break;
  }
}
