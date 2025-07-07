import connetMongoDB from "@/lib/services/database/mongodb";
import News from "@/database/models/News";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await News.findById(id);
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
        const news = await News.findByIdAndUpdate(id, req.body, {
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
        const news = await News.findByIdAndDelete(id);
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
