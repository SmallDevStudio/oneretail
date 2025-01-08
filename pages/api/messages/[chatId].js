import connetMongoDB from "@/lib/services/database/mongodb";
import Message from "@/database/models/Message";

export default async function handler(req, res) {
    const { chatId } = req.query;

    await connetMongoDB();

    try {
        const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
}