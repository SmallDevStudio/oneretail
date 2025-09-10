// pages/api/migrate-rewardtype.js
import connetMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connetMongoDB();

    await HallOfFame.updateMany(
      {
        $or: [
          { rewerdtype: { $exists: true } },
          { "Branch Name": { $exists: true } },
        ],
      },
      [
        {
          $set: {
            rewardtype: "$rewerdtype", // ✅ migrate rewerdtype → rewardtype
            branch: "$Branch Name", // ✅ migrate Branch Name → branch
            isClaimed: false, // ✅ set ค่าเริ่มต้น
          },
        },
        { $unset: ["rewerdtype", "Branch Name"] }, // ✅ ลบ field เก่า
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Migration completed (rewerdtype → rewardtype, Branch Name → branch)",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
