import connetMongoDB from "@/lib/services/database/mongodb";
import Chat from "@/database/models/Chat";

export default async function handler(req, res) {
    const { members, groupName, groupPicture } = req.body;
  
    await connetMongoDB();
  
    try {
      const newChat = await Chat.create({ isGroupChat: true, members, groupName, groupPicture });
      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create group' });
    }
  }