import nextConnect from 'next-connect';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '@/utils/cloudinary';

const upload = multer();

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Upload error:', error); // เพิ่มการ log ข้อผิดพลาด
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('image'));

apiRoute.post((req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const stream = cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ filePath: result.secure_url });
  });

  streamifier.createReadStream(file.buffer).pipe(stream);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อให้ multer ทำงานได้
  },
};