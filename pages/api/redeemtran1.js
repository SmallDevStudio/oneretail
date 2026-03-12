import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Redeem from "@/database/models/Redeem";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const redeemTrans = await RedeemTrans.find({})
          .populate("redeemId")
          .sort({ createdAt: -1 })
          .lean();

        const redeemTransWithUser = await Promise.all(
          redeemTrans.map(async (trans, index) => {
            const user = await Users.findOne({ userId: trans.userId }).lean();

            const emp = user
              ? await Emp.findOne({ empId: user.empId }).lean()
              : null;

            return {
              ...trans,

              redeemItem: trans.redeemId?.name || "N/A", // ✅ แก้ตรงนี้

              user: user || null,
              emp: emp || null,
              seq: index + 1,
            };
          }),
        );

        res.status(200).json({ success: true, data: redeemTransWithUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
