import { database } from '@/lib/firebase'; // ต้องมั่นใจว่าคุณได้ตั้งค่า Firebase แล้ว
import { ref, get } from 'firebase/database';

export const getMessagesOverview = async (req, res) => {
  const userId = req.query.userId; // รับ userId จาก query parameter

  try {
    // ดึงรายชื่อห้องสนทนาของผู้ใช้
    const conversationsRef = ref(database, `conversations`);
    const conversationsSnapshot = await get(conversationsRef);

    if (!conversationsSnapshot.exists()) {
      return res.json({ success: true, data: [] });
    }

    const conversations = conversationsSnapshot.val();
    const userConversations = Object.entries(conversations).filter(
      ([_, conversation]) => conversation.participants.includes(userId)
    );

    // สร้างข้อมูลหน้ารวม
    const overview = await Promise.all(
      userConversations.map(async ([conversationId, conversation]) => {
        const messagesRef = ref(database, `conversations/${conversationId}/messages`);
        const messagesSnapshot = await get(messagesRef);

        const messages = messagesSnapshot.val();
        const lastMessage = messages ? Object.values(messages).pop() : null;

        // จำนวนข้อความที่ยังไม่ได้อ่าน
        const unreadCount = messages
          ? Object.values(messages).filter(
              (message) => !message.readBy || !message.readBy.includes(userId)
            ).length
          : 0;

        // ข้อมูลผู้เข้าร่วมคนอื่น (ไม่ใช่ userId)
        const otherParticipantId = conversation.participants.find((id) => id !== userId);
        const userSnapshot = await get(ref(database, `users/${otherParticipantId}`));
        const otherParticipant = userSnapshot.val();

        return {
          conversationId,
          otherParticipant: {
            id: otherParticipantId,
            fullname: otherParticipant?.fullname || 'Unknown User',
            avatar: otherParticipant?.pictureUrl || '/default-avatar.png',
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
        };
      })
    );

    return res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Error fetching messages overview:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
