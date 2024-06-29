import connectMongoDB from "@/lib/services/database/mongodb";
import Delivery from "@/database/models/Delivery";
import RedeemTrans from "@/database/models/RedeemTrans";

export default async function handler(req, res) {
  await connectMongoDB();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { redeemTransId, userId } = req.body;

        const delivery = new Delivery({
          redeemTransId,
          userId,
        });

        await delivery.save();
        res.status(201).json({ success: true, data: delivery });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
