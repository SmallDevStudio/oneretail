import { useState, useEffect } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { useRouter } from "next/router";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function Messager({ userId, size }) {
  const [unReadMessages, setUnreadMessages] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const notiRef = ref(database, `notifications`);
    const unsubscribe = onValue(notiRef, (snapshot) => {
      if (!snapshot.exists()) {
        setUnreadMessages(0);
        return;
      }

      let count = 0;
      const allNotis = snapshot.val();

      Object.values(allNotis).forEach((chatNotis) => {
        Object.values(chatNotis).forEach((noti) => {
          if (
            noti.userId === userId &&
            noti.type === "message" &&
            !noti.isReading
          ) {
            count++;
          }
        });
      });

      setUnreadMessages(count);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div
      className="relative inline-block"
      onClick={() => router.push("/messager")}
    >
      <AiOutlineMessage size={size || 24} className="cursor-pointer" />
      {unReadMessages > 0 && (
        <div className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
          {unReadMessages}
        </div>
      )}
    </div>
  );
}
