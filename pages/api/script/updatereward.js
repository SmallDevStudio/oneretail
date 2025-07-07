import connectMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";

export default async function handler(req, res) {
  await connectMongoDB();

  try {
    // ดึงเฉพาะ document ที่มี month = 4 และมี field reward
    const records = await HallOfFame.find({
      month: 4,
    });

    for (const record of records) {
      // อัปเดตแต่ละรายการ
      await HallOfFame.updateOne(
        { _id: record._id },
        {
          $set: { rewardtype: record.reward },
          $unset: { reward: "" }, // ลบ field reward ออก
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Updated ${records.length} records successfully.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
