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

        const orders = await OrderGifts.find({
          branchId: { $in: branchIds },
        });

        const ordersMap = {};
        orders.forEach((order) => {
          ordersMap[order.branchId.toString()] = order.status;
        });

        const enrichedBudgets = budgets.map((b) => ({
          ...b.toObject(),
          status: ordersMap[b._id.toString()] || "order",
        }));

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
