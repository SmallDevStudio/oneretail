// /pages/api/club/hall-of-fame/meta.js
import connetMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";

export default async function handler(req, res) {
  await connetMongoDB();

  try {
    const months = await HallOfFame.distinct("month");
    const years = await HallOfFame.distinct("year");

    // จัดเรียงและแปลงให้เป็น Number
    const sortedMonths = months.map((m) => parseInt(m)).sort((a, b) => a - b);
    const sortedYears = years.map((y) => parseInt(y)).sort((a, b) => b - a);

    res.status(200).json({
      months: sortedMonths,
      years: sortedYears,
    });
  } catch (err) {
    console.error("Error fetching meta:", err);
    res.status(500).json({ message: "Server error" });
  }
}
