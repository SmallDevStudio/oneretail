import { firestore } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req, res) {
    const { method, body } = req;

    if (method === 'POST') {
        const { chatId, senderId, content } = body;
    
        try {
          const messageRef = collection(firestore, `chats/${chatId}/messages`);
          const doc = await addDoc(messageRef, {
            senderId,
            content,
            timestamp: new Date(),
          });
          res.status(201).json({ id: doc.id, ...body });
        } catch (error) {
          res.status(500).json({ error: 'Failed to send message' });
        }
      } else if (method === 'GET') {
        const { chatId } = req.query;
    
        try {
          const messageRef = collection(firestore, `chats/${chatId}/messages`);
          const q = query(messageRef, where('chatId', '==', chatId));
          const querySnapshot = await getDocs(q);
    
          const messages = [];
          querySnapshot.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));
          res.status(200).json(messages);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch messages' });
        }
      } else {
        res.status(405).json({ error: 'Method Not Allowed' });
      }
    }