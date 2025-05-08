import connetMongoDB from "@/lib/services/database/mongodb";
import Gifts from "@/database/models/Gifts/Gifts";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const gifts = await Gifts.findOne({ _id: id });
        res.status(200).json({ success: true, data: gifts });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { ...data } = req.body;
        const gift = await Gifts.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, data: gift });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const gift = await Gifts.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: gift });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
