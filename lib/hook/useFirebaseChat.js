import { useState, useEffect, useCallback } from 'react';
import { database } from '../firebase'; // ต้องมั่นใจว่าคุณได้ตั้งค่า Firebase แล้ว
import { ref, onValue, push, update } from 'firebase/database';
import axios from 'axios';

export const useFirebaseChat = () => {
  const [messages, setMessages] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [participants, setParticipants] = useState({});
  const [conversation, setConversation] = useState(null);

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUserData = useCallback(async (userId) => {
    if (userCache[userId]) return userCache[userId];

    try {
      const response = await axios.get(`/api/users/${userId}`);
      const userData = response.data;
      setUserCache((prev) => ({
        ...prev,
        [userId]: userData,
      }));
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, [userCache]);

  /**
   * Create a new chat room (conversation)
   * @param {string} creatorId - The ID of the user creating the conversation
   * @param {Array<string>} participants - Array of user IDs in the conversation
   * @param {string} type - Type of conversation ("private" or "group")
   * @param {string} [channelId] - Optional channel ID for group chats
   * @returns {Promise<string>} - The ID of the newly created chat room
   */
  const createConversation = async (creatorId, participants, type , channelId = null) => {
    try {
      const chatRef = ref(database, "chats");
      const newChatRef = push(chatRef); // Generate a new chatId
      const chatId = newChatRef.key;

      const newChatData = {
        participants: {
          users: participants,
          type,
        },
        conversation: {
          creatorId,
          channelId: channelId || null,
          messages: [], // Initialize empty messages array
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };

      await set(newChatRef, newChatData);
      console.log(`Chat room ${chatId} created successfully.`);
      return chatId;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  };

  /**
   * Listen for all chatrooms for a specific user
   * @param {string} userId - The ID of the logged-in user
   * @param {function} onChatsUpdate - Callback to handle chat updates
   */
  const listenUserChats = (userId, onChatsUpdate) => {
    const chatsRef = ref(database, "chats");

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const chats = snapshot.val();
        const userChats = Object.entries(chats)
          .filter(([chatId, chatData]) =>
            chatData.participants.users.includes(userId) // Filter by user in participants
          )
          .map(([chatId, chatData]) => {
            // Get last message not sent by the user
            const lastMessage = Object.entries(chatData.conversation.messages || {})
              .reverse() // Reverse to start from the latest messages
              .find(([, message]) => message.senderId !== userId);

            return {
              chatId,
              participants: chatData.participants,
              lastMessage: lastMessage
                ? {
                    messageId: lastMessage[0],
                    ...lastMessage[1],
                  }
                : null,
              updatedAt: chatData.conversation?.updatedAt || null,
            };
          });

        onChatsUpdate(userChats);
      } else {
        onChatsUpdate([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  };


  // ฟังก์ชันดึงข้อความในบทสนทนา
  const listenToChat = useCallback((chatId) => {
    const chatRef = ref(database, `chats/${chatId}`);

    onValue(chatRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        setParticipants({});
        setConversation(null);
        return;
      }

      // ดึงข้อมูลผู้ใช้ใน participants
      const participantData = await Promise.all(
        data.participants.users.map(async (userId) => {
          const userData = await fetchUserData(userId);
          return {
            userId,
            ...userData,
          };
        })
      );
      setParticipants(participantData);

      // ดึงข้อมูล messages
      const messagesData = data.conversation?.messages || {};
      const formattedMessages = Object.entries(messagesData).map(([messageId, message]) => ({
        id: messageId,
        ...message,
      }));
      setMessages(formattedMessages);

      // ตั้งค่าบทสนทนา
      setConversation(data.conversation || null);
    });
  }, [fetchUserData]);

  // ฟังก์ชันส่งข้อความ
  const sendMessage = async (chatId, senderId, messageContent, messageType = 'text', extraData = {}) => {
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

      // อัปเดตเวลาแก้ไขบทสนทนา
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
    listenUserChats
  };
};
