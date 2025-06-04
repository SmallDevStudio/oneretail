import connectMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";
import Badges from "@/database/models/Badges"; // ✅ ดึง badge

export default async function handler(req, res) {
  const { method } = req;
  const { month, year } = req.query;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const query = {};
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);

        const records = await HallOfFame.find(query).lean();
        const badges = await Badges.find({ active: true }).lean();

        // สร้าง map จาก badge name → ข้อมูล badge
        const badgeMap = {};
        for (const b of badges) {
          const key = (b.name || "").trim().toLowerCase();
          badgeMap[key] = {
            name: b.name,
            image: b.image?.url || "",
          };
        }

        const grouped = {};

        for (const record of records) {
          let rewardtype = record.rewardtype?.trim().toLowerCase();

          if (!rewardtype || rewardtype === "n/a") {
            rewardtype = "ไม่มี rewardtype";
          }

          if (!grouped[rewardtype]) {
            grouped[rewardtype] = {
              badge: badgeMap[rewardtype] || {
                name: "ไม่มี rewardtype",
                image: "",
              },
              positions: {},
            };
          }

          const pos = record.position || "Unknown";
          if (!grouped[rewardtype].positions[pos]) {
            grouped[rewardtype].positions[pos] = [];
          }

          grouped[rewardtype].positions[pos].push(record);
        }

        res
          .status(200)
          .json({
            success: true,
            data: grouped,
            months: [...new Set(records.map((r) => `${r.year}-${r.month}`))],
          });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
