import connectMongoDB from "@/lib/services/database/mongodb";
import RedeemTrans from "@/database/models/RedeemTrans";
import Notification from "@/database/models/Notification";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "POST":
            try {
                const { redeemTransId, userId, creator, status } = req.body;
                let TransData;
                let message = "";

                const Trans = await RedeemTrans.findById(redeemTransId);

                if (!Trans) {
                    throw new Error("ไม่พบข้อมูล");
                }

                Trans.status = status;
                Trans.creator = creator;
                await Trans.save();

                TransData = Trans;

                if (status === "delivery") {
                    message = "ของรางวัลได้กำลังจัดส่ง";
                } else if (status === "done") {
                    message = "ของรางวัลได้จัดส่งแล้ว";
                } else {
                    message = "กำลังจัดเตียมของรางวัล";
                }

                const notification = new Notification({
                    userId,
                    senderId: "Uc83ed0637f0910565ad3b0ad44c5d49b",
                    description: message,
                    referId: redeemTransId,
                    path: "redeem",
                    subpath: status,
                    url: "/redeem",
                    type: "info",
                });
                await notification.save();
                sendLineMessage(userId, message);
                res.status(201).json({ success: true, data: TransData });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}