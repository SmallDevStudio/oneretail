import { useState, useEffect, useCallback, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiInfo } from "react-icons/fi";
import { RiEmojiStickerLine, RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";
import { GoPaperclip } from "react-icons/go";
import Avatar from "../utils/Avatar";
import { useSession } from "next-auth/react";
import { database } from "@/lib/firebase"; // Firebase setup file
import { ref, onValue, push, update, set, get } from 'firebase/database';
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import Time from "../utils/Time";
import axios from "axios";
import MessagePopupMenu from "./MessagePopupMenu";
import { Alert, Snackbar } from "@mui/material";
import Swal from "sweetalert2";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function MessageWindows({ selectedChat, handleClose }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameRoom, setNameRoom] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [menuMessage, setMenuMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false); // สำหรับแสดงข้อความแจ้งเตือนการคัดลอก
  const [alertMessage, setAlertMessage] = useState(""); // ข้อความที่จะแสดงใน Snackbar

  const chatWindowRef = useRef(null); // สำหรับเลื่อนหน้าแชท
  const menuRef = useRef(null); // ใช้ตรวจจับคลิกข้างนอกเมนู
  const {
    messages,
    participants,
    listenToChat,
    sendMessage,
    deleteMessage,
    readMessage,
    replyMessage,
  } = useFirebaseChat();

  // ฟังก์ชันดึงข้อความในบทสนทนา
  useEffect(() => {
    if (selectedChat) {
      setLoading(true); // เริ่มโหลด
      const unsubscribe = listenToChat(selectedChat);
      setLoading(false); // โหลดเสร็จ
  
      return () => unsubscribe(); // ยกเลิกการติดตามเมื่อออกจากหน้าแชท
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
    if (selectedChat && userId) {
      const markUnreadMessages = async () => {
        const chatRef = ref(database, `chats/${selectedChat}/conversation/messages`);

        try {
          const snapshot = await get(chatRef);
          if (snapshot.exists()) {
            const messages = snapshot.val();

            const unreadMessages = Object.entries(messages).filter(
              ([, message]) => !message.isRead && !message.readBy?.includes(userId)
            );

            await Promise.all(
              unreadMessages.map(([messageId]) =>
                readMessage(selectedChat, messageId, userId)
              )
            );
          }
        } catch (error) {
          console.error("Error marking unread messages:", error);
        }
      };

      markUnreadMessages();
    }
  }, [selectedChat, userId, readMessage]);

  // เลื่อนหน้าแชทไปยังข้อความล่าสุด
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;
  
    if (!selectedChat || typeof selectedChat !== "string") {
      console.error("Invalid chatId:", selectedChat);
      return;
    }
  
    if (replyTo) {
      // ถ้ามี replyTo ให้ใช้ replyMessage
      await replyMessage(selectedChat, userId, text, replyTo.id);
      setReplyTo(null); // เคลียร์ข้อความที่อ้างอิงหลังจากส่ง
      setText("");
    } else {
      // ถ้าไม่มี replyTo ให้ใช้ sendMessage
      await sendMessage(selectedChat, userId, text);
      setReplyTo(null); // เคลียร์ข้อความที่อ้างอิงหลังจากส่ง
      setText("");
    }
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
    setAlertMessage("คัดลอกข้อความเรียบร้อย");
    setSnackbarOpen(true); // เปิด Snackbar
  };

  // ฟังก์ชันลบข้อความ
  const handleDeleteMessage = async (message) => {
    if (message.senderId !== userId) {
      setAlertMessage("คุณสามารถลบข้อความของตัวเองเท่านั้น");
      setSnackbarOpen(true);
      return;
    }
  
    const result = await Swal.fire({
      title: "ยืนยันการลบข้อความ",
      text: "คุณต้องการลบข้อความนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบข้อความ",
      cancelButtonText: "ยกเลิก",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteMessage(selectedChat, message.id, userId);
        Swal.fire("ลบข้อความสำเร็จ", "ข้อความนี้ถูกลบ", "success");
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อความได้", "error");
        console.error("Error deleting message:", error);
      }
    }
  };
  
  // การเปิดเมนูเมื่อกดค้าง
  const handleLongPress = (e, message) => {
    e.preventDefault();
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    setMenuMessage(message); // กำหนดข้อความปัจจุบันสำหรับเมนู
    setMenuPosition({ x, y });
  };

  // ฟังก์ชันปิดเมนู
  const closeMenu = () => setMenuMessage(null);

  // ปิด Snackbar
  const handleSnackbarClose = () => setSnackbarOpen(false);


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

  const handleDeletedReply = () => {
    setReplyTo(null);
  }

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
      <div 
        className="flex flex-col p-2 h-full w-full gap-2 overflow-y-auto"
        ref={chatWindowRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"} w-full gap-2`}
            onContextMenu={(e) => handleLongPress(e, msg)}
          >
            {/* แสดงข้อความที่อ้างอิง */}
            {msg.replyId && (
              <div 
                className={`relative flex flex-col px-2 py-1 bg-gray-200 text-gray-500 rounded-lg text-sm
                  ${msg.senderId === userId ? "justify-end self-end" : "justify-start self-start"}
                `}>
                <span className="text-xs">
                {messages.find((m) => m.id === msg.replyId)?.message || "ข้อความถูกลบ"}
                </span>

                {/* ข้อความหลัก */}
                  <div
                    className={`flex flex-row items-center gap-1 ${
                      msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.senderId !== session?.user?.id && (
                      <Avatar src={msg.user?.pictureUrl} size={30} userId={msg.user?.userId} />
                    )}
                    <div
                      className={`flex max-w-xs ${
                        msg.senderId === session?.user?.id
                          ? msg.isDeleted
                            ? "text-xs text-gray-500 self-end"
                            : " text-black self-end"
                          : msg.isDeleted
                          ? "text-xs text-gray-500 self-end"
                          : " text-black self-start"
                      } px-4 py-1 rounded-lg`}
                    >
                      <span>{msg.isDeleted ? "ข้อความนี้ถูกลบ" : msg.message}</span>
                    </div>
                  </div>
              </div>
            )}
            {/* ข้อความหลัก */}
            {!msg.replyId && (
              <div
                className={`flex flex-row items-center gap-1 ${
                  msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
                }`}
              >
                {msg.senderId !== session?.user?.id && (
                  <Avatar src={msg.user?.pictureUrl} size={30} userId={msg.user?.userId} />
                )}
                <div
                  className={`flex max-w-xs ${
                    msg.senderId === session?.user?.id
                      ? msg.isDeleted
                        ? "text-xs text-gray-500 self-end"
                        : "bg-[#0056FF] text-white self-end"
                      : msg.isDeleted
                      ? "text-xs text-gray-500 self-end"
                      : "bg-gray-300 text-black self-start"
                  } px-4 py-1 rounded-lg`}
                >
                  <span>{msg.isDeleted ? "ข้อความนี้ถูกลบ" : msg.message}</span>
                </div>
              </div>
            )}
            <div className={`flex flex-row text-xs text-gray-500 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
              {Array.isArray(msg.readBy) && Array.from(msg.readBy).includes(targetUserId) && msg.senderId === userId && (
                  <span className="text-[9px] text-gray-500 mr-4">อ่านแล้ว</span>
                )}
              <div className="text-[9px]">
                <Time timestamp={msg.createdAt} />
              </div>
              
            </div>
          </div>
        ))}

        {/* Popup Menu */}
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
              onReply={setReplyTo}
              onDelete={handleDeleteMessage}
              closeMenu={closeMenu}
            />
          </div>
        )}

      {/* Snackbar สำหรับแสดงผลแจ้งเตือน */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      </div>

      {/* Chat Input */}
      <div className="flex flex-row items-center justify-between w-full px-2 py-4 gap-2">
        <GoPaperclip className="text-[#0056FF]" size={30} />
        <div className="flex flex-col w-full">
          {/* แสดงข้อความที่อ้างอิง */}
          {replyTo && (
            <div className="flex flex-col p-2 bg-gray-100 border border-gray-300 rounded-lg w-full"> 
             <div className="flex flex-row justify-between w-full">
              <span className="text-xs text-gray-500">อ้างอิง:</span>
              <IoIosCloseCircleOutline 
                onClick={handleDeletedReply}
              />
             </div>
              <span className="text-xs text-gray-500">{replyTo.message}</span>
        
                
        
            </div>
          )}
          <input
            id="text"
            type="text"
            placeholder="พิมพ์ข้อความ"
            className="p-1 border border-gray-300 rounded-xl text-sm w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <RiEmojiStickerLine className="text-[#0056FF]" size={30} />
        <button onClick={handleSendMessage} className="p-2 bg-[#0056FF] text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};
