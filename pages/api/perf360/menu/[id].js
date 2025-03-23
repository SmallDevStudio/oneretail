import connetMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const menu = await Menu.findById(id).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: menu });
      } catch (error) {
        console.error("Error fetching satisfactions:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const { updated_users, ...rest } = req.body;

        const menu = await Menu.findByIdAndUpdate(
          id,
          {
            $set: rest,
            $push: {
              updated_users: {
                $each: updated_users || [],
              },
            },
          },
          { new: true }
        );

        res.status(201).json({ success: true, data: menu });
      } catch (error) {
        console.error("Error Updated Menu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const deleted = await Menu.findByIdAndDelete(id);
        res.status(201).json({ success: true });
      } catch (error) {
        console.error("Error Deleted Menu:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
