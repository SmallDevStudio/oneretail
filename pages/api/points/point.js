import connectMongoDB from '@/lib/services/database/mongodb';
import Point from '@/database/models/Point';

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'POST':
      try {
        const point = new Point(req.body);
        await point.save();
        res.status(201).json({ success: true, data: point });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}