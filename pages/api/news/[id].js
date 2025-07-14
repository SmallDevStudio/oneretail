import connetMongoDB from "@/lib/services/database/mongodb";
import News1 from "@/database/models/News/News1";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await News1.findById(id);
        if (!news) {
          return res.status(404).json({ success: false });
        }

        if (news.active === false) {
          return res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: news });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const news = await News1.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const news = await News1.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
