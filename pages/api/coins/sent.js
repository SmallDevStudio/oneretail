import connectMongoDB from '@/lib/services/database/mongodb';
import Coins from '@/database/models/Coins';
import Users from '@/database/models/users';

export default async function handler(req, res) {
  await connectMongoDB();
  
  if (req.method === 'POST') {
    const { empId, coins, ref } = req.body;

    try {
      const user = await Users.findOne({ empId });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const newCoins = new Coins({
        userId: user.userId,
        description: `รับ point และ coins จาก ${ref}`,
        type: 'earn',
        coins: coins
      });

      await newCoins.save();
      return res.status(200).json({ success: true, data: newCoins });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}