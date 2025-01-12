import admin from "@/lib/firebaseAdmin";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Missing senderId or receiverId" });
  }

  try {
    // ดึงข้อมูล sender และ receiver จาก MongoDB
    const sender = await Users.findOne({ userId: senderId });
    const receiver = await Users.findOne({ userId: receiverId });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or Receiver not found" });
    }

    const chatsRef = admin.database().ref("chats");
    const snapshot = await chatsRef.orderByChild("sender/userId").equalTo(senderId).once("value");

    // ตรวจสอบว่ามีแชทที่ตรงกับ sender และ receiver หรือไม่
    let existingChatId = null;
    snapshot.forEach((child) => {
      const chat = child.val();
      if (
        (chat.receiver.userId === receiverId && chat.sender.userId === senderId) ||
        (chat.receiver.userId === senderId && chat.sender.userId === receiverId)
      ) {
        existingChatId = child.key; // ดึง chatId ที่เจอ
      }
    });

    if (existingChatId) {
      // ถ้ามีห้องแชทอยู่แล้ว ให้ส่ง chatId กลับ
      return res.status(200).json({ message: "Chat already exists", chatId: existingChatId });
    }

    // ถ้ายังไม่มี ให้สร้างห้องแชทใหม่
    const chatRef = chatsRef.push();
    await chatRef.set({
      sender: {
        userId: sender.userId,
        pictureUrl: sender.pictureUrl,
        fullname: sender.fullname,
        empId: sender.empId,
      },
      receiver: {
        userId: receiver.userId,
        pictureUrl: receiver.pictureUrl,
        fullname: receiver.fullname,
        empId: receiver.empId,
      },
      messages: {}, // เริ่มต้นเป็นว่าง
      lastMessage: "",
      senderName: sender.fullname,
      receiverName: receiver.fullname,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Chat created successfully!", chatId: chatRef.key });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
