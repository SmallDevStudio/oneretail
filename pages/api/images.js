import connetMongoDB from "@/lib/services/database/mongodb";
import Image from "@/database/models/Image";

export default async function handler(req, res) {
    const { method } = req;
  
    await connetMongoDB();
  
    switch (method) {
      case 'GET':
        try {
          const images = await Image.find({});
          res.status(200).json({ success: true, data: images });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case 'POST':
        try {
          const image = await Image.create(req.body);
          res.status(201).json({ success: true, data: image });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case 'PUT':
        try {
          const image = await Image.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!image) {
            return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, data: image });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case 'DELETE':
        try {
          const deletedImage = await Image.deleteOne({ _id: req.body.id });
          if (!deletedImage) {
            return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, data: {} });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      default:
        res.status(400).json({ success: false });
        break;
    }
  }