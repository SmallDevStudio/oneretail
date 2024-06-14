import connectMongoDB from '@/lib/services/database/mongodb';
import Exchange from '@/database/models/Exchange';

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'POST':
      try {
        const exchange = new Exchange(req.body);
        await exchange.save();
        res.status(201).json({ success: true, data: exchange });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}