import connetMongoDB from "@/lib/services/database/mongodb";
import BudgetGifts from "@/database/models/Gifts/BudgetGifts";
import OrderGifts from "@/database/models/Gifts/OrderGifts";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const budgets = await BudgetGifts.find({});
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
            orderId: order?._id,
            userId: order?.userId,
            info: order?.info || {},
            usedBudget,
            order_createdAt: order?.createdAt,
            remainingBudget: (obj.budget || 0) - usedBudget,
          };
        });

        res.status(200).json({ success: true, data: enrichedBudgets });
      } catch (error) {
        console.error("API error:", error);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const budget = await BudgetGifts.create(req.body);
        res.status(201).json(budget);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
