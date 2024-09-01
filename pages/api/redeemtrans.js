import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Redeem from "@/database/models/Redeem";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";
import Notification from "@/database/models/Notification";

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const redeemTrans = await RedeemTrans.find({userId: userId}).populate('redeemId').sort({ createdAt: -1 });
        const redeemTransWithUser = await Promise.all(
          redeemTrans.map(async (trans) => {
            const user = await Users.findOne({ userId: trans.userId });
            return {
              ...trans._doc,
              user: user ? user.pictureUrl : null, // Assuming user image is stored in the `image` field
            };
          })
        );
        res.status(200).json({ success: true, data: redeemTransWithUser });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'POST':
      try {
        const { redeemId, userId } = req.body;
        const redeem = await Redeem.findById(redeemId);

        if (!redeem) {
          return res.status(404).json({ success: false, message: 'Redeem not found' });
        }

        if (redeem.coins !== 0 || redeem.coins !== null) {
          const coinsPayData = await Coins.create({
            userId,
            description: `Redeem - ${redeemId}`,
            referId: redeemId,
            type: 'pay',
            coins: redeem.coins,
          });
        }

        if (redeem.point !== 0 || redeem.point !== null) {
          const pointPayData = await Point.create({
            userId,
            description: `Redeem - ${redeemId}`,
            referId: redeemId,
            type: 'pay',
            point: redeem.point,
          });
        }

        const newRedeemTrans = {
          redeemId,
          userId,
          status: 'pending',
        };

        const redeemTrans = await RedeemTrans.create(newRedeemTrans);

        const redeemUpdate = await Redeem.findOneAndUpdate(
          { _id: redeemId },
          { $inc: { stock: -1 } },
          { new: true }
        );

        const users = await Users.find({ role: 'admin' });
        const notifyData = users.map(user => ({
          userId: user.userId,
          senderId: userId,
          description: 'แลกของรางวัล Redeem',
          referId: redeemTrans._id,
          path: 'redeem',
          subpath: 'transactions',
          url: `${process.env.NEXTAUTH_URL}admin/redeem`,
          type: 'redeem',
        }));
        await Notification.insertMany(notifyData);


        res.status(201).json({ success: true, data: redeemTrans, redeem: redeemUpdate });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
