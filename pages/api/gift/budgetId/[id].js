import connetMongoDB from "@/lib/services/database/mongodb";
import BudgetGifts from "@/database/models/Gifts/BudgetGifts";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      const { id } = req.query;
      console.log("id", id);
      try {
        const budgets = await BudgetGifts.findOne({ _id: id });
        res.status(200).json({ success: true, data: budgets });
      } catch (error) {
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
