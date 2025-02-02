import { useState, useEffect } from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import { useRouter } from 'next/router';

export default function Messager({ userId, size }) {
    const { unReadUser } = useFirebaseChat();
    const [unReadMessages, setUnreadMessages] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if (!userId) return;
    
        const fetchUnreadMessages = async () => {
          const count = await unReadUser(userId);
          setUnreadMessages(count);
        };
    
        fetchUnreadMessages();

    }, [unReadUser, userId]);

    return (
        <div 
            className="relative inline-block"
            onClick={() => router.push('/messager')}
        >
            <AiOutlineMessage 
                size={size || 24} 
                className="cursor-pointer" 
            />
            {unReadMessages > 0 && (
                <div className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {unReadMessages}
                </div>
            )}
        </div>
    );
}