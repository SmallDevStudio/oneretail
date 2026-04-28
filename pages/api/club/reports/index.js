import connectMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  await connectMongoDB();

  const { month, year, region, zone, reward } = req.query;

  try {
    const filter = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (region) filter.region = region;
    if (zone) filter.zone = zone;
    if (reward) filter.rewardtype = reward;

    // 🔥 1. ดึง HallOfFame
    const hallData = await HallOfFame.find(filter).lean();

    // 🔥 2. เอา empId ทั้งหมด (unique)
    const empIds = [...new Set(hallData.map((item) => item.empId))];

    // 🔥 3. ดึง Users ทีเดียว
    const users = await Users.find(
      { empId: { $in: empIds } },
      { empId: 1, userId: 1, fullname: 1, pictureUrl: 1 },
    ).lean();

    // 🔥 4. ทำ map เพื่อ lookup เร็ว
    const userMap = {};
    users.forEach((u) => {
      userMap[u.empId] = u;
    });

    // 🔥 5. merge data
    const merged = hallData.map((item) => {
      const user = userMap[item.empId] || {};

      return {
        ...item,
        userId: user.userId || null,
        fullname: user.fullname || item.name, // fallback
        pictureUrl: user.pictureUrl || "",
      };
    });

    return res.status(200).json({
      success: true,
      data: merged,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
