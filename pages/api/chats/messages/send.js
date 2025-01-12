import admin from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { chatId } = req.query;
    const { senderId, message } = req.body;
  
    if (!message || !senderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const chatRef = admin.database().ref(`chats/${chatId}`);
      const chatSnapshot = await chatRef.once("value");
  
      if (!chatSnapshot.exists()) {
        return res.status(404).json({ error: "Chat not found" });
      }
  
      // เพิ่มข้อความใหม่ใน messages
      const newMessage = {
        senderId,
        text: message,
        timestamp: new Date().toISOString(),
        read: false,
      };
  
      await chatRef.child("messages").push(newMessage);
  
      // อัพเดตข้อความล่าสุดใน Chat
      const updates = {
        updatedAt: new Date().toISOString(),
        lastMessage: newMessage.text,
      };
      
      console.log("Updates to apply:", updates);
      
      await chatRef.update(updates);
      
      console.log("Update successful!");
  
      return res.status(201).json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  