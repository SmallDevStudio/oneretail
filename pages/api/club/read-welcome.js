import connetMongoDB from "@/lib/services/database/mongodb";
import ReadWelcome from "@/database/models/Club/ReadWelcome";

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const readWelcome = await ReadWelcome.find({ userId });
        res.status(200).json({ success: true, data: readWelcome });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const readWelcome = await ReadWelcome.find({ userId });
        if (readWelcome.length > 0) {
          res.status(200).json({ success: true, data: readWelcome });
        } else {
          const readWelcome = await ReadWelcome.create(req.body);
          res.status(201).json({ success: true, data: readWelcome });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
