import connetMongoDB from "@/lib/services/database/mongodb";
import OrderGifts from "@/database/models/Gifts/OrderGifts";
import OrderGiftLogs from "@/database/models/Gifts/OrderGiftLogs";
import NotApprove from "@/database/models/Gifts/NotApprove";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "POST":
      try {
        const { branchId, orderId, userId, approverId, reason } = req.body;

        console.log({
          branchId,
          orderId,
          userId,
          approverId,
          reason,
        });

        const notApprove = await NotApprove.create({
          branchId,
          orderId,
          userId,
          approverId,
          reason,
        });

        // line message
        const message = {
          type: "flex",
          altText: "แจ้งเตือนการไม่อนุมัติ",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "การสั่งของท่านไม่ได้รับการอนุมัติ",
                  weight: "bold",
                  size: "md",
                  color: "#FF0000",
                },
                {
                  type: "text",
                  text: `เหตุผล: ${reason}`,
                  wrap: true,
                  margin: "md",
                },
                {
                  type: "button",
                  style: "primary",
                  color: "#1E90FF",
                  action: {
                    type: "uri",
                    label: "ดูรายละเอียด",
                    uri: `${process.env.NEXT_PUBLIC_BASE_URL}/gifts`,
                  },
                  margin: "lg",
                },
              ],
            },
          },
        };

        await sendLineMessage(userId, message);

        res.status(200).json({ success: true, data: notApprove });
      } catch (error) {
        console.error("API error:", error);
        res
          .status(400)
          .json({ success: false, message: "Error saving notApprove" });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
