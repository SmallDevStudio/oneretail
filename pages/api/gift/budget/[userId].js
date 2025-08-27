import connetMongoDB from "@/lib/services/database/mongodb";
import BudgetGifts from "@/database/models/Gifts/BudgetGifts";
import OrderGifts from "@/database/models/Gifts/OrderGifts";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        // ✅ ดึง user มาก่อน
        const user = await Users.findOne({ userId });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        // ✅ ถ้า role เป็น admin ดึงทั้งหมด, ถ้าไม่ใช่ admin ดึงเฉพาะ empId ของ user
        const budgets =
          user.role === "admin"
            ? await BudgetGifts.find({})
            : await BudgetGifts.find({ user1: user.empId });

        const branchIds = budgets.map((b) => b._id.toString());

        // ดึง order ที่ branchId match กับ budget._id
        const orders = await OrderGifts.find({
          branchId: { $in: branchIds },
        });

        // map ตาม branchId
        const ordersMap = {};
        orders.forEach((order) => {
          ordersMap[order.branchId.toString()] = order;
        });

        const enrichedBudgets = budgets.map((b) => {
          const obj = b.toObject();

          const order = ordersMap[b._id.toString()] || null;

          // รวม budget ที่ใช้ไปจาก order.gifts
          let usedBudget = 0;
          if (order?.gifts?.length) {
            usedBudget = order.gifts.reduce(
              (sum, g) => sum + (g.total || 0),
              0
            );
          }

          return {
            ...obj,
            status: order?.status || "order",
            gifts: order?.gifts || [],
            branchId: order?.branchId,
            userId: order?.userId,
            usedBudget,
            remainingBudget: (obj.budget || 0) - usedBudget,
          };
        });

        res.status(200).json({ success: true, data: enrichedBudgets });
      } catch (error) {
        console.error("API error:", error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const budget = await BudgetGifts.create(req.body);
        res.status(201).json(budget);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
