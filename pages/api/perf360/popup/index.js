import connetMongoDB from "@/lib/services/database/mongodb";
import Popup from "@/database/models/Perf360/Popup";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const popup = await Popup.find({ active: true }).sort({
          createdAt: -1,
        });
        res.status(200).json({ success: true, data: popup });
      } catch (error) {
        console.error("Error fetching satisfactions:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const popup = await Popup.create(req.body);
        res.status(201).json({ success: true, data: popup });
      } catch (error) {
        console.error("Error creating Popup:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
