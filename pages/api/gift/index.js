import connetMongoDB from "@/lib/services/database/mongodb";
import Gifts from "@/database/models/Gifts/Gifts";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();
  switch (method) {
    case "GET":
      try {
        const gifts = await Gifts.find();
        res.status(200).json({ success: true, data: gifts });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const gift = await Gifts.create(req.body);
        res.status(201).json(gift);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
