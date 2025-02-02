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
  
        const userChats = await Promise.all(
          Object.entries(chats)
            .filter(
              ([chatId, chatData]) =>
                chatData.participants.users.includes(userId) && !chatData.deletedAt // Filter out deleted chats
            )
            .map(async ([chatId, chatData]) => {
              // Fetch user data for participants
              const usersData = await Promise.all(
                chatData.participants.users.map(async (participantId) => {
                  const userData = await fetchUserData(participantId);
                  return {
                    userId: participantId,
                    ...userData,
                  };
                })
              );
  
              // Calculate unread count for messages
              const messages = chatData.conversation?.messages || {};
              const unreadCount = Object.values(messages).filter(
                (message) => !message.isRead && message.senderId !== userId
              ).length;
  
              // Find the last message not sent by the user
              const lastMessageEntry = Object.entries(messages)
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
                unreadCount, // Add unread count here
                participants: {
                  type: chatData.participants.type,
                  users: usersData,
                },
                updatedAt: chatData.conversation?.updatedAt || null,
              };
            })
        );
  
        const sortedChats = userChats.sort((a, b) =>
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
  
        onChatsUpdate(sortedChats);
      } else {
        onChatsUpdate([]);
      }
    });
  
    return () => unsubscribe();
  };
  
  // ฟังก์ชันดึงข้อความในบทสนทนา
  const listenToChat = useCallback((chatId) => {
    const chatRef = ref(database, `chats/${chatId}`);
    const unsubscribe = onValue(chatRef, async (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            setMessages([]);
            setParticipants([]);
            setConversation(null);
            return;
        }

        // โหลดข้อมูลผู้ใช้เฉพาะครั้งแรกที่เข้าแชท
        if (!participants.length) {
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
        }

        // โหลดเฉพาะข้อความใหม่
        const messagesData = data.conversation?.messages || {};
        setMessages((prevMessages) => {
            const newMessages = Object.entries(messagesData)
                .filter(([id, message]) => !prevMessages.some((m) => m.id === id))
                .map(([id, message]) => ({
                    id,
                    ...message,
                }));
            return [...prevMessages, ...newMessages];
        });

        const conversationData = data.conversation || null;
        const conversationWithUserData = {
            ...conversationData,
            creator: await fetchUserData(conversationData.creatorId),
        };
        setConversation(conversationWithUserData);
    });

    return () => unsubscribe();
}, [fetchUserData, participants.length]);

 

  // ฟังก์ชันส่งข้อความ
  const sendMessage = async (chatId, senderId, messageContent, messageType = 'text', extraData = {}) => {
    if (!chatId || typeof chatId !== 'string') {
      console.error('Invalid chatId:', chatId);
      return;
    }

    const messagesRef = ref(database, `chats/${chatId}/conversation/messages`);
    const newMessageRef = push(messagesRef); // ใช้ push เพื่อให้ Firebase สร้าง messageId อัตโนมัติ

    const newMessage = {
      senderId,
      message: messageContent,
      messageType,
      ...extraData,
      isRead: false,
      readBy: [],
      createdAt: new Date().toISOString(),
    };

    try {
      await set(newMessageRef, newMessage); // ใช้ set แทน push เฉยๆ เพื่อให้แน่ใจว่าเขียนค่าเข้าไป
      console.log(`Message sent: ${messageContent}`);

      const conversationRef = ref(database, `chats/${chatId}/conversation`);
      await update(conversationRef, { updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error sending message:', error);
    }
};

  const replyMessage = async (chatId, senderId, messageContent, replyId, messageType = 'text', extraData = {}) => {
    if (!chatId || typeof chatId !== 'string') {
      console.error('Invalid chatId:', chatId);
      return;
    }
  
    const messagesRef = ref(database, `chats/${chatId}/conversation/messages`);
    const newMessage = {
      senderId,
      message: messageContent,
      replyId, // เพิ่ม replyId
      messageType,
      ...extraData,
      isRead: false,
      readBy: [],
      createdAt: new Date().toISOString(),
    };
  
    try {
      await push(messagesRef, newMessage);
  
      const conversationRef = ref(database, `chats/${chatId}/conversation`);
      await update(conversationRef, { updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error sending reply message:', error);
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
    try {
      const deletedAt = new Date().toISOString();
      await update(messageRef, {
        isDeleted: true,
        deletedAt,
      });
  
      // Update updatedAt ในบทสนทนา
      const conversationRef = ref(database, `chats/${chatId}/conversation`);
      await update(conversationRef, { updatedAt: new Date().toISOString() });
  
      console.log(`Message ${messageId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  const readMessage = async (chatId, messageId, userId) => {
    const messageRef = ref(database, `chats/${chatId}/conversation/messages/${messageId}`);
  
    try {
      await update(messageRef, {
        isRead: true,
        readBy: { [userId]: true }, // เก็บ `userId` เป็น Object เพื่อรองรับหลาย User
        readAt: new Date().toISOString(),
      });
  
      console.log(`Message ${messageId} in chat ${chatId} marked as read by ${userId}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  
  const deleteConversation = async (chatId, userId) => {
    const chatRef = ref(database, `chats/${chatId}`);
    const deletedChatsRef = ref(database, `deletedChats/${chatId}`);
    
    try {
      // ดึงข้อมูลทั้งหมดของ chat ก่อนลบ
      const snapshot = await get(chatRef);
      if (snapshot.exists()) {
        const chatData = snapshot.val();
  
        // เพิ่มข้อมูล deletedBy และ deletedAt
        const deletedData = {
          ...chatData,
          deletedBy: userId,
          deletedAt: new Date().toISOString(),
        };
  
        // ย้ายข้อมูลไปที่ deletedChats
        await set(deletedChatsRef, deletedData);
  
        // ลบข้อมูลออกจาก chats
        await set(chatRef, null);
  
        console.log(`Chatroom ${chatId} moved to deletedChats by user ${userId}`);
      } else {
        console.warn(`Chatroom ${chatId} does not exist.`);
      }
    } catch (error) {
      console.error(`Error deleting conversation ${chatId}:`, error);
      throw error;
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

  const unReadUser = async (userId) => {
    if (!userId) return 0; // ถ้าไม่มี userId ให้ return 0 ทันที
    
    try {
      const userChatsRef = ref(database, `users/${userId}/chats`);
      const userChatsSnapshot = await get(userChatsRef);
      
      if (!userChatsSnapshot.exists()) return 0;
  
      const chatIds = Object.keys(userChatsSnapshot.val()); // ดึง chatId ทั้งหมดที่ user อยู่
      let unreadCount = 0;
  
      // ดึงข้อมูลแต่ละแชท
      const chatPromises = chatIds.map(async (chatId) => {
        const chatMessagesRef = ref(database, `chats/${chatId}/conversation/messages`);
        const chatMessagesSnapshot = await get(chatMessagesRef);
  
        if (chatMessagesSnapshot.exists()) {
          const messages = chatMessagesSnapshot.val();
  
          // นับจำนวนข้อความที่ userId ยังไม่ได้อ่าน
          const unreadMessages = Object.values(messages).filter(
            (msg) => !msg.isRead && (!msg.readBy || !msg.readBy.includes(userId))
          );
  
          return unreadMessages.length; 
        }
  
        return 0;
      });
  
      // รวมจำนวนข้อความที่ยังไม่ได้อ่านจากทุกแชท
      const unreadCounts = await Promise.all(chatPromises);
      unreadCount = unreadCounts.reduce((sum, count) => sum + count, 0);
  
      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      return 0;
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
    replyMessage,
    unReadUser,
  };
};
