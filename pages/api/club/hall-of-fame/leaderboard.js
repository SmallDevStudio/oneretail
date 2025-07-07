import connectMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";
import Badges from "@/database/models/Badges";
import Users from "@/database/models/users";

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

        // ✅ ดึง Users ทั้งหมดที่ empId ตรงกับ HallOfFame
        const empIds = [...new Set(records.map((r) => String(r.empId)))];
        const users = await Users.find(
          { empId: { $in: empIds } },
          { userId: 1, fullname: 1, pictureUrl: 1, role: 1, empId: 1 }
        ).lean();

        const userMap = {};
        for (const u of users) {
          userMap[String(u.empId)] = {
            userId: u.userId,
            fullname: u.fullname,
            pictureUrl: u.pictureUrl,
            role: u.role,
          };
        }

        // ✅ map badge
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
            rewardtype = "";
          }

          if (!grouped[rewardtype]) {
            grouped[rewardtype] = {
              badge: badgeMap[rewardtype] || { name: "", image: "" },
              positions: {},
            };
          }

          const pos = record.position || "Unknown";
          if (!grouped[rewardtype].positions[pos]) {
            grouped[rewardtype].positions[pos] = [];
          }

          grouped[rewardtype].positions[pos].push({
            ...record,
            user: userMap[String(record.empId)] || null,
          });
        }

        // ✅ ดึง months ทั้งหมดจาก collection (ไม่ใช้แค่จาก records)
        const allRecords = await HallOfFame.find(
          {},
          { month: 1, year: 1, _id: 0 }
        ).lean();
        const months = [
          ...new Set(
            allRecords
              .filter((r) => r.year && r.month)
              .map((r) => `${r.year}-${r.month}`)
          ),
        ];

        // ✅ ส่งข้อมูลออก
        res.status(200).json({
          success: true,
          data: grouped,
          months,
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
