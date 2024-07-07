import connectMongoDB from "@/lib/services/database/mongodb";
import LoginReward from "@/database/models/LoginReward";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  await connectMongoDB();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  if (req.method === 'GET') {
    try {
      const existingReward = await LoginReward.findOne({ userId });

      if (existingReward) {
        const today = new Date().toDateString();
        const receivedPointsToday = new Date(existingReward.lastLogin).toDateString() === today;
        return res.status(200).json({ day: existingReward.day, receivedPointsToday, lastLogin: existingReward.lastLogin });
      } else {
        return res.status(200).json({ day: 0, receivedPointsToday: false, lastLogin: null });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const existingReward = await LoginReward.findOne({ userId });

      let newPoints = 1;
      let day = 1;

      if (!existingReward) {
        await LoginReward.create({ userId, day, lastLogin: new Date() });
        newPoints = Math.floor(Math.random() * 16) + 15;
      } else {
        const lastLogin = new Date(existingReward.lastLogin);
        const today = new Date();

        if (lastLogin.toDateString() === today.toDateString()) {
          return res.status(400).json({ error: 'Already received points today' });
        }

        day = existingReward.day >= 30 ? 1 : existingReward.day + 1;
        await LoginReward.updateOne({ userId }, { day, lastLogin: today });
      }
      console.log('newPoints:', newPoints);

      await Point.create({
        userId,
        description: 'Login Reward',
        contentId: null,
        type: 'earn',
        point: newPoints,
      });

      // ส่งข้อความไปที่ LINE
      const message = `คุณได้รับ ${newPoints} คะแนนจากการ Login Reward!`;
      sendLineMessage(userId, message);

      return res.status(200).json({ message: 'Points added', points: newPoints, day });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
