import { Storage } from '@google-cloud/storage';

const googleCloudKey = JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_KEY, 'base64').toString('utf8'));
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: googleCloudKey,
});

const bucket = storage.bucket('oneretail-35482.appspot.com');

export default async function handler(req, res) {
  const { fileName, fileType } = req.body;

  try {
    const file = bucket.file(`posts/${fileName}`);

    // สร้าง Signed URL สำหรับอัปโหลดไฟล์ไปยัง Google Cloud Storage
    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL ใช้ได้ 15 นาที
      contentType: fileType,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/posts/${fileName}`;
    res.status(200).json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('Error creating signed URL:', error);
    res.status(500).json({ error: 'Error creating signed URL' });
  }
}
