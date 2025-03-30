import connetMongoDB from "@/lib/services/database/mongodb";
import Coupons from "@/database/models/Coupons/Coupons";
import UsedCoupon from "@/database/models/Coupons/UsedCoupon";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "POST":
      try {
        const { userId, code } = req.body;

        // ตรวจสอบว่ามี coupon หรือไม่ และต้องเป็น active
        const coupon = await Coupons.findOne({ code, active: true });
        if (!coupon) {
          return res
            .status(400)
            .json({ success: false, message: "Coupon not found or inactive" });
        }

        const now = new Date();
        if (now < coupon.start_date || now > coupon.end_date) {
          return res.status(400).json({
            success: false,
            message: "คูปองหมดอายุแล้ว",
          });
        }

        // ดึงข้อมูล usedcoupon ของคูปองนี้
        const usedCoupons = await UsedCoupon.find({ code, isUsed: true });

        // คำนวณจำนวนที่เหลือ
        const amountLeft = coupon.stock - usedCoupons.length;
        if (amountLeft <= 0) {
          return res
            .status(400)
            .json({ success: false, message: "คูปองหมดแล้ว" });
        }

        // ตรวจสอบว่าผู้ใช้เคยใช้คูปองนี้ไปแล้วหรือไม่
        if (coupon.repeatable === false) {
          const alreadyUsed = await UsedCoupon.findOne({
            userId,
            code,
            isUsed: true,
          });
          if (alreadyUsed) {
            return res.status(400).json({
              success: false,
              message: "คุณได้ใช้คูปองนี้แล้ว",
            });
          }
        }

        // บันทึก UsedCoupon ใหม่
        const newUsedCoupon = await UsedCoupon.create({
          userId,
          code,
          isUsed: true,
        });

        if (coupon.point > 0) {
          const pointEntry = new Point({
            userId,
            description: `Claimed coupon: ${coupon.code}`,
            contentId: newUsedCoupon._id,
            path: "coupons",
            type: "earn",
            point: coupon.point,
          });
          await pointEntry.save();

          // ส่งข้อความ + รูปภาพไป LINE
          const message = `คุณได้รับ ${coupon.point} คะแนน จากการใช้คูปอง 🎉`;
          sendLineMessage(userId, message);
        }

        if (coupon.coin > 0) {
          const coinsEntry = new Coins({
            userId,
            description: `Claimed coupon: ${coupon.code}`,
            contentId: newUsedCoupon._id,
            path: "coupons",
            type: "earn",
            coins: coupon.coins,
          });
          await coinsEntry.save();

          // ส่งข้อความ + รูปภาพไป LINE
          const message = `คุณได้รับ ${coupon.coins} coins จากการใช้คูปอง 🎉`;
          sendLineMessage(userId, message);
        }

        res.status(201).json({
          success: true,
          message: "Coupon claimed successfully",
          data: newUsedCoupon,
          point: coupon.point,
          coin: coupon.coin,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
