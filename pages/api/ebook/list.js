import connetMongoDB from "@/lib/services/database/mongodb";
import Ebooks from "@/database/models/Ebooks/Ebooks";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const ebooks = await Ebooks.find({ active: true });
        res.status(200).json({ success: true, data: ebooks });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
