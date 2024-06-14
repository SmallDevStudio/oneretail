import connectMongoDB from '@/lib/services/database/mongodb';
import QRCodeTransaction from '@/database/models/QRCodeTransaction';
import Point from '@/database/models/Point';
import Coins from '@/database/models/Coins';

export default async function handler(req, res) {
  await connectMongoDB();

  switch (req.method) {
    case 'POST':
      try {
        const { userId, point, coins, ref, remark } = req.body;

        const transaction = new QRCodeTransaction({
          userId,
          point,
          coins,
          ref,
          remark,
        });

        await transaction.save();
        res.status(201).json({ success: true, data: transaction });
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { transactionId, userId } = req.body;

        const transaction = await QRCodeTransaction.findById(transactionId);
        if (!transaction) {
          return res.status(404).json({ success: false, message: 'QR Code not found' });
        }

        if (transaction.scannedBy.includes(userId)) {
          return res.status(400).json({ success: false, message: 'QR Code already scanned by this user' });
        }

        transaction.scannedBy.push(userId);
        transaction.scannedAt.push(new Date());
        await transaction.save();

        if (transaction.point > 0) {
          const newPoint = new Point({
            userId,
            description: `Received points from QR Code ${transaction.ref}`,
            type: 'earn',
            point: transaction.point,
          });
          await newPoint.save();
        }

        if (transaction.coins > 0) {
          const newCoins = new Coins({
            userId,
            description: `Received coins from QR Code ${transaction.ref}`,
            type: 'earn',
            coins: transaction.coins,
          });
          await newCoins.save();
        }

        res.status(200).json({ success: true, data: transaction });
      } catch (error) {
        console.error('PUT Error:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}