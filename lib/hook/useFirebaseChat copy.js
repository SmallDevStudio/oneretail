import { useState, useEffect, useCallback } from 'react';
import { database } from '../firebase'; // ต้องมั่นใจว่าคุณได้ตั้งค่า Firebase แล้ว
import { ref, onValue, push, update, set, remove, onDisconnect } from 'firebase/database';
import axios from 'axios';

export const useFirebaseChat = () => {
  const [messages, setMessages] = useState([]);
  const [userCache, setUserCache] = useState({}); // เก็บข้อมูลผู้ใช้ที่ดึงมาแล้ว

  // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้จาก MongoDB
  const fetchUserData = useCallback(async (userId) => {
    if (userCache[userId]) {
      return userCache[userId]; // คืนค่าจาก cache ถ้ามี
    }

    try {
      const response = await axios.get(`/api/users/${userId}`); // API ที่เชื่อม MongoDB
      const userData = response.data.user;
      setUserCache((prev) => ({
        ...prev,
        [userId]: userData, // บันทึกข้อมูลใน cache
      }));
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, [userCache]);

 // ฟังก์ชันเพื่อฟังข้อความในบทสนทนา
 const listenToMessages = useCallback((conversationId) => {
  const messagesRef = ref(database, `conversations/${conversationId}/messages`);

  onValue(messagesRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      setMessages([]);
      return;
    }

    const fetchedMessages = await Promise.all(
      Object.entries(data).map(async ([id, message]) => {
        const userData = await fetchUserData(message.senderId);
        const updatedMessage = {
          id,
          ...message,
          senderFullName: userData?.fullname || 'Unknown User',
          senderPictureUrl: userData?.pictureUrl || '',
          senderEmpId: userData?.empId || '',
          // ตรวจสอบลิงค์ในข้อความ
          contentWithLinks: handleLinks(message.content),
        };
        return updatedMessage;
      })
    );

    setMessages(fetchedMessages);
  });
}, [fetchUserData]);

  // ฟังก์ชันจัดการการแสดงลิงค์ในข้อความ
  const handleLinks = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = content.match(urlRegex);
    if (matches) {
      return content.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`; // แสดงลิงค์เป็น HTML anchor
      });
    }
    return content;
  };

  // ฟังก์ชันส่งข้อความ
  const sendMessage = async (conversationId, senderId, content) => {
    const messagesRef = ref(database, `conversations/${conversationId}/messages`);
    const newMessage = {
      senderId,
      content,
      createdAt: new Date().toISOString(),
      readBy: [], // รายการของผู้ที่อ่านข้อความแล้ว
    };

    try {
      await push(messagesRef, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // ฟังก์ชันแก้ไขข้อความ
  const editMessage = async (conversationId, messageId, newContent) => {
    const messageRef = ref(database, `conversations/${conversationId}/messages/${messageId}`);
    const updatedMessage = {
      content: newContent,
      editedAt: new Date().toISOString(),
    };

    try {
      await update(messageRef, updatedMessage);
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  // ฟังก์ชันเพิ่ม Sticker
  const addSticker = async (conversationId, sticker) => {
    const stickersRef = ref(database, `conversations/${conversationId}/stickers`);
    await push(stickersRef, sticker);
  };

  // ฟังก์ชันฟัง Sticker ที่เพิ่มเข้ามาในบทสนทนา
  const listenToStickers = (conversationId, callback) => {
    const stickersRef = ref(database, `conversations/${conversationId}/stickers`);
    onValue(stickersRef, (snapshot) => {
      callback(snapshot.val());
    });
  };

  // Listen to user online status
  const listenToUserStatus = (userId, callback) => {
    const statusRef = ref(database, `users/${userId}/isOnline`);
    onValue(statusRef, (snapshot) => {
      callback(snapshot.val());
    });
  };

  // Set user online/offline status
  const setUserOnlineStatus = (userId, isOnline) => {
    const userStatusRef = ref(database, `users/${userId}/isOnline`);
    const lastActiveRef = ref(database, `users/${userId}/lastActiveAt`);
    set(userStatusRef, isOnline);

    if (isOnline) {
      onDisconnect(userStatusRef).set(false);
      onDisconnect(lastActiveRef).set(Date.now());
    } else {
      set(lastActiveRef, Date.now());
    }
  };

  // Create a conversation with a type (1-1 or group)
  const createConversation = async (participants, type) => {
    const conversationRef = ref(database, 'conversations');
    const newConversation = await push(conversationRef, {
      participants,
      type, // Type ระบุว่าเป็นแบบ 1-1 หรือ กลุ่ม
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newConversation.key; // Returns the conversation ID
  };

  // Listen to a specific conversation
  const listenToConversation = (conversationId, callback) => {
    const conversationRef = ref(database, `conversations/${conversationId}`);
    onValue(conversationRef, (snapshot) => {
      callback(snapshot.val());
    });
  };

  // Add or update a participant in a conversation
  const updateParticipant = async (conversationId, userId) => {
    const participantRef = ref(database, `participants/${conversationId}/${userId}`);
    await set(participantRef, {
      userId,
      joinedAt: Date.now(),
    });
  };

  // Delete a conversation
  const deleteConversation = async (conversationId) => {
    const conversationRef = ref(database, `conversations/${conversationId}`);
    await remove(conversationRef);
  };

  // Remove a participant from a conversation
  const removeParticipant = async (conversationId, userId) => {
    const participantRef = ref(database, `participants/${conversationId}/${userId}`);
    await remove(participantRef);
  };

  // Attachments: Add an attachment to a message
  const addAttachment = async (messageId, fileUrl, thumbUrl) => {
    const attachmentRef = ref(database, `attachments/${messageId}`);
    await push(attachmentRef, {
      fileUrl,
      thumbUrl,
      createdAt: Date.now(),
    });
  };

  // Listen to attachments for a message
  const listenToAttachments = (messageId, callback) => {
    const attachmentRef = ref(database, `attachments/${messageId}`);
    onValue(attachmentRef, (snapshot) => {
      callback(snapshot.val());
    });
  };

  // ฟังก์ชันเพื่อตรวจสอบสถานะการอ่าน
  const markMessageAsRead = async (conversationId, messageId, userId) => {
    const messageRef = ref(database, `conversations/${conversationId}/messages/${messageId}/readBy`);
    const messageSnapshot = await get(messageRef);
    const readBy = messageSnapshot.val() || [];

    // ถ้ายังไม่เคยอ่านจากผู้ใช้คนนี้ก็จะเพิ่มเข้าไป
    if (!readBy.includes(userId)) {
      readBy.push(userId);
      await update(messageRef, readBy);
    }
  };

  return {
    messages,
    listenToMessages,
    sendMessage,
    editMessage,
    fetchUserData, // เผื่อใช้งานในฟังก์ชันอื่น
    listenToUserStatus,
    setUserOnlineStatus,
    createConversation,
    listenToConversation,
    updateParticipant,
    deleteConversation,
    removeParticipant,
    addAttachment,
    listenToAttachments,
    addSticker, // ฟังก์ชันเพิ่ม Sticker
    listenToStickers, // ฟังก์ชันฟังการเพิ่ม Sticker
    markMessageAsRead,
  };
};
