import { useState, useEffect } from "react";
import { database } from "@/lib/firebase"; // Firebase Client
import { ref, push, onValue, update } from "firebase/database"; // Firebase Realtime Database APIs
import { useSession } from "next-auth/react";
import { IoIosArrowBack } from "react-icons/io";
import { FiInfo } from "react-icons/fi";
import { RiEmojiStickerLine } from "react-icons/ri";
import { GoPaperclip } from "react-icons/go";
import Avatar from "../utils/Avatar";
import { RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";

const MessageWindows =({ selectedChat, handleClose, name, mutate }) => {
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null); // สถานะสำหรับข้อความที่กำลังตอบกลับ
  const [text, setText] = useState("");
  const { data: session } = useSession();

  // Listener สำหรับดึงข้อความแบบเรียลไทม์
  useEffect(() => {
    if (!selectedChat) return;

    const messagesRef = ref(database, `chats/${selectedChat}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setMessages(messagesArray);

        // อัปเดต reader = true สำหรับข้อความที่ผู้ใช้อื่นส่งมา
        messagesArray.forEach((msg) => {
          if (msg.senderId !== session?.user?.id && !msg.reader) {
            update(ref(database, `chats/${selectedChat}/messages/${msg.id}`), {
              reader: true,
            });
          }
        });
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [selectedChat, session?.user?.id]);

  // ฟังก์ชันสำหรับส่งข้อความและบันทึก Notification
  const handleSendMessage = async () => {
    if (!text.trim()) return;

    try {
      // สร้าง Message Data
      const messageData = {
        text,
        senderId: session?.user?.id,
        timestamp: new Date().toISOString(),
        reader: false,
      };

      // บันทึกข้อความใน Firebase
      const messageRef = ref(database, `chats/${selectedChat}/messages`);
      await push(messageRef, messageData);

      // สร้าง Notification Data
      const notificationData = {
        userId: name, // ระบุ userId ที่จะได้รับการแจ้งเตือน
        senderId: session?.user?.id,
        text,
        pictureUrl: session?.user?.image,
        fullname: session?.user?.name,
        empId: session?.user?.empId, // เพิ่ม field empId (ปรับตาม structure ของ session)
        chatId: selectedChat,
        createdAt: new Date().toISOString(),
        read: false,
      };

      // บันทึก Notification ใน Firebase
      const notificationRef = ref(database, `notifications/${name}`);
      await push(notificationRef, notificationData);

      mutate(); // Refresh data
    } catch (error) {
      console.error("Error sending message or creating notification:", error);
    } finally {
      setText(""); // Clear the input field
    }
  };

  // ฟังก์ชันอัปเดต Notification เมื่อผู้ใช้เข้ามาใน Chat Room
  const markNotificationsAsRead = async (chatId) => {
    try {
      const notificationsRef = ref(database, `notifications/${session?.user?.id}`);
      const snapshot = await get(notificationsRef);
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach((child) => {
          const notification = child.val();
          if (notification.chatId === chatId && !notification.read) {
            updates[`${child.key}/read`] = true;
          }
        });
  
        if (Object.keys(updates).length > 0) {
          await update(notificationsRef, updates);
        }
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  useEffect(() => {
    if (selectedChat && session?.user?.id) {
      markNotificationsAsRead();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, session?.user?.id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleLongPress = (msg) => {
    // เปิดเมนูตัวเลือก
    const menuOptions = [
      {
        label: "คัดลอก",
        icon: <RiFileCopyLine />,
        action: () => {
          navigator.clipboard.writeText(msg.text);
          alert("คัดลอกข้อความเรียบร้อยแล้ว");
        },
      },
      {
        label: "ตอบกลับ",
        icon: <RiReplyLine />,
        action: () => {
          setReplyTo(msg); // ตั้งค่าข้อความที่กำลังตอบกลับ
        },
      },
      {
        label: "ลบ",
        icon: <RiDeleteBinLine />,
        action: async () => {
          const confirmDelete = window.confirm("คุณต้องการลบข้อความนี้หรือไม่?");
          if (confirmDelete) {
            await update(ref(database, `chats/${selectedChat}/messages/${msg.id}`), {
              text: "ข้อความนี้ถูกลบ",
              deleted: true, // เพิ่มสถานะข้อความที่ถูกลบ
            });
          }
        },
      },
    ];
  
    // แสดงเมนู (ปรับ UI เองตามต้องการ)
    console.log(menuOptions);
  };

  return (
    <div className="flex flex-col justify-between w-full h-screen">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full px-2 py-4 bg-gray-300">
        <IoIosArrowBack
          className="text-xl cursor-pointer text-[#0056FF]"
          onClick={handleClose}
          size={25}
        />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{name ? name : "Chat Room"}</span>
        </div>
        <FiInfo className="text-xl cursor-pointer text-[#0056FF]" size={25} />
      </div>

      {/* Chat Window */}
      <div className="flex flex-col p-2 h-full w-full gap-2 overflow-y-auto">
        {messages.map((msg) => (
        <div
            key={msg.id}
            className={`flex ${
            msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
            } w-full gap-2`}
            onContextMenu={(e) => {
            e.preventDefault();
            handleLongPress(msg); // เรียกเมนูเมื่อกดค้าง
            }}
        >
            {msg.senderId !== session?.user?.id && (
            <Avatar
                src={session?.user?.image}
                size={30}
                url={`/p/${msg.senderId}`}
            />
            )}
            <div
            className={`flex max-w-xs ${
                msg.senderId === session?.user?.id
                ? "bg-[#0056FF] text-white self-end"
                : "bg-gray-300 text-black self-start"
            } px-4 py-2 rounded-lg`}
            >
            {/* แสดงข้อความที่ถูกลบ */}
            <span>{msg.deleted ? "ข้อความนี้ถูกลบ" : msg.text}</span>
            {msg.reader && msg.senderId !== session?.user?.id && (
                <span className="text-xs text-gray-500 ml-2">อ่านแล้ว</span>
            )}
            </div>
        </div>
        ))}

        {/* แสดงข้อความที่กำลังตอบกลับ */}
        {replyTo && (
        <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-xs text-gray-500">ตอบกลับ: {replyTo.text}</p>
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
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
        />
        <RiEmojiStickerLine className="text-[#0056FF]" size={30} />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-[#0056FF] text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageWindows;
