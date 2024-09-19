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

        const uploadedFiles = [];

        try {
          for (const file of files.file) {
            const public_id = nanoid(10); // สร้าง public_id
            const fileName = folder ? `${folder}/${public_id}-${file.originalFilename}` : `${public_id}-${file.originalFilename}`;

            // สร้าง Signed URL สำหรับการอัปโหลด
            const [uploadUrl] = await bucket.file(fileName).getSignedUrl({
              version: 'v4',
              action: 'write',
              expires: Date.now() + 15 * 60 * 1000, // 15 นาที
              contentType: file.mimetype,
            });

            const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

            // ส่ง Signed URL กลับไปยัง client เพื่อให้ client ทำการอัปโหลดไฟล์โดยตรง
            uploadedFiles.push({
              public_id,
              uploadUrl, // ใช้ URL สำหรับการอัปโหลดจาก client
              file_name: fileName,
              type: file.mimetype.startsWith('image') ? 'image' : 'video',
              url,
            });
          }

          return res.status(200).json(uploadedFiles);
        } catch (error) {
          console.error('Error during upload process:', error);
          return res.status(500).json({ error: error.message });
        }
      });
      break;
    }

    case 'PUT': {
      const { file_name } = req.body;
    
      try {
        const fileReference = bucket.file(file_name);
    
        // ตรวจสอบว่าไฟล์ถูกอัปโหลดสำเร็จหรือไม่
        const [fileExists] = await fileReference.exists();
    
        if (fileExists) {
          // ทำให้ไฟล์เป็น public
          await fileReference.makePublic();
          
          // สร้าง public URL ใหม่หลังจากทำให้ไฟล์เป็น public
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file_name}`;
    
          // บันทึกข้อมูลไฟล์ลงในฐานข้อมูล
          const newLibraryEntry = new Library({
            public_id: req.body.public_id,
            file_name: req.body.file_name,
            file_size: req.body.file_size,
            file_type: req.body.file_type,
            mime_type: req.body.mime_type,
            folder: req.body.folder,
            userId: req.body.userId,
            url: publicUrl,
          });
    
          await newLibraryEntry.save();
    
          return res.status(200).json({
            message: 'File uploaded successfully',
            publicUrl,
            public_id: req.body.public_id,
            file_name: req.body.file_name,
            type: req.body.file_type,
          });
        } else {
          return res.status(404).json({ error: 'File not found' });
        }
      } catch (error) {
        console.error('Error finalizing upload:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    
    // การลบไฟล์
    case 'DELETE': {
      const { publicId, url } = req.query;

      if (!publicId) {
        return res.status(400).json({ error: 'Please provide a file publicId' });
      }

      try {
        const filePath = decodeURIComponent(new URL(url).pathname).replace('/oneretail-35482.appspot.com/', '');

        if (!filePath) {
          return res.status(400).json({ error: 'Invalid file URL' });
        }

        await bucket.file(filePath).delete();
        await Library.findOneAndDelete({ public_id: publicId });

        return res.status(200).json({ message: 'File deleted successfully' });
      } catch (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    case 'GET': {
      const libraries = await Library.find({});
      return res.status(200).json(libraries);
    }

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

