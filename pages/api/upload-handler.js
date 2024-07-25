import connectMongoDB from '@/lib/services/database/mongodb';
import Media from '@/database/models/Media';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  await connectMongoDB();

  try {
    const { files, name, userId } = req.body;
    console.log('file', files, 'name', name, 'userId', userId);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

    const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, data);
    const fileData = response.data;

    const fileType = fileData.resource_type === 'image' ? 'image' : 'file';

    const media = await Media.create({
      url: fileData.secure_url,
      publicId: fileData.public_id,
      name,
      userId,
      type: fileType,
      path: 'article',
      isTemplate: false,
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}