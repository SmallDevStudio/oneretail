import connectMongoDB from '@/lib/services/database/mongodb';
import Point from '@/database/models/Point';
import Users from '@/database/models/users';

export default async function handler(req, res) {
  await connectMongoDB();
  
  if (req.method === 'POST') {
    const { empId, point, ref } = req.body;

    try {
      const user = await Users.findOne({ empId });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const newPoint = new Point({
        userId: user.userId,
        description: `รับ point และ coins จาก ${ref}`,
        type: 'earn',
        point: point
      });

      await newPoint.save();
      return res.status(200).json({ success: true, data: newPoint });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}