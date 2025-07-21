import connectMongoDB from "@/lib/services/database/mongodb";
import NewComments from "@/database/models/News/NewComments";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const comments = await NewComments.find({ newsId: id }).sort({
          createdAt: -1,
        });
        res.status(200).json({ success: true, data: comments });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const comment = await NewComments.create(req.body);
        res.status(201).json(comment);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
