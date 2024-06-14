import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Redeem from "@/database/models/Redeem";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const redeemTrans = await RedeemTrans.find({userId: userId}).populate('redeemId');
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

        // Check user's points and coins
        const userPoints = await Point.findOne({ userId });
        const userCoins = await Coins.findOne({ userId });

        if (userPoints.point < redeem.point || userCoins.coins < redeem.coins) {
          return res.status(400).json({ success: false, message: 'Insufficient points or coins' });
        }

        // Create RedeemTrans
        const redeemTrans = new RedeemTrans({
          redeemId,
          userId,
          coins: redeem.coins,
          point: redeem.point,
          amount: 1,
        });
        await redeemTrans.save();

        // Update user's points and coins
        userPoints.point -= redeem.point;
        await userPoints.save();

        userCoins.coins -= redeem.coins;
        await userCoins.save();

        // Update Redeem stock
        redeem.stock -= 1;
        await redeem.save();

        res.status(201).json({ success: true, data: redeemTrans });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
