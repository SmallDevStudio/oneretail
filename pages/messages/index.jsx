import { useState, useEffect } from 'react';
import ChatWindow from '@/components/Chats/ChatWindow';

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    async function fetchChats() {
      const res = await fetch('/api/chats');
      const data = await res.json();
      setChats(data);
    }
    fetchChats();
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => alert('Create Group Chat')}>+ Create Group</button>
      </div>
      <div>
        {chats.map((chat) => (
          <div key={chat._id} onClick={() => setSelectedChat(chat)}>
            {chat.isGroupChat ? chat.groupName : '1-1 Chat'}
          </div>
        ))}
      </div>
      {selectedChat && <ChatWindow chatId={selectedChat._id} />}
    </div>
  );
}