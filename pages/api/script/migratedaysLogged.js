import connectMongoDB from "@/lib/services/database/mongodb";
import LoginReward from "@/database/models/LoginReward";

export default async function handler(req, res) {
  await connectMongoDB();

  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const rewards = await LoginReward.find();

    for (const reward of rewards) {
      if (!Array.isArray(reward.daysLogged)) {
        reward.daysLogged = [];
        await LoginReward.updateOne(
          { _id: reward._id },
          { $set: { daysLogged: reward.daysLogged } }
        );
        console.log('Updated reward:', reward); // บันทึกข้อมูลหลังการอัพเดต
      }
    }

    res.status(200).json({ success: true, message: 'Migration complete.' });
  } catch (error) {
    console.error('Error during migration:', error);
    res.status(500).json({ success: false, error: 'Error during migration' });
  }
}
