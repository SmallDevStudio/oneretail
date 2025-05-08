import connetMongoDB from "@/lib/services/database/mongodb";
import OrderGifts from "@/database/models/Gifts/OrderGifts";
import OrderGiftLogs from "@/database/models/Gifts/OrderGiftLogs";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const order = await OrderGifts.findById(id);
        res.status(200).json({ success: true, data: order });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      const newData = req.body;

      // ดึงข้อมูลเดิมก่อนอัปเดต
      const existingOrder = await OrderGifts.findById(id).lean();

      if (!existingOrder) return res.status(404).json({ error: "Not found" });

      const updated = await OrderGifts.findByIdAndUpdate(
        id,
        {
          ...newData,
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
        orderId: id,
        userId: newData.userId,
        action: "update",
        changedFields,
        before: existingOrder,
        after: newData,
      });

      res.status(200).json(updated);
      break;

    case "DELETE":
      try {
        const order = await OrderGifts.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: order });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
