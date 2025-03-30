import connetMongoDB from "@/lib/services/database/mongodb";
import Coupons from "@/database/models/Coupons/Coupons";
import UsedCoupon from "@/database/models/Coupons/UsedCoupon";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const coupons = await Coupons.find();
        const codes = coupons.map((coupon) => coupon.code);

        // ดึงข้อมูล UsedCoupon ที่ใช้ไปแล้ว
        const usedCoupons = await UsedCoupon.find({
          code: { $in: codes },
          isUsed: true,
        });

        // สร้าง Map เพื่อนับจำนวน used ตาม code
        const usedMap = usedCoupons.reduce((acc, used) => {
          acc[used.code] = acc[used.code] || [];
          acc[used.code].push(used);
          return acc;
        }, {});

        // รวมข้อมูล UsedCoupon เข้าไปใน Coupons
        const couponsWithUsed = coupons.map((coupon) => {
          const usedList = usedMap[coupon.code] || []; // ถ้าไม่มี UsedCoupon จะเป็น []
          return {
            ...coupon.toObject(),
            used: usedList, // รายการ UsedCoupon
            amount: coupon.stock - usedList.length, // คำนวณ stock คงเหลือ
          };
        });

        res.status(200).json({ success: true, data: couponsWithUsed });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const coupon = await Coupons.create(req.body);
        res.status(201).json(coupon);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
