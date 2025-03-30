import connetMongoDB from "@/lib/services/database/mongodb";
import Coupons from "@/database/models/Coupons/Coupons";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const coupon = await Coupons.findOne({
          code: req.query.code,
        });
        res.status(200).json({ success: true, data: coupon });
      } catch (error) {
        res.status(400).json({ success: false });
      }
    case "PUT":
      try {
        const { updated_by, ...rest } = req.body;
        const code = req.query.code;

        const coupon = await Coupons.findOneAndUpdate(
          { code: code },
          {
            $set: rest,
            $push: { updated_by: updated_by }, // 📌 เพิ่ม userId ไปใน updated_by
          },
          { new: true }
        );

        res.status(200).json({ success: true, data: coupon });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const coupon = await Coupons.findOneAndDelete({
          code: req.query.code,
        });
        res.status(200).json({ success: true, data: coupon });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
