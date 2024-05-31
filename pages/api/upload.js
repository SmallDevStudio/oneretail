import fs from "fs";
import path from "path";
import connectMongoDB from "@/lib/services/database/mongodb";
import Image from "@/database/models/Image";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const file = req.files.image;
    const filename = Date.now() + path.extname(file.name);
    const filepath = path.join(process.cwd(), "public", "images", filename);

    try {
      await fs.promises.writeFile(filepath, file.data);

      // บันทึกข้อมูลลง MongoDB
      const newImage = new Image({
        name: filename,
        url: `/images/${filename}`,
      });
      await newImage.save();

      res.status(200).json({
        message: 'File uploaded and saved to database successfully!',
        name: filename,
        url: `/images/${filename}`,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file', error });
    }
  } else {
    res.status(400).json({ message: 'Invalid request' });
  }
}