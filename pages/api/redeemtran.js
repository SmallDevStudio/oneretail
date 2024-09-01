import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Redeem from "@/database/models/Redeem";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";
import Notification from "@/database/models/Notification";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Assuming you pass the ID in the query
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const redeemTrans = await RedeemTrans.find({}).populate('redeemId').sort({ createdAt: -1 });
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
  
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
