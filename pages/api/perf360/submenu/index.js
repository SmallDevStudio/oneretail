import connetMongoDB from "@/lib/services/database/mongodb";
import SubMenu from "@/database/models/Perf360/SubMenu";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const submenu = await SubMenu.find().sort({ order: 1 });
        res.status(200).json({ success: true, data: submenu });
      } catch (error) {
        console.error("Error fetching SubMenu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const count = await SubMenu.countDocuments();
        const newOrder = count + 1;

        const submenu = await SubMenu.create({
          ...req.body,
          order: newOrder,
        });

        res.status(201).json({ success: true, data: submenu });
      } catch (error) {
        console.error("Error creating SubMenu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
