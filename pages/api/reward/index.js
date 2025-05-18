import connetMongoDB from "@/lib/services/database/mongodb";
import Reward from "@/database/models/Reward";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";
import moment from "moment-timezone"; // ⬅️ เพิ่ม
import { isSameWeek, parseISO } from "date-fns";

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

        // ใช้ moment timezone
        const today = moment().tz("Asia/Bangkok").startOf("day");
        const isMonday = today.day() === 1; // moment().day() => 0=Sunday, 1=Monday
        const lastRewardDate = reward.claim[reward.claim.length - 1]?.date;
        const isWeekend = isSameWeek(lastRewardDate, new Date(), {
          weekStartsOn: 1,
        });

        const lastReset = reward.lastResetDate
          ? moment(reward.lastResetDate).tz("Asia/Bangkok").startOf("day")
          : null;

        if (!isWeekend && (!lastReset || !lastReset.isSame(today))) {
          reward.dayLogged = 0;
          reward.lastResetDate = today.toDate(); // แปลงกลับเป็น Date
          await reward.save();
        }

        const lastClaim = reward.claim.length
          ? moment(reward.claim[reward.claim.length - 1].date)
              .tz("Asia/Bangkok")
              .startOf("day")
          : null;

        res.status(200).json({
          dayLogged: reward.dayLogged,
          lastRewardDate: lastClaim ? lastClaim.valueOf() : null, // ส่ง timestamp
        });
      } catch (error) {
        console.error("GET error:", error);
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

        const today = moment().tz("Asia/Bangkok").startOf("day");

        const lastClaim = reward.claim.length
          ? moment(reward.claim[reward.claim.length - 1].date)
              .tz("Asia/Bangkok")
              .startOf("day")
          : null;

        if (lastClaim && lastClaim.isSame(today)) {
          return res.status(400).json({ error: "Already claimed today" });
        }

        const nextDay = (reward.dayLogged % 7) + 1;

        const rewardData = [
          { day: 1, point: 1, icon: "/images/reward/day1.png" },
          { day: 2, point: 2, icon: "/images/reward/day2.png" },
          { day: 3, point: 3, icon: "/images/reward/day3.png" },
          { day: 4, point: 3, icon: "/images/reward/day4.png" },
          { day: 5, point: 3, icon: "/images/reward/day5.png" },
          { day: 6, point: 3, icon: "/images/reward/day6.png" },
          { day: 7, point: 10, icon: "/images/reward/day7.png" },
        ];

        const earnedPoints = rewardData.find((r) => r.day === nextDay);
        reward.claim.push({ date: new Date(), points: earnedPoints.point });
        reward.dayLogged = nextDay;
        reward.lastRewardDate = new Date();
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
        console.error("POST error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
