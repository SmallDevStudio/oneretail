// /api/survey
import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Users from "@/database/models/users";
import Coins from "@/database/models/Coins";
import sendLineMessage from "@/lib/sendLineMessage";

export const config = {
    api: {
      responseLimit: false,
    },
  };

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const surveys = await Survey.find({}).lean();
                const userIds = surveys.map(survey => survey.userId);
                const users = await Users.find({ userId: { $in: userIds } }).lean();

                const surveysWithUserDetails = surveys.map(survey => {
                    const user = users.find(user => user.userId === survey.userId);
                    return {
                        ...survey,
                        fullname: user ? user.fullname : 'Unknown',
                        empId: user ? user.empId : 'Unknown',
                        pictureUrl: user ? user.pictureUrl : ''
                    };
                });

                res.status(200).json(surveysWithUserDetails);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const survey = await Survey.create(req.body);

                const newCoins = new Coins({
                    userId: survey.userId,
                    description: `ส่งแบบสอบถาม ${new Date().toISOString().split('T')[0]}`,
                    type: 'earn',
                    coins: 1
                });
                await newCoins.save();

                const message = `คุณได้รับ Coins 1 จากการส่งแบบสอบถามแล้ว!`;
                await sendLineMessage(survey.userId, message);
                
                res.status(201).json({ success: true, data: survey });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Method not allowed' });
            break;
    }
}
