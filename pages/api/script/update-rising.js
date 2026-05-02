import connetMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connetMongoDB();

    const result = await HallOfFame.updateMany(
      {
        month: 10,
        rewardtype: "Platinum",
      },
      {
        $set: {
          rewardtype: "Rising Star",
        },
      },
    );

    return res.status(200).json({
      message: "Updated Platinum to Rising Star for month 10",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
