import connectMongoDB from '@/lib/services/database/mongodb';
import Library from '@/database/models/Library';
import { Storage } from '@google-cloud/storage';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { nanoid } from 'nanoid'; // ใช้ nanoid เพื่อสร้าง public_id

const googleCloudKey = JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_KEY, 'base64').toString('utf8'));

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: googleCloudKey,
});

const bucket = storage.bucket('oneretail-35482.appspot.com');

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อให้ formidable จัดการเอง
  },
};

const uploadToGCS = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const fileUpload = bucket.file(fileName);
    
    // ตรวจสอบ filepath ก่อนที่จะสร้าง stream
    if (!file.filepath) {
      return reject(new Error('Filepath is undefined'));
    }

    const stream = fileUpload.createWriteStream({
      resumable: false,
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', async () => {
      await fileUpload.makePublic(); // ทำให้ไฟล์เป็น public
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    fs.createReadStream(file.filepath).pipe(stream); // ใช้ filepath ที่ถูกต้องในการสร้าง stream
  });
};

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB(); // เชื่อมต่อ MongoDB

  switch (method) {
    case 'POST': {
      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return res.status(500).json({ error: 'Error parsing form data' });
        }

        const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
        const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;

        if (!files.file || !Array.isArray(files.file)) {
          return res.status(400).json({ error: 'No files or incorrect format' });
        }

        const uploadedUrls = [];

        try {
          for (const file of files.file) {
            // สร้าง public_id ที่ไม่ซ้ำโดยใช้ nanoid
            const public_id = nanoid(10); // กำหนดขนาดของรหัสเป็น 10 ตัวอักษร

            // ตรวจสอบว่าการสร้าง public_id ทำงานถูกต้อง
            if (!public_id) {
              return res.status(400).json({ error: 'Failed to generate public_id' });
            }

            const fileName = folder? `${folder}/${public_id}-${file.originalFilename}` : `${public_id}-${file.originalFilename}`;
            const publicUrl = await uploadToGCS(file, fileName);

            // กำหนด file type ตาม mime type
            let fileType = 'file'; // default เป็นไฟล์ธรรมดา
            if (file.mimetype.startsWith('image')) {
              fileType = 'image';
            } else if (file.mimetype.startsWith('video')) {
              fileType = 'video';
            }

            // Save metadata and public URL to MongoDB
            const newLibraryEntry = new Library({
              public_id, // ใช้ public_id ที่ถูกสร้างด้วย nanoid
              file_name: file.originalFilename,
              file_size: file.size,
              file_type: fileType, // กำหนด type ตามไฟล์ (image, video, file)
              mime_type: file.mimetype,
              folder, // กำหนด folder จากค่า string
              userId, // กำหนด userId จากค่า string
              type: fileType, // กำหนด type สำหรับ MongoDB
              url: publicUrl, // บันทึก public URL ที่ได้จาก Google Cloud Storage
            });

            await newLibraryEntry.save();

            // Add the uploaded file information to response array
            uploadedUrls.push({
              public_id,
              url: publicUrl,
              type: fileType,
            });
          }

          // ส่งข้อมูลกลับในรูปแบบ array [{ public_id, url, type }]
          return res.status(200).json(uploadedUrls);
        } catch (error) {
          console.error('Error during upload process:', error);
          return res.status(500).json({ error: error.message });
        }
      });

      break;
    }


    case 'DELETE': {
      const { publicId, url } = req.query;

      if (!publicId) {
        return res.status(400).json({ error: 'Please provide a file publicId' });
      }

      try {
        // ใช้ URL constructor เพื่อแยก path ของไฟล์จาก URL และตัด query parameters หรือข้อมูลส่วนเกินออก
        const filePath = decodeURIComponent(new URL(url).pathname).replace('/oneretail-35482.appspot.com/', '');
    
        if (!filePath) {
          return res.status(400).json({ error: 'Invalid file URL' });
        }
    
        // ลบไฟล์จาก Google Cloud Storage
        await bucket.file(filePath).delete();
    
        // ลบไฟล์จากฐานข้อมูล
        await Library.findOneAndDelete({ public_id: publicId });
    
        return res.status(200).json({ message: 'File deleted successfully' });
      } catch (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
