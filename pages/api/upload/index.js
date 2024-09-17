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
      try {
        const { fileName, fileType, userId, folder } = req.body;
        
        const public_id = nanoid(10);
        const filePath = folder
          ? `${folder}/${public_id}-${fileName}`
          : `${public_id}-${fileName}`;
  
        // Create a signed URL for the file upload
        const [uploadUrl] = await bucket.file(filePath).getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          contentType: fileType,
        });
  
        // Save metadata to MongoDB (without waiting for the upload to complete)
        const newLibraryEntry = new Library({
          public_id,
          file_name: fileName,
          file_size: 0, // We'll update this later after the file is uploaded
          file_type: fileType.startsWith('image') ? 'image' : fileType.startsWith('video') ? 'video' : 'file',
          mime_type: fileType,
          folder,
          userId,
          type: fileType.startsWith('image') ? 'image' : fileType.startsWith('video') ? 'video' : 'file',
          url: `https://storage.googleapis.com/${bucket.name}/${filePath}`, // Store the public URL
        });
  
        await newLibraryEntry.save();
  
        // Send the signed URL back to the frontend
        res.status(200).json({ uploadUrl, public_id, url: newLibraryEntry.url, type: newLibraryEntry.type });
      } catch (error) {
        console.error('Error during signed URL generation:', error);
        res.status(500).json({ error: 'Error generating signed URL' });
      }

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
