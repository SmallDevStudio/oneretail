import { useState, useEffect, useCallback, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { IoIosArrowBack } from "react-icons/io";
import { FiInfo } from "react-icons/fi";
import { RiEmojiStickerLine, RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";
import { GoPaperclip } from "react-icons/go";
import Avatar from "../utils/Avatar";
import { useSession } from "next-auth/react";
import { database } from "@/lib/firebase"; // Firebase setup file
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import Time from "../utils/Time";
import axios from "axios";
import MessagePopupMenu from "./MessagePopupMenu";

export default function MessageWindows({ selectedChat, handleClose }) {
  const { data: session } = useSession();
  const userId = session?.user?.userId;
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameRoom, setNameRoom] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [menuMessage, setMenuMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null); // ใช้ตรวจจับคลิกข้างนอกเมนู
  const {
    messages,
    participants,
    listenToChat,
    sendMessage,
    deleteMessage,
    markAsRead,
    fetchUserData,
  } = useFirebaseChat();

  // ฟังก์ชันดึงข้อความในบทสนทนา
  useEffect(() => {
    if (selectedChat) {
      setLoading(true); // เริ่มโหลด
      const unsubscribe = listenToChat(selectedChat, () => {
        setLoading(false); // โหลดเสร็จ
      });

      return () => unsubscribe(); // ยกเลิกการฟังเมื่อปิด
    }
  }, [selectedChat, listenToChat]);

  useEffect(() => {
    if (participants) {
      const participantsArray = Array.isArray(participants) ? participants : Array.from(participants || []);
  
      const otherParticipants = participantsArray.filter(
        (participant) => participant.userId !== session?.user?.id
      );
  
      if (otherParticipants.length > 0) {
        setNameRoom(
          otherParticipants.map((participant) => participant.user?.fullname || "Unknown").join(", ")
        );
        setTargetUserId(otherParticipants[0].userId);
      } else {
        setNameRoom("Chat Room");
        setTargetUserId(null);
      }
    }
  }, [participants, session?.user?.id]);

  useEffect(() => {
    if (userId && targetUserId) {
      const userStatusRef = ref(database, `users/${userId}/online`);
      const targetUserStatusRef = ref(database, `users/${targetUserId}/online`);

      // ฟังสถานะออนไลน์แบบเรียลไทม์
      const unsubscribe = onValue(userStatusRef, (snapshot) => {
        if (snapshot.exists()) {
          setIsOnline(snapshot.val());
        } else {
          setIsOnline(false); // หากไม่มีข้อมูลใน Firebase ให้ถือว่า offline
        }
      });

      // ฟังสถานะออนไลน์แบบเรียลไทม์
      const unsubscribeTargetUser = onValue(targetUserStatusRef, (snapshot) => {
        if (snapshot.exists()) {
          setIsTargetOnline(snapshot.val());
        } else {
          setIsTargetOnline(false); // หากไม่มีข้อมูลใน Firebase ให้ถือว่า offline
        }
      });

      return () => {
        unsubscribe();
        unsubscribeTargetUser();
      };
    }
  }, [userId, targetUserId]);

  useEffect(() => {
    if (selectedChat && session?.user?.id) {
      markAsRead(selectedChat);
    }
  }, [selectedChat, session?.user?.id, markAsRead]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;
  
    if (!selectedChat || typeof selectedChat !== "string") {
      console.error("Invalid chatId:", selectedChat);
      return;
    }
  
    await sendMessage(selectedChat, session?.user?.id, text);

    if (!isOnline) {
      const user = Array.from(participants).filter(
        (participant) => participant.userId === userId
      )
      await axios.post("/api/notifications", {
        userId: targetUserId,
        senderId: userId,
        description: `${user[0].user.fullname} ส่งข้อความใหม่`,
        referId: selectedChat,
        path: 'message',
        subpath: '',
        url: `${window.location.origin}messager/${selectedChat}`,
        type: 'message'
      })
    }
    setText("");
    setReplyTo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInfo = () => {

  }

  // ฟังก์ชันคัดลอกข้อความ
  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message.message);
    alert("คัดลอกข้อความเรียบร้อย");
  };

  // ฟังก์ชันอ้างอิงข้อความ
  const handleReplyMessage = (message) => {
    setReplyTo(message);
  };

  // ฟังก์ชันลบข้อความ
  const handleDeleteMessage = (message) => {
    if (message.senderId === userId) {
      deleteMessage(selectedChat, message.id);
    } else {
      alert("คุณสามารถลบข้อความของตัวเองเท่านั้น");
    }
  };

  // ฟังก์ชันเปิดเมนูเมื่อกดค้าง
  const handleLongPress = (e, message) => {
    e.preventDefault();
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    setMenuMessage(message);
    setMenuPosition({ x, y });
  };

  // ฟังก์ชันปิดเมนู
  const closeMenu = () => setMenuMessage(null);

  // ใช้ effect เพื่อตรวจจับคลิกข้างนอกเมนู
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between w-full h-screen">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full px-2 py-4 bg-gray-300">
        <IoIosArrowBack className="text-xl cursor-pointer text-[#0056FF]" onClick={handleClose} size={25} />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{ nameRoom || "Chat Room"}</span>
          <div className="flex flex-row items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isTargetOnline ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-xs">{isTargetOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
        <FiInfo 
          onClick={handleInfo} 
          className="text-xl cursor-pointer text-[#0056FF]" 
          size={25} 
        />
      </div>

      {/* Chat Window */}
      <div className="flex flex-col p-2 h-full w-full gap-2 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"} w-full gap-2`}
            onContextMenu={(e) => handleLongPress(e, msg)}
          >
            {msg.senderId !== session?.user?.id && (
              <Avatar 
                src={msg.user.pictureUrl} 
                size={30} 
                userId={msg.user.userId} 
              />
            )}
            <div
              className={`flex max-w-xs ${
                msg.senderId === session?.user?.id
                  ? "bg-[#0056FF] text-white self-end"
                  : "bg-gray-300 text-black self-start"
              } px-4 py-2 rounded-lg`}
            >
              <span>{msg.deleted ? "ข้อความนี้ถูกลบ" : msg.message}</span>
              
            </div>
            <div className={`flex flex-row text-xs text-gray-500 ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}>
              {msg.reader && msg.senderId !== session?.user?.id && (
                <span className="text-xs text-gray-500 ml-2">อ่านแล้ว</span>
              )}
              <span className="text-xs">
                <Time timestamp={msg.createdAt} />
              </span>
            </div>
          </div>
        ))}

        {/* แสดงเมนู popup */}
        {menuMessage && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`,
            }}
          >
            <MessagePopupMenu
              message={menuMessage}
              onCopy={handleCopyMessage}
              onReply={handleReplyMessage}
              onDelete={handleDeleteMessage}
              closeMenu={closeMenu}
            />
          </div>
        )}

        {/* แสดงข้อความที่อ้างอิง */}
        {replyTo && (
          <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-xs text-gray-500">อ้างอิง: {replyTo.message}</p>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="flex flex-row items-center justify-between w-full px-2 py-4 gap-2">
        <GoPaperclip className="text-[#0056FF]" size={30} />
        <input
          id="text"
          type="text"
          placeholder="พิมพ์ข้อความ"
          className="p-1 border border-gray-300 rounded-xl text-sm w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <RiEmojiStickerLine className="text-[#0056FF]" size={30} />
        <button onClick={handleSendMessage} className="p-2 bg-[#0056FF] text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};
