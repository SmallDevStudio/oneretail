import connetMongoDB from "@/lib/services/database/mongodb";
import BudgetGifts from "@/database/models/Gifts/BudgetGifts";
import OrderGifts from "@/database/models/Gifts/OrderGifts";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  const { apporveId } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const user = await Users.findOne({ userId: apporveId });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        // ดึง budgets ตาม role
        const budgets =
          user.role === "admin"
            ? await BudgetGifts.find({})
            : await BudgetGifts.find({ apporveId: user.empId });

        const branchIds = budgets.map((b) => b._id.toString());

        // ดึง orders เฉพาะ approve หรือ pending
        const orders = await OrderGifts.find({
          branchId: { $in: branchIds },
          status: { $in: ["approve", "pending"] },
        });

        // map ตาม branchId
        const ordersMap = {};
        orders.forEach((order) => {
          ordersMap[order.branchId.toString()] = order;
        });

        // enrich budgets
        const enrichedBudgets = budgets
          .map((b) => {
            const obj = b.toObject();

            const order = ordersMap[b._id.toString()] || null;
            if (!order) return null; // ตัดตัวที่ไม่มี order

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
              status: order.status,
              gifts: order.gifts,
              orderId: order._id,
              userId: order.userId,
              usedBudget,
              remainingBudget: (obj.budget || 0) - usedBudget,
            };
          })
          .filter((item) => item !== null); // ลบ null ทิ้ง

        res.status(200).json({ success: true, data: enrichedBudgets });
      } catch (error) {
        console.error("API error:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const budget = await BudgetGifts.create(req.body);
        res.status(201).json(budget);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
