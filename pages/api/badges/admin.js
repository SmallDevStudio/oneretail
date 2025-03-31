import connetMongoDB from "@/lib/services/database/mongodb";
import Badges from "@/database/models/Badges";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const badges = await Badges.find();
        res.status(200).json({ success: true, data: badges });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
