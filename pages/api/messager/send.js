import connetMongoDB from "@/lib/services/database/mongodb";
import Message from "@/database/models/Message";
import Chat from "@/database/models/Chat";

export default async function handler(req, res) {
    const { senderId, receiverId, chatId, content } = req.body;

    await connetMongoDB();

    try {
        // สร้างข้อความ
        const newMessage = await Message.create({ chatId, senderId, receiverId, content });
    
        // อัพเดตข้อความล่าสุดใน Chat
        await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });
    
        res.status(201).json(newMessage);
      } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
      }
}


