import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";


export default async function handler(req, res) {
    await connetMongoDB();

    try {
        const { userId, description, path, subpath, type, points, contentId } = req.body;
  
        if (!userId || !description || !type || points === undefined) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
        }
  
        // เพิ่มข้อมูลใน collection "point"
        const pointEntry = new Point({
          userId,
          description,
          contentId,
          path,
          subpath,
          type,
          point: points,
        });
        await pointEntry.save();

        if (type === 'earn') {
            // ส่งข้อความไปที่ LINE
          const message = `คุณได้รับ ${points} คะแนน จาก ${description} `;
          sendLineMessage(userId, message);
        }
  
        res.status(201).json({ success: true, data: pointEntry });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
}