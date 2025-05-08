import connetMongoDB from "@/lib/services/database/mongodb";
import BudgetGifts from "@/database/models/Gifts/BudgetGifts";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const budgets = await BudgetGifts.findOne({ _id: id });
        res.status(200).json({ success: true, data: budgets });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { ...data } = req.body;
        const budget = await BudgetGifts.findByIdAndUpdate(id, data, {
          new: true,
        });
        res.status(200).json({ success: true, data: budget });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const budget = await BudgetGifts.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: budget });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
