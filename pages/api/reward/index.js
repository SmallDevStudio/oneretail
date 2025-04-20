import connetMongoDB from "@/lib/services/database/mongodb";
import Reward from "@/database/models/Reward";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  await connetMongoDB();

  switch (req.method) {
    case "GET":
      try {
        const { userId } = req.query;
        if (!userId)
          return res.status(400).json({ error: "User ID is required" });

        let reward = await Reward.findOne({ userId });
        if (!reward) {
          reward = await Reward.create({
            userId,
            claim: [],
            dayLogged: 0,
            lastResetDate: null,
          });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isMonday = today.getDay() === 1;

        // ตรวจสอบว่าเคย reset วันนี้หรือยัง
        const lastReset = reward.lastResetDate
          ? new Date(reward.lastResetDate).setHours(0, 0, 0, 0)
          : null;

        if (isMonday && lastReset !== today.getTime()) {
          reward.dayLogged = 0;
          reward.lastResetDate = today;
          await reward.save();
        }

        const lastClaim = reward.claim.length
          ? new Date(reward.claim[reward.claim.length - 1].date)
          : null;

        lastClaim?.setHours(0, 0, 0, 0);

        res.status(200).json({
          dayLogged: reward.dayLogged,
          lastRewardDate: lastClaim?.getTime() || null,
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "POST":
      try {
        const { userId } = req.body;
        if (!userId)
          return res.status(400).json({ error: "User ID is required" });

        let reward = await Reward.findOne({ userId });
        if (!reward) {
          reward = await Reward.create({ userId, claim: [], dayLogged: 0 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastClaim = reward.claim.length
          ? new Date(reward.claim[reward.claim.length - 1].date)
          : null;
        lastClaim?.setHours(0, 0, 0, 0);

        if (lastClaim?.getTime() === today.getTime()) {
          return res.status(400).json({ error: "Already claimed today" });
        }

        let nextDay = (reward.dayLogged % 7) + 1;
        const rewardData = [
          {
            day: 1,
            point: 1,
            icon: "/images/reward/day1.png",
          },
          {
            day: 2,
            point: 2,
            icon: "/images/reward/day2.png",
          },
          {
            day: 3,
            point: 3,
            icon: "/images/reward/day3.png",
          },
          {
            day: 4,
            point: 3,
            icon: "/images/reward/day4.png",
          },
          {
            day: 5,
            point: 3,
            icon: "/images/reward/day5.png",
          },
          {
            day: 6,
            point: 3,
            icon: "/images/reward/day6.png",
          },
          {
            day: 7,
            point: 10,
            icon: "/images/reward/day7.png",
          },
        ];

        const earnedPoints = rewardData.find((r) => r.day === nextDay);
        reward.claim.push({ date: new Date(), points: earnedPoints.point });
        reward.dayLogged = nextDay;

        await reward.save();

        const pointEntry = new Point({
          userId,
          description: `Check in reward`,
          contentId: null,
          path: "reward",
          type: "earn",
          point: earnedPoints.point,
        });
        await pointEntry.save();

        // ส่งข้อความ + รูปภาพไป LINE
        const message = `คุณได้รับ ${earnedPoints.point} คะแนน จากการเช็คอินวันที่ ${nextDay} 🎉`;
        sendLineMessage(userId, message);

        res.status(200).json({ dayLogged: reward.dayLogged });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
