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
  const { method, query } = req;
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const { redeemCode } = query; // รับ redeemCode จาก query string

        if (!redeemCode) {
          return res.status(400).json({ success: false, message: "Missing redeemCode" });
        }

        // ดึง RedeemTrans ตาม redeemCode
        const redeemTrans = await RedeemTrans.find({ "redeemId.rewardCode": redeemCode })
          .populate("redeemId")
          .sort({ createdAt: -1 });

        // ดึงข้อมูล User และ Emp เชื่อมโยงข้อมูลเพิ่มเติม
        const redeemTransWithDetails = await Promise.all(
          redeemTrans.map(async (trans, index) => {
            const user = await Users.findOne({ userId: trans.userId });

            if (!user) {
              return null; // ข้ามหาก user ไม่มีข้อมูล
            }

            console.log(user);

            const emp = await Emp.findOne({ empId: user.empId });

            return {
              redeemDetails: {
                rewardCode: trans.redeemId.rewardCode,
                rewardName: trans.redeemId.name,
                createdAt: trans.createdAt,
              },
              userDetails: {
                empId: user.empId,
                fullname: user.fullname,
                address: user.address,
              },
              empDetails: emp
                ? {
                    teamGroup: emp.teamGrop,
                    position: emp.position,
                  }
                : null,
            };
          })
        );

        // ลบรายการที่เป็น null
        const validTrans = redeemTransWithDetails.filter((item) => item !== null);

        res.status(200).json({ success: true, data: validTrans });
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
