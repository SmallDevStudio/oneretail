import connetMongoDB from "@/lib/services/database/mongodb";
import NewsComments from "@/database/models/Perf360/NewsComments";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;
  const { newsId } = req.query;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const news = await NewsComments.find({ newsId: newsId }).sort({
          createdAt: -1,
        });
        const userIds = news.map((n) => n.userId);
        const users = await Users.find({ userId: { $in: userIds } });

        const data = news.map((n) => {
          const user = users.find((u) => u.userId === n.userId);
          return { ...n._doc, user };
        });

        res.status(200).json({ success: true, data: data });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const news = await NewsComments.create(req.body);
        res.status(201).json({ success: true, data: news });
      } catch (error) {
        console.error("Error creating News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
