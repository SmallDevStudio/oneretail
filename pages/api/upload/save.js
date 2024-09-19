import connectMongoDB from '@/lib/services/database/mongodb';
import Library from '@/database/models/Library';
import { Storage } from '@google-cloud/storage';

const googleCloudKey = JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_KEY, 'base64').toString('utf8'));

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: googleCloudKey,
  });
  
  const bucket = storage.bucket('oneretail-35482.appspot.com');

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB(); // เชื่อมต่อ MongoDB

    switch (method) {
        case 'POST': {
            const { public_id, file_name, file_size, file_type, mime_type, folder, userId, url, type } = req.body;

            try {
                const fileReference = bucket.file(file_name);
        
                // ตรวจสอบว่าไฟล์ถูกอัปโหลดสำเร็จหรือไม่
                const [fileExists] = await fileReference.exists();
        
                if (fileExists) {
                  await fileReference.makePublic();
                }

                // บันทึกข้อมูลไฟล์ลงในฐานข้อมูล
            const newLibraryEntry = new Library({
                public_id,
                file_name,
                file_size,
                file_type,
                mime_type,
                folder,
                userId,
                url,
                type,
            });

            await newLibraryEntry.save();
            } catch (error) {
                console.error('Error uploading file:', error);
            }

            return res.status(200).json({ success: true, publicUrl: url });
        }

        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}