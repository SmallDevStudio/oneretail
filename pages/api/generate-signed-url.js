import { Storage } from '@google-cloud/storage';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, fileType } = req.body;

    // กำหนดข้อมูลของ Google Cloud Storage
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_KEY, 'base64').toString('utf8')),
    });

    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    const file = bucket.file(`posts/${fileName}`);

    // กำหนดเวลาหมดอายุของ Signed URL (15 นาที)
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 นาที
      contentType: fileType,
    });

    return res.status(200).json({ url, fileName });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
