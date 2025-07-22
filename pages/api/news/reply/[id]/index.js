import connectMongoDB from "@/lib/services/database/mongodb";
import NewReply from "@/database/models/News/NewReply";

export default async function handler(req, res) {
  await connectMongoDB();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const reply = await NewReply.findById(id);
        res.status(200).json({ success: true, data: reply });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const reply = await NewReply.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: reply });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const reply = await NewReply.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: reply });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
