import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Redeem from "@/database/models/Redeem";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Assuming you pass the ID in the query
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const redeemTrans = await RedeemTrans.find({}).populate('redeemId');
        const redeemTransWithUser = await Promise.all(
          redeemTrans.map(async (trans, index) => {
            const user = await Users.findOne({ userId: trans.userId });
            return {
              ...trans._doc,
              user,
              seq: index + 1,
            };
          })
        );
        res.status(200).json({ success: true, data: redeemTransWithUser });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { status } = req.body;
        const updatedTrans = await RedeemTrans.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: updatedTrans });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'POST':
      try {
        const { redeemId, userId } = req.body;
        const redeem = await Redeem.findById(redeemId);

        if (!redeem) {
          return res.status(404).json({ success: false, message: 'Redeem not found' });
        }

        const pointTransactions = await Point.find({ userId });
        const userPoints = pointTransactions.reduce((acc, pt) => acc + (pt.type === 'earn' ? pt.point : -pt.point), 0);

        const coinTransactions = await Coins.find({ userId });
        const userCoins = coinTransactions.reduce((acc, ct) => acc + (ct.type === 'earn' ? ct.coins : -ct.coins), 0);

        if (userPoints < redeem.point || userCoins < redeem.coins) {
          return res.status(400).json({ success: false, message: 'Insufficient points or coins' });
        }

        const redeemTrans = new RedeemTrans({
          redeemId,
          userId,
          coins: redeem.coins,
          point: redeem.point,
          amount: 1,
          status: 'pending',
        });
        await redeemTrans.save();

        if (redeem.point > 0) {
          const point = new Point({
            userId,
            type: 'pay',
            point: redeem.point,
            description: `Redeem ${redeem.name}`,
            contentId: redeem._id,
          });
          await point.save();
        }

        if (redeem.coins > 0) {
          const coins = new Coins({
            userId,
            type: 'pay',
            coins: redeem.coins,
            description: `Redeem ${redeem.name}`,
          });
          await coins.save();
        }

        redeem.stock -= 1;
        await redeem.save();

        res.status(201).json({ success: true, data: redeemTrans });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
