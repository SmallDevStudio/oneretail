import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const redeemTrans = await RedeemTrans.find({})
          .populate('redeemId')
          .sort({ createdAt: -1 });

        const redeemTransWithUser = await Promise.all(
          redeemTrans.map(async (trans, index) => {
            const user = await Users.findOne({ userId: trans.userId });
            const emp = await Emp.findOne({ empId: user.empId });
            return {
              ...trans._doc,
              user,
              emp,
              seq: index + 1,
            };
          })
        );
        res.status(200).json({ success: true, data: redeemTransWithUser });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
};