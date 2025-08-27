import connetMongoDB from "@/lib/services/database/mongodb";
import OrderGifts from "@/database/models/Gifts/OrderGifts";
import OrderGiftLogs from "@/database/models/Gifts/OrderGiftLogs";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  await connetMongoDB();

  switch (method) {
    case "PUT":
      const { newData } = req.body;
      const { update_by, ...dataWithoutUpdateBy } = newData;

      // ดึงข้อมูลเดิมก่อนอัปเดต
      const existingOrder = await OrderGifts.findByIdAndUpdate(
        id,
        {
          ...dataWithoutUpdateBy,
          $push: {
            update_by: {
              userId: newData.userId,
              update_at: new Date(),
            },
          },
        },
        { new: true }
      );

      // คำนวณ field ที่มีการเปลี่ยนแปลง
      const changedFields = Object.keys(newData).filter((key) => {
        return (
          JSON.stringify(existingOrder[key]) !== JSON.stringify(newData[key])
        );
      });

      // บันทึก log การแก้ไข
      await OrderGiftLogs.create({
        orderId: existingOrder._id,
        userId: newData.userId,
        action: "update",
        changedFields,
        before: existingOrder,
        after: newData,
      });

      // ✅ ถ้าอนุมัติแล้ว → ส่ง LINE
      if (newData.status === "approved") {
        const flexMessage = {
          type: "flex",
          altText: "การสั่งจองได้รับการอนุมัติ",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "คำสั่งจองของคุณได้รับการอนุมัติ 🎉",
                  weight: "bold",
                  size: "md",
                  wrap: true,
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "uri",
                    label: "ดูของขวัญ",
                    uri: `${process.env.NEXT_PUBLIC_BASE_URL}/gifts`,
                  },
                },
              ],
              flex: 0,
            },
          },
        };

        try {
          await sendLineMessage(updated.userId, flexMessage);
          console.log("✅ Sent LINE approved message");
        } catch (err) {
          console.error("❌ Failed to send LINE approved message", err);
        }
      }

      res.status(200).json(updated);
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
