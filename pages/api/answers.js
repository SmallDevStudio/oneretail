import connetMongoDB from "@/lib/services/database/mongodb";
import Answer from "@/database/models/Answer";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === 'GET') {
        try {
          const answers = await Answer.find().populate('questionId');
          const userPromises = answers.map(async (answer) => {
            const user = await Users.findOne({ userId: answer.userId });
            return {
              ...answer._doc,
              user: user ? { fullname: user.fullname, empId: user.empId } : null,
            };
          });
    
          const answersWithUserDetails = await Promise.all(userPromises);
    
          res.status(200).json({ success: true, data: answersWithUserDetails });
        } catch (error) {
          res.status(400).json({ success: false, error });
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