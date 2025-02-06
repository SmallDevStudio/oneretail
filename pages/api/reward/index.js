import connetMongoDB from '@/lib/services/database/mongodb';
import Reward from '@/database/models/Reward';
import UserReward from '@/database/models/UserReward';
export default async function handler(req, res) {
  await connetMongoDB();

  if (req.method === 'POST') {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // หา UserReward ว่ามีอยู่แล้วหรือไม่
      let userReward = await UserReward.findOne({ userId });

      if (!userReward) {
        // ถ้ายังไม่มีให้สร้างใหม่
        userReward = new UserReward({
          userId,
          dayLogged: 1,
          lastRewardDate: today,
        });
      } else {
        const lastDate = new Date(userReward.lastRewardDate);
        lastDate.setHours(0, 0, 0, 0);

        // ตรวจสอบว่าเป็นวันใหม่หรือไม่
        if (today.getTime() === lastDate.getTime()) {
          return res.status(400).json({ error: 'Reward already claimed today' });
        }

        // ตรวจสอบว่าวันที่ต่อเนื่องหรือไม่
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          userReward.dayLogged += 1;
        } else {
          userReward.dayLogged = 1; // รีเซ็ตหากไม่ได้เข้าใช้งานต่อเนื่อง
        }

        userReward.lastRewardDate = today;
      }

      // คำนวณ point ตามเงื่อนไข
      let points = userReward.dayLogged;
      if (userReward.dayLogged === 7) {
        points = 7 * 7;
      } else if (userReward.dayLogged > 7) {
        userReward.dayLogged = 1; // รีเซ็ตหลังจากวันที่ 7
        points = 1;
      }

      // สร้าง Reward record
      const reward = new Reward({
        userId,
        date: today,
        points,
      });

      await reward.save();
      await userReward.save();

      return res.status(200).json({ success: true, points, dayLogged: userReward.dayLogged });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const userReward = await UserReward.findOne({ userId });

      if (!userReward) {
        return res.status(200).json({ dayLogged: 0, lastRewardDate: null });
      }

      return res.status(200).json({
        dayLogged: userReward.dayLogged,
        lastRewardDate: userReward.lastRewardDate || null,
      });

    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
