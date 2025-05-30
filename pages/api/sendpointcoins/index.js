// pages/api/sentpointcoins/index.js
import connectMongoDB from '@/lib/services/database/mongodb';
import SentPointCoins from '@/database/models/SentPointCoins';
import Point from '@/database/models/Point';
import Coins from '@/database/models/Coins';
import Users from '@/database/models/users';
import sendLineMessage from '@/lib/sendLineMessage';

export default async function handler(req, res) {
  await connectMongoDB();
  
  switch (req.method) {
    case 'GET':
      try {
        const transactions = await SentPointCoins.find({});
        res.status(200).json({ success: true, data: transactions });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'POST':
      try {
        const { userId, empId, point, coins, ref, remark } = req.body;

        const user = await Users.findOne({ empId });

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        const transaction = new SentPointCoins({
          userId,
          trans: empId,
          ref,
          point,
          coins,
          remark
        });

        await transaction.save();

        if (point > 0) {
          const newPoint = new Point({
            userId: user.userId,
            description: `${ref}`,
            type: 'earn',
            contentId: transaction._id,
            path: 'sentpointcoins',
            subpath: 'point',
            point: point,
          });
          await newPoint.save();
          await sendLineMessage(user.userId, `คุณได้รับ point จาก ${ref} จำนวน ${point} Point`);
        }

        if (coins > 0) {
          const newCoins = new Coins({
            userId: user.userId,
            description: `${ref}`,
            referId: transaction._id,
            path: 'sentpointcoins',
            subpath: 'coins',
            type: 'earn',
            coins: coins,
          });
          await newCoins.save();
          await sendLineMessage(user.userId, `คุณได้รับ coins จาก ${ref} จำนวน ${coins} Coins`);
        }

        res.status(201).json({ success: true, data: transaction });
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
