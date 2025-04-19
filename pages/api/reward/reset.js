import connectMongoDB from "@/lib/services/database/mongodb";
import Reward from "@/database/models/Reward"; // สมมุติชื่อ model ว่า Reward

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    await connectMongoDB();

    await Reward.findOneAndUpdate(
      { userId },
      { $set: { dayLogged: 0 } },
      { new: true }
    );

    return res.status(200).json({ message: "Reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
