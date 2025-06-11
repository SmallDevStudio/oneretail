import connetMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";
import GetPoints from "@/database/models/Hall-of-fame/GetPoints";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const { halloffameId, userId } = req.query;
        const getPoints = await GetPoints.find({
          halloffameId,
          userId,
        });
        res.status(200).json({ success: true, data: getPoints });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const { halloffameId, userId, points } = req.body;

        if (!halloffameId || !userId || !points) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
        }

        const getPoints = await GetPoints.create({
          halloffameId,
          userId,
          points,
        });

        const pointEntry = new Point({
          userId,
          description: `รับ point จาก reward hall of fame`,
          contentId: halloffameId,
          path: "hall-of-fame",
          type: "earn",
          point: points,
        });
        await pointEntry.save();

        const message = `คุณได้รับ ${points} คะแนน hall of fame 🎉`;
        sendLineMessage(userId, message);

        res.status(201).json({ success: true, data: getPoints });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
