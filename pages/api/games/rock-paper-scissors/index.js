import connetMongoDB from "@/lib/services/database/mongodb";
import RockPaperScissorsGame from "@/database/models/RockPaperScissorsGame";

export default async function handler(req, res) {
    const { method, query, body } = req;
  
    await connetMongoDB();
  
    switch (method) {
      case "GET": // ตรวจสอบว่า user ได้เล่นในวันนี้หรือยัง
        try {
          const { userId } = query;
  
          if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId" });
          }
  
          const today = new Date();
          today.setHours(0, 0, 0, 0);
  
          const playedToday = await RockPaperScissorsGame.findOne({
            userId,
            createdAt: { $gte: today },
          });
  
          res.status(200).json({
            success: true,
            hasPlayedToday: !!playedToday,
            data: playedToday,
          });
        } catch (error) {
          console.error("Error checking play status:", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
        break;
  
      case "POST": // บันทึกข้อมูลการเล่น
        try {
          const { userId, score, isWin } = body;
  
          if (!userId || typeof score !== "number" || typeof isWin !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid input data" });
          }
  
          const newGamePlay = new RockPaperScissorsGame({ userId, score, isWin });
          await newGamePlay.save();
  
          res.status(201).json({ success: true, data: newGamePlay });
        } catch (error) {
          console.error("Error saving game play:", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
        break;
  
      default:
        res.status(405).json({ success: false, message: "Method not allowed" });
        break;
    }
  }