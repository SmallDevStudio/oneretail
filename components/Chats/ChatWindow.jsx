export default function ChatWindow({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
  
    useEffect(() => {
      async function fetchMessages() {
        const res = await fetch(`/api/messages/${chatId}`);
        const data = await res.json();
        setMessages(data);
      }
      fetchMessages();
    }, [chatId]);
  
    async function sendMessage() {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, content: newMessage, senderId: '123' }),
      });
      setNewMessage('');
    }
  
    return (
      <div>
        <div>
          {messages.map((msg) => (
            <p key={msg._id}>
              <strong>{msg.senderId}</strong>: {msg.content}
            </p>
          ))}
        </div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    );
  }
  