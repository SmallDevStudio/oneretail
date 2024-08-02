import connectMongoDB from "@/lib/services/database/mongodb";
import UserQuiz from "@/database/models/UserQuiz";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'GET') {
    try {
      const userQuizzes = await UserQuiz.find({}).sort({ createdAt: -1 });
      const userIds = userQuizzes.map(userQuiz => userQuiz.userId);
      const users = await Users.find({ userId: { $in: userIds } });

      const data = userQuizzes.flatMap(userQuiz => {
        const user = users.find(user => user.userId === userQuiz.userId);
        return userQuiz.scores.map(scoreItem => ({
          userId: user ? user.userId : '',
          empId: user ? user.empId : '',
          fullname: user ? user.fullname : 'Unknown',
          pictureUrl: user ? user.pictureUrl : '',
          score: scoreItem.score,
          date: scoreItem.date,
        }));
      });

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
