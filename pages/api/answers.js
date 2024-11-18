import connectMongoDB from "@/lib/services/database/mongodb";
import Answer from "@/database/models/Answer";
import Users from "@/database/models/users";
import Question from "@/database/models/Question";
import Quiz from "@/database/models/Quiz";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'GET') {
    try {
      const { page, pageSize, startDate, endDate } = req.query;
      const skip = (page - 1) * pageSize;
      const limit = parseInt(pageSize, 10);

      const dateFilter = {};
        if (startDate) {
          dateFilter['$gte'] = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)); // เวลาเริ่มต้น
        }
        if (endDate) {
          dateFilter['$lte'] = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)); // เวลาสิ้นสุด
        }

        const filter = startDate || endDate ? { timestamp: dateFilter } : {};

      const answers = await Answer.find(filter)
        .sort({ timestamp: -1 }) // เปลี่ยนจาก createdAt เป็น timestamp
        .skip(skip)
        .limit(limit);

      const totalAnswers = await Answer.countDocuments(filter);

      // เพิ่ม logic สำหรับแยกข้อมูล
      const cutoffDate = new Date('2024-10-30T00:00:00Z');
      const answersWithDetails = await Promise.all(
        answers.map(async (answer) => {
          let additionalData = null;

          if (answer.timestamp >= cutoffDate) {
            // หลังวันที่ 30-10-2024 ดึงข้อมูลจาก Quiz
            additionalData = await Quiz.findOne({ _id: answer.questionId });
          } else {
            // ก่อนวันที่ 30-10-2024 ดึงข้อมูลจาก Question
            additionalData = await Question.findOne({ _id: answer.questionId });
          }

          const user = await Users.findOne({ userId: answer.userId });

          return {
            ...answer._doc,
            additionalDetails: additionalData,
            user: user ? { fullname: user.fullname, empId: user.empId } : null,
          };
        })
      );

      res.status(200).json({ success: true, data: answersWithDetails, total: totalAnswers });
    } catch (error) {
      console.error('Error fetching answers:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, questionId, answer, isCorrect } = req.body;
      const newAnswer = new Answer({ userId, questionId, answer, isCorrect });
      await newAnswer.save();
      res.status(201).json({ success: true, data: newAnswer });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else if (req.method === 'DELETE') {
    try {
      // กำหนดช่วงเวลาของวันที่ 17-11-2024
      const startOfDay = new Date('2024-11-17T00:00:00Z');
      const endOfDay = new Date('2024-11-17T23:59:59Z');

      // ลบ answers ที่อยู่ในช่วงเวลานั้น
      const result = await Answer.deleteMany({
        timestamp: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      res.status(200).json({
        message: 'Answers deleted successfully',
        deletedCount: result.deletedCount, // แสดงจำนวน answers ที่ถูกลบ
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while deleting answers' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
