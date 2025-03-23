import connetMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const menu = await Menu.find().sort({ order: 1 });
        res.status(200).json({ success: true, data: menu });
      } catch (error) {
        console.error("Error fetching Menu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const count = await Menu.countDocuments();
        const newOrder = count + 1;

        const menu = await Menu.create({
          ...req.body,
          order: newOrder,
        });

        res.status(201).json({ success: true, data: menu });
      } catch (error) {
        console.error("Error creating Menu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
