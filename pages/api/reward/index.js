import connetMongoDB from "@/lib/services/database/mongodb";
import UserReward from "@/database/models/UserReward";
import moment from "moment";

export default async function handler(req, res) {
    await connetMongoDB();
  
    const { method } = req;
    const { userId } = req.body;

    switch (method) {
        case 'POST':
            try {
                const today = moment().startOf('day');
                const lastReward = await UserReward.findOne({ userId }).sort({ date: -1 });
                let day = 1;
          
                if (lastReward) {
                  const lastDate = moment(lastReward.date).startOf('day');
                  const daysSince = today.diff(lastDate, 'days');
                  
                  if (daysSince === 1 && lastReward.day < 7) {
                    day = lastReward.day + 1;
                  } else if (daysSince === 1 && lastReward.day === 7) {
                    day = 1;
                  }
                }
          
                const points = day === 7 ? day * day : day;
                await UserReward.create({ userId, day, points });
          
                res.status(200).json({ success: true, day, points });
              } catch (error) {
                res.status(500).json({ success: false, error: error.message });
              }
            break;

        default:
            res.status(400).json({ success: false, error: 'Method not allowed' });
            break;
    }
  };