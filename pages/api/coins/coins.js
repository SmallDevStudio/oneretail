import connectMongoDB from '@/lib/services/database/mongodb';
import Coins from '@/database/models/Coins';
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'POST':
      try {
        const { userId, description, type, coins } = req.body;
  
        if (!userId || !description || !type || coins === undefined) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
        }
  
        // เพิ่มข้อมูลใน collection "point"
        const coinsEntry = new Coins({
          userId,
          description,
          type,
          coins: coins,
        });
        await coinsEntry.save();

        // ส่งข้อความไปที่ LINE
        const message = `คุณได้รับ ${coins} Coins จาก ${description}!`;
        sendLineMessage(userId, message);
  
        res.status(201).json({ success: true, data: coinsEntry });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}