import formidable from 'formidable';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath);

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อให้ formidable จัดการเอง
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form' });
      }

      const file = files.file[0];
      const outputFilename = `converted_${path.parse(file.originalFilename).name}.mp4`;
      const outputPath = path.join('/tmp', outputFilename); // Path สำหรับ output

      // ตรวจสอบและสร้างโฟลเดอร์ /tmp หากไม่มี
      if (!fs.existsSync('/tmp')) {
        fs.mkdirSync('/tmp');
      }

      console.log('Filepath:', file.filepath); // ตรวจสอบ path ของไฟล์ที่กำลังแปลง
      console.log('Output path:', outputPath); // ตรวจสอบ output path

      ffmpeg(file.filepath)
        .output(outputPath)
        .on('end', () => {
          try {
            if (fs.existsSync(outputPath)) {
              const fileBuffer = fs.readFileSync(outputPath);
              res.setHeader('Content-Type', 'video/mp4');
              return res.status(200).send(fileBuffer); // ส่งไฟล์ที่แปลงแล้วกลับไปยัง client
            } else {
              console.error('Error: Output file does not exist');
              return res.status(500).json({ error: 'Output file does not exist' });
            }
          } catch (readErr) {
            console.error('Error reading output file:', readErr);
            return res.status(500).json({ error: 'Error reading output file' });
          }
        })
        .on('error', (err) => {
          console.error('Error during conversion:', err);
          return res.status(500).json({ error: 'Error during conversion' });
        })
        .run();
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
