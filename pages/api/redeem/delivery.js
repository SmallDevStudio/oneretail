import connectMongoDB from "@/lib/services/database/mongodb";
import Delivery from "@/database/models/Delivery";
import RedeemTrans from "@/database/models/RedeemTrans";
import Notification from "@/database/models/Notification";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  await connectMongoDB();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { redeemTransId, userId, creator } = req.body;

        const delivery = new Delivery({
          redeemTransId,
          userId,
          creator,
        });

        await delivery.save();

        const updatedTrans = await RedeemTrans.findById(redeemTransId);
        updatedTrans.status = 'delivered';

        await updatedTrans.save();

        const notification = new Notification({
          userId,
          senderId: 'Uc83ed0637f0910565ad3b0ad44c5d49b',
          description: 'ของรางวัลได้จัดส่งแล้ว',
          referId: redeemTransId,
          path: 'redeem',
          subpath: 'delivered',
          url: '/redeem',
          type: 'delivered',
        });
        await notification.save();

        sendLineMessage(userId, `ของรางวัลได้จัดส่งแล้ว!`);
        
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
