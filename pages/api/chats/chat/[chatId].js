import admin from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { chatId } = req.query;
  
    try {
      const chatRef = admin.database().ref(`chats/${chatId}`);
      const chatSnapshot = await chatRef.once("value");
  
      if (!chatSnapshot.exists()) {
        return res.status(404).json({ error: "Chat not found" });
      }
  
      return res.status(200).json(chatSnapshot.val());
    } catch (error) {
      console.error("Error fetching chat:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }