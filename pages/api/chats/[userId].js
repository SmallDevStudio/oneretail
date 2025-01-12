import admin from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  try {
    const firebaseChats = await admin.database().ref("chats").once("value");
    const chats = firebaseChats.val() || {};

    // ดึงเฉพาะแชทที่เกี่ยวข้องกับ userId
    const userChats = Object.entries(chats).filter(
      ([_, chat]) =>
        chat.sender.userId === userId || chat.receiver.userId === userId
    );

    return res.status(200).json({
      userChats: userChats.map(([id, chat]) => ({ id, ...chat })),
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}