import connetMongoDB from "@/lib/services/database/mongodb";
import View from "@/database/models/View";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    await connetMongoDB();
    const { contentId, userId, time } = req.body;

    if (req.method === "POST") {
        try {
            const newView = await View.create({
              contentId,
              userId,
              time,
            });
        
            res.status(201).json({ success: true, data: newView });
          } catch (error) {
            res.status(400).json({ success: false });
          }
        };
}