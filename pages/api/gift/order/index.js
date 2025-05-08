import connetMongoDB from "@/lib/services/database/mongodb";
import OrderGifts from "@/database/models/Gifts/OrderGifts";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const orders = await OrderGifts.find({});
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const order = await OrderGifts.create(req.body);
        res.status(201).json(order);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
