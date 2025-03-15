import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "POST":
      try {
        const point = await Point.create(req.body);
        return res.status(200).json({ success: true, data: point });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
      break;
  }
}
