// pages/api/migrate-rewardtype.js
import connectMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";
import GetPoints from "@/database/models/Hall-of-fame/GetPoints";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongoDB();

    // ✅ step1: set ค่าเริ่มต้นเป็น false ทั้งหมด
    await HallOfFame.updateMany({}, { $set: { isClaimed: false } });

    // ✅ step2: หา record ที่มี points > 0
    const recordsWithPoints = await HallOfFame.find(
      { points: { $gt: 0 } },
      { _id: 1 }
    ).lean();

    const recordIds = recordsWithPoints.map((r) => r._id);

    // ✅ step3: หา record ที่มีใน GetPoints
    const claimed = await GetPoints.find(
      { halloffameId: { $in: recordIds } },
      { halloffameId: 1 }
    ).lean();

    const claimedIds = new Set(claimed.map((c) => String(c.halloffameId)));

    // ✅ step4: update isClaimed = true เฉพาะ record ที่มี points > 0 และไม่ได้อยู่ใน GetPoints
    for (const r of recordsWithPoints) {
      if (!claimedIds.has(String(r._id))) {
        await HallOfFame.updateOne(
          { _id: r._id },
          { $set: { isClaimed: true } }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Migration completed: isClaimed updated based on conditions",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
