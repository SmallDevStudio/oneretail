import connetMongoDB from "@/lib/services/database/mongodb";
import UseEbook from "@/database/models/Ebooks/UseEbook";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "POST":
      try {
        const useebook = await UseEbook.create(req.body);
        res.status(201).json({ success: true, data: useebook });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
