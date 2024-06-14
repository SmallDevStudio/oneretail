import connectMongoDB from '@/lib/services/database/mongodb';
import Coins from '@/database/models/Coins';

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'POST':
      try {
        const coins = new Coins(req.body);
        await coins.save();
        res.status(201).json({ success: true, data: coins });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}