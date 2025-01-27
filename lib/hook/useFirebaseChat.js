import { useState, useEffect, useCallback } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, push, update, set, get } from 'firebase/database';
import axios from 'axios';

export const useFirebaseChat = () => {
  const [messages, setMessages] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [participants, setParticipants] = useState({});
  const [conversation, setConversation] = useState(null);

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUserData = useCallback(async (userId) => {
    if (userCache[userId]) {
      return userCache[userId];
    }
  
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const userData = response.data;
  
      setUserCache((prev) => ({
        ...prev,
        [userId]: userData,
      }));
  
      return userData;
    } catch (error) {
      console.error(`Error fetching user data for userId: ${userId}`, error);
      return null;
    }
  }, [userCache]);

  const findExistingChat = async (userId, targetId) => {
    try {
      const chatsRef = ref(database, "chats");
      const snapshot = await get(chatsRef);
  
      if (snapshot.exists()) {
        const chats = snapshot.val();
  
        const sortedUsers = [userId, targetId].sort(); // จัดเรียงลำดับผู้ใช้
  
        for (const chatId in chats) {
          const chat = chats[chatId];
          const chatUsers = chat?.participants?.users?.sort(); // จัดเรียงลำดับผู้ใช้ในห้อง
  
          if (
            chat.participants?.type === "private" &&
            JSON.stringify(chatUsers) === JSON.stringify(sortedUsers) // เปรียบเทียบโดยตรง
          ) {
            return chatId; // คืนค่า chatId ถ้าพบ
          }
        }
      } else {
        console.log("No chats found in Firebase.");
      }
  
      return null; // ไม่พบห้อง
    } catch (error) {
      console.error("Error finding existing chat:", error);
      return null;
    }
  };

  const createConversation = async (creatorId, users, type, channelId = null) => {
    try {
      const sortedUsers = users.sort(); // จัดเรียงลำดับก่อนบันทึก
      const existingChatId = await findExistingChat(sortedUsers[0], sortedUsers[1]);
  
      if (existingChatId) {
        return existingChatId; // ใช้ห้องเดิม
      }
  
      // สร้างห้องใหม่ถ้าไม่พบ
      const newChatData = {
        participants: {
          users: sortedUsers,
          type,
        },
        conversation: {
          creatorId,
          channelId: channelId || null,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
  
      const chatRef = ref(database, "chats");
      const newChatRef = push(chatRef); // สร้าง chatId ใหม่
      const chatId = newChatRef.key;
  
      await set(newChatRef, newChatData);
      return chatId;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  };

  const listenUserChats = (userId, onChatsUpdate) => {
    const chatsRef = ref(database, "chats");
  
    const unsubscribe = onValue(chatsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const chats = snapshot.val();
  
        // ดึงข้อมูลห้องแชท
        const userChats = await Promise.all(
          Object.entries(chats)
            .filter(([chatId, chatData]) =>
              chatData.participants.users.includes(userId) // กรองห้องที่ userId อยู่
            )
            .map(async ([chatId, chatData]) => {
              // ดึงข้อมูลผู้ใช้จาก participants.users
              const usersData = await Promise.all(
                chatData.participants.users.map(async (participantId) => {
                  const userData = await fetchUserData(participantId);
                  return {
                    userId: participantId,
                    ...userData,
                  };
                })
              );
  
              // ดึงข้อความล่าสุดที่ไม่ได้ส่งโดย userId
              const lastMessageEntry = Object.entries(chatData.conversation?.messages || {})
                .reverse()
                .find(([, message]) => message.senderId !== userId);
  
              const lastMessage = lastMessageEntry
                ? {
                    messageId: lastMessageEntry[0],
                    ...lastMessageEntry[1],
                  }
                : null;
  
              return {
                chatId,
                lastMessage,
                participants: {
                  type: chatData.participants.type,
                  users: usersData, // ข้อมูลผู้ใช้
                },
                updatedAt: chatData.conversation?.updatedAt || null,
              };
            })
        );
  
        // เรียงข้อมูลตาม updatedAt (มากไปน้อย)
        const sortedChats = userChats.sort((a, b) =>
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
  
        onChatsUpdate(sortedChats);
      } else {
        onChatsUpdate([]);
      }
    });
  
    return () => unsubscribe(); // Cleanup listener
  };
  


  // ฟังก์ชันดึงข้อความในบทสนทนา
  const listenToChat = useCallback((chatId, fetchUserData) => {
    const chatRef = ref(database, `chats/${chatId}`);
    const unsubscribe = onValue(chatRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        setParticipants([]);
        setConversation(null);
        return;
      }
  
      // ดึงข้อมูลผู้ใช้ใน participants
      const participantData = await Promise.all(
        data.participants.users.map(async (userId) => {
          const userResponse = await axios.get(`/api/users/${userId}`);
          return {
            userId,
            user: userResponse?.data?.user || {},
          };
        })
      );
      setParticipants(participantData);
  
      // ดึงข้อมูล messages
      const messagesData = data.conversation?.messages || {};
      const formattedMessages = await Promise.all(
        Object.entries(messagesData).map(async ([messageId, message]) => {
          const senderResponse = await axios.get(`/api/users/${message.senderId}`);
          return {
            id: messageId,
            ...message,
            user: senderResponse?.data?.user || {},
          };
        })
      );
      setMessages(formattedMessages);
  
      setConversation(data.conversation || null);
    });
  
    return () => unsubscribe();
  }, []);
 

  // ฟังก์ชันส่งข้อความ
  const sendMessage = async (chatId, senderId, messageContent, messageType = 'text', extraData = {}) => {
    if (!chatId || typeof chatId !== 'string') {
      console.error('Invalid chatId:', chatId);
      return;
    }
  
    const messagesRef = ref(database, `chats/${chatId}/conversation/messages`);
    const newMessage = {
      senderId,
      message: messageContent,
      messageType,
      ...extraData,
      createdAt: new Date().toISOString(),
    };
  
    try {
      await push(messagesRef, newMessage);
  
      const conversationRef = ref(database, `chats/${chatId}/conversation`);
      await update(conversationRef, { updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // ฟังก์ชันแก้ไขข้อความ
  const editMessage = async (chatId, messageId, newContent) => {
    const messageRef = ref(database, `chats/${chatId}/conversation/messages/${messageId}`);
    const updatedMessage = {
      message: newContent,
      editedAt: new Date().toISOString(),
    };

    try {
      await update(messageRef, updatedMessage);

      // อัปเดตเวลาแก้ไขบทสนทนา
      const conversationRef = ref(database, `chats/${chatId}/conversation`);
      await update(conversationRef, { updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const deleteMessage = async (chatId, messageId, userId) => {
    const messageRef = ref(database, `chats/${chatId}/conversation/messages/${messageId}`);
    const deleteChatRef = ref(database, `deleteChat/${chatId}/messages/${messageId}`);
  
    try {
      const deletedAt = new Date().toISOString();
      // Update the message to mark it as deleted
      await update(messageRef, { deletedAt });
  
      // Log the deletion in deleteChat
      await update(deleteChatRef, {
        deletedBy: userId,
        deletedAt,
      });
  
      // Update the conversation's updatedAt
      const conversationRef = ref(database, `chats/${chatId}/conversation`);
      await update(conversationRef, { updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  /**
   * Mark a message as read
   * @param {string} chatId - The ID of the chat
   * @param {string} messageId - The ID of the message to mark as read
   * @param {string} userId - The ID of the user who read the message
   */
  const readMessage = async (chatId, messageId, userId) => {
    const messageRef = ref(database, `chats/${chatId}/conversation/messages/${messageId}`);

    try {
      await update(messageRef, {
        isRead: true,
        readBy: userId,
        readAt: new Date().toISOString(),
      });

      console.log(`Message ${messageId} in chat ${chatId} marked as read by ${userId}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  
  const deleteConversation = async (chatId, userId) => {
    const chatRef = ref(database, `chats/${chatId}`);
    const deleteChatRef = ref(database, `deleteChat/${chatId}/conversation`);
  
    try {
      const deletedAt = new Date().toISOString();
      // Mark the entire chat as deleted
      await update(chatRef, { deletedAt });
  
      // Log the deletion in deleteChat
      await update(deleteChatRef, {
        deletedBy: userId,
        deletedAt,
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const markAsRead = async (chatId) => {
    try {
      const messagesRef = ref(database, `chats/${chatId}/messages`);
      // ดึงข้อความที่ยังไม่ได้อ่าน
      const snapshot = await get(messagesRef);
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach((child) => {
          const message = child.val();
          if (!message.reader) {
            updates[`${child.key}/reader`] = true;
          }
        });
        // อัปเดตสถานะ reader เป็น true
        if (Object.keys(updates).length > 0) {
          await update(messagesRef, updates);
        }
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return {
    createConversation,
    messages,
    participants,
    conversation,
    listenToChat,
    sendMessage,
    editMessage,
    fetchUserData,
    deleteMessage,
    deleteConversation,
    readMessage,
    listenUserChats,
    markAsRead,
  };
};
