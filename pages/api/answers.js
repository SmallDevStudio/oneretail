import connectMongoDB from "@/lib/services/database/mongodb";
import Answer from "@/database/models/Answer";
import Users from "@/database/models/users";
import Question from "@/database/models/Question";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'GET') {
    try {
      const { page = 1, pageSize = 10, startDate, endDate } = req.query;
      const skip = (page - 1) * pageSize;
      const limit = parseInt(pageSize, 10);

      const dateFilter = {};
      if (startDate) {
        dateFilter['$gte'] = new Date(startDate);
      }
      if (endDate) {
        dateFilter['$lte'] = new Date(endDate);
      }

      const filter = startDate || endDate ? { timestamp: dateFilter } : {};

      console.log('Filter being used:', filter);

      const answers = await Answer.find(filter)
        .populate('questionId')
        .sort({ timestamp: -1 })  // เปลี่ยนจาก createdAt เป็น timestamp
        .skip(skip)
        .limit(limit);

      const totalAnswers = await Answer.countDocuments(filter);

      const userPromises = answers.map(async (answer) => {
        const user = await Users.findOne({ userId: answer.userId });
        return {
          ...answer._doc,
          user: user ? { fullname: user.fullname, empId: user.empId } : null,
        };
      });

      const answersWithUserDetails = await Promise.all(userPromises);

      console.log('Answers fetched:', answersWithUserDetails.length);

      res.status(200).json({ success: true, data: answersWithUserDetails, total: totalAnswers });
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
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
