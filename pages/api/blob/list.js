import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // เรียก listBlobs เพื่อดึงรายการไฟล์ใน Blob
      const blobs = await list();
      
      // ส่งผลลัพธ์เป็น JSON กลับไปยัง client
      res.status(200).json(blobs);
    } catch (error) {
      console.error('Error fetching blobs:', error);
      res.status(500).json({ error: 'Error fetching blobs' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
