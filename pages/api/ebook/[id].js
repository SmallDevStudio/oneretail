import connetMongoDB from "@/lib/services/database/mongodb";
import Ebooks from "@/database/models/Ebooks/Ebooks";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const ebook = await Ebooks.findById(id);
        res.status(200).json({ success: true, data: ebook });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { ...data } = req.body;
        const ebook = await Ebooks.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, data: ebook });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const ebook = await Ebooks.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: ebook });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
