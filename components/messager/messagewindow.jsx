import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiInfo } from "react-icons/fi";
import {
  RiEmojiStickerLine,
  RiDeleteBinLine,
  RiReplyLine,
  RiFileCopyLine,
} from "react-icons/ri";
import { GoPaperclip } from "react-icons/go";
import Avatar from "../utils/Avatar";
import { useSession } from "next-auth/react";
import { database } from "@/lib/firebase"; // Firebase setup file
import { ref, onValue, push, update, set, get } from "firebase/database";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import Time from "../utils/Time";
import axios from "axios";
import MessagePopupMenu from "./MessagePopupMenu";
import {
  Alert,
  Snackbar,
  AvatarGroup,
  Avatar as MUIAvatar,
} from "@mui/material";
import Swal from "sweetalert2";
import { IoIosCloseCircleOutline } from "react-icons/io";
import StickerPanel from "../stickers/StickerPanel";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Image from "next/image";
import { AiOutlinePicture } from "react-icons/ai";
import { upload } from "@vercel/blob/client";
import { nanoid } from "nanoid";
import ReactPlayer from "react-player";
import { IoCloseCircle } from "react-icons/io5";
import { TbZoomPan } from "react-icons/tb";
import { uploadFileToFirebase } from "@/lib/uploadFileToFirebase";
import moment from "moment";
import "moment/locale/th";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/router";
import { useNotify } from "@/lib/hook/useNotify";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [user, setUser] = useState(null);
  const [menuMessage, setMenuMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false); // สำหรับแสดงข้อความแจ้งเตือนการคัดลอก
  const [alertMessage, setAlertMessage] = useState(""); // ข้อความที่จะแสดงใน Snackbar
  const [openSticker, setOpenSticker] = useState(false); // สถานะเปิดปิดของปุ่มสติกเกอร์
  const [sticker, setSticker] = useState(null); // สติกเกอร์ที่ถูกเลือก
  const [isUplaoding, setIsUploading] = useState(false); // สถานะการอัปโหลดไฟล์
  const [files, setFiles] = useState(null); // ไฟล์ที่อัปโหลด
  const [image, setImage] = useState(null); // สถานะของรูปภาพที่ถูกเลือก
  const [video, setVideo] = useState(null); // สถานะของวิดีโอที่ถูกเลือก
  const [openInfo, setOpenInfo] = useState(false); // สถานะเปิดปิดของปุ่มข้อมูล
  const [openImage, setOpenImage] = useState(false); // สถานะเปิดปิดของปุ่มรูปภาพ
  const [openVideo, setOpenVideo] = useState(false); // สถานะเปิดปิดของปุ่มวิดีโอ
  const [currentMedia, setCurrentMedia] = useState(null); // สถานะของไฟล์ที่ถูกเลือก
  const { toastify } = useNotify();

  const router = useRouter();

  const chatWindowRef = useRef(null); // สำหรับเลื่อนหน้าแชท
  const messageRefs = useRef({});
  const menuRef = useRef(null); // ใช้ตรวจจับคลิกข้างนอกเมนู
  const longPressTimeout = useRef(null);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const {
    messages,
    participants,
    conversation,
    listenToChat,
    sendMessage,
    deleteMessage,
    readMessage,
    replyMessage,
    likeMessage,
  } = useFirebaseChat();

  // ฟังก์ชันดึงข้อความในบทสนทนา
  useEffect(() => {
    if (!selectedChat) return;

    const unsubscribe = listenToChat(selectedChat);

    return () => unsubscribe();
  }, [selectedChat, listenToChat]);

  useEffect(() => {
    if (participants) {
      const participantsArray = Array.isArray(participants)
        ? participants
        : Array.from(participants || []);

      const otherParticipants = participantsArray.filter(
        (participant) => participant.userId !== session?.user?.id
      );

      const userIds = participantsArray.filter(
        (participant) => participant.userId === session?.user?.id
      );

      setUser(userIds[0]);

      if (otherParticipants.length > 0) {
        setNameRoom(
          otherParticipants
            .map((participant) => participant.user?.fullname || "Unknown")
            .join(", ")
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
        const chatRef = ref(
          database,
          `chats/${selectedChat}/conversation/messages`
        );

        try {
          const snapshot = await get(chatRef);
          if (snapshot.exists()) {
            const messages = snapshot.val();

            const unreadMessages = Object.entries(messages).filter(
              ([, message]) =>
                !message.isRead && !message.readBy?.includes(userId)
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
      setTimeout(() => {
        chatWindowRef.current.scrollTop = chatWindowRef?.current?.scrollHeight;
      }, 100); // ปรับ delay เล็กน้อยเพื่อให้ UI โหลดทัน
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChat || !userId) return;

    const notiRef = ref(database, `notifications`);
    const unsubscribe = onValue(notiRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const allNotifications = snapshot.val();
      const targetNotis = Object.entries(allNotifications).filter(
        ([id, noti]) =>
          noti.userId === userId &&
          noti.referId === selectedChat &&
          noti.type === "message" &&
          !noti.isReading
      );

      // ถ้ามี noti ค้างอยู่ ให้แจ้งเตือนและอัปเดตสถานะ
      for (const [notiId] of targetNotis) {
        await set(ref(database, `notifications/${notiId}/isReading`), true);
      }
    });

    return () => unsubscribe();
  }, [selectedChat, userId]);

  // เพิ่ม toast เมื่อตรวจสอบว่า user อยู่ใน component นี้
  useEffect(() => {
    if (selectedChat && userId) {
      toastify.success("คุณกำลังอ่านข้อความอยู่ในห้องแชทนี้แล้ว");
    }
  }, [selectedChat, userId]);

  const notifyAbsentUsers = async () => {
    if (!participants || !selectedChat || !userId || !user) return;

    for (const participant of participants) {
      const participantId = participant.userId;
      if (participantId === userId) continue; // ข้ามตัวเอง

      const presenceRef = ref(
        database,
        `presence/${participantId}/currentChatId`
      );
      const snapshot = await get(presenceRef);
      const isInChat = snapshot.exists() && snapshot.val() === selectedChat;

      if (!isInChat) {
        await axios.post("/api/notifications", {
          userId: participantId,
          senderId: userId,
          description: `${user?.user?.fullname} ได้ส่งข้อความให้คุณ`,
          referId: selectedChat,
          path: "messager",
          subpath: "",
          url: `${window.location.origin}/messager/${selectedChat}`,
          type: "message",
        });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !sticker && !files && !image && !video) return;

    if (!selectedChat || typeof selectedChat !== "string") {
      console.error("Invalid chatId:", selectedChat);
      return;
    }

    const extraData = {};

    if (sticker) extraData.sticker = sticker;
    if (files) extraData.files = files;
    if (image) extraData.image = image;
    if (video) extraData.video = video;

    if (replyTo) {
      await replyMessage(
        selectedChat,
        userId,
        text,
        replyTo.id,
        "text",
        extraData
      );
      setReplyTo(null);
    } else {
      await sendMessage(selectedChat, userId, text, "text", extraData);
    }

    await notifyAbsentUsers();

    setText("");
    setSticker(null);
    setFiles(null);
    setImage(null);
    setVideo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const handleOpenImage = (media) => {
    setCurrentMedia(media);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setCurrentMedia(null);
    setOpenImage(false);
  };

  const handleOpenVideo = (media) => {
    setCurrentMedia(media);
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setCurrentMedia(null);
    setOpenVideo(false);
  };

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

  // ฟังก์ชันกดถูกใจข้อความ
  const handleLikeMessage = async (message) => {
    await likeMessage(selectedChat, message.id, userId);
  };

  // การเปิดเมนูเมื่อกดค้าง
  const handleLongPressStart = (e, message) => {
    e.preventDefault(); // ป้องกันการเปิด context menu บนมือถือ
    longPressTimeout.current = setTimeout(() => {
      // ตรวจสอบตำแหน่งของข้อความที่กด
      const messageRef = messageRefs.current[message.id];
      if (!messageRef?.getBoundingClientRect) return;

      const rect = messageRef.getBoundingClientRect();
      const x = rect.left + rect.width / 2; // กึ่งกลางข้อความ
      const y = rect.bottom + 10; // ใต้ข้อความ

      setMenuMessage(message);
      setMenuPosition({ x, y });
    }, 500); // ตั้งเวลาว่าเมื่อกดค้าง 500ms ให้เปิดเมนู
  };

  const handleLongPressEnd = () => {
    clearTimeout(longPressTimeout.current); // ถ้าปล่อยก่อน 500ms ให้ยกเลิก
  };

  // ฟังก์ชันปิดเมนู
  const closeMenu = () => setMenuMessage(null);

  // ปิด Snackbar
  const handleSnackbarClose = () => setSnackbarOpen(false);

  // ใช้ effect เพื่อตรวจจับคลิกข้างนอกเมนู
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuMessage) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuMessage]);

  const handleDeletedReply = () => {
    setReplyTo(null);
  };

  const handleOpenSticker = () => {
    setOpenSticker(true);
  };

  const handleCloseSticker = () => {
    setOpenSticker(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
  };

  const handleUploadImage = () => {
    imageInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
  };

  const handleFileChange = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    // อัปโหลดไฟล์ไปยัง Firebase Storage
    const uploadedFile = await uploadFileToFirebase(file, selectedChat);

    const fileType = uploadedFile.file_name.split(".").pop();
    let type = "";
    if (fileType === "xlsx" || fileType === "xls") {
      type = "excel";
    } else if (fileType === "docx" || fileType === "doc") {
      type = "word";
    } else if (fileType === "pptx" || fileType === "ppt") {
      type = "powerpoint";
    } else if (fileType === "pdf") {
      type = "pdf";
    } else {
      type = "files";
    }

    if (uploadedFile) {
      const uploadData = {
        public_id: uploadedFile.file_id,
        url: uploadedFile.url,
        file_name: uploadedFile.file_name,
        mime_type: uploadedFile.mime_type,
        file_size: uploadedFile.file_size,
        type: type,
        folder: "files",
        userId,
      };
      // บันทึกข้อมูลลง Firestore หรือ MongoDB (เลือกใช้ตามระบบของคุณ)
      await axios.post("/api/upload/save", uploadData);

      // เพิ่มไฟล์ที่อัปโหลดทั้งหมดใน state files
      setFiles(uploadData);
    }

    setIsUploading(false);
    fileInputRef.current.value = ""; // รีเซ็ตค่า input
  };

  const getFileIcon = (type) => {
    const fileType = type;
    if (!fileType) return "/images/iconfiles/other.png";

    if (fileType === "pdf") return "/images/iconfiles/pdf.png";
    if (fileType === "msword" || fileType.includes("doc"))
      return "/images/iconfiles/doc.png";
    if (fileType === "excel" || fileType.includes("spreadsheet"))
      return "/images/iconfiles/xls.png";
    if (fileType === "presentation" || fileType.includes("powerpoint"))
      return "/images/iconfiles/ppt.png";

    return "/images/iconfiles/other.png";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const handleMultipleImageChange = async (e) => {
    setIsUploading(true); // เริ่มการอัปโหลด
    const fileArray = Array.from(e.target.files); // แปลง FileList เป็น array

    const uploadPromises = fileArray.map(async (file) => {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });

      const mediaEntry = {
        url: newBlob.url,
        public_id: nanoid(10),
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        type: file.type.startsWith("image") ? "image" : "video",
        userId,
      };

      // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
      await axios.post("/api/upload/save", mediaEntry);

      return mediaEntry;
    });

    // รอการอัปโหลดทั้งหมดเสร็จสิ้น
    const uploadedMedia = await Promise.all(uploadPromises);

    // แยก Image และ Video
    const uploadedImages = uploadedMedia.filter(
      (file) => file.type === "image"
    );
    const uploadedVideos = uploadedMedia.filter(
      (file) => file.type === "video"
    );

    // อัปเดต state สำหรับ Image และ Video
    setImage((prev) => [...(prev || []), ...uploadedImages]);
    setVideo((prev) => [...(prev || []), ...uploadedVideos]);

    setIsUploading(false);

    // รีเซ็ตค่า input
    imageInputRef.current.value = "";
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
          <span className="text-lg font-bold">{nameRoom || "Chat Room"}</span>
          <div className="flex flex-row items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isTargetOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs">
              {isTargetOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <FiInfo
          onClick={handleOpenInfo}
          className="text-xl cursor-pointer text-[#0056FF]"
          size={25}
        />
      </div>

      {/* Chat Window */}
      <div
        className="flex flex-col px-2 h-full w-full pt-2 pb-20 overflow-y-auto"
        ref={chatWindowRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={(el) => (messageRefs.current[msg.id] = el)}
            className={`flex flex-col ${
              msg.senderId === session?.user?.id
                ? "justify-end"
                : "justify-start"
            } w-full gap-1`}
            onTouchStart={(e) => handleLongPressStart(e, msg)} // รองรับมือถือ
            onMouseDown={(e) => handleLongPressStart(e, msg)} // รองรับ Desktop
            onTouchEnd={handleLongPressEnd} // ยกเลิกถ้าปล่อยก่อนกำหนด
            onMouseUp={handleLongPressEnd} // ยกเลิกถ้าปล่อยก่อนกำหนด
            onContextMenu={(e) => e.preventDefault()} // ปิดการใช้งานคลิกขวา
          >
            {/* แสดงข้อความที่อ้างอิง */}
            {msg.replyId && (
              <div
                className={`relative flex flex-col px-2 py-1 bg-gray-200 text-gray-500 rounded-lg text-sm
                  ${
                    msg.senderId === userId
                      ? "justify-end self-end"
                      : "justify-start self-start"
                  }
                `}
              >
                <span className="text-xs">
                  {messages.find((m) => m.id === msg.replyId)?.message ||
                    "ข้อความถูกลบ"}
                </span>

                {/* ข้อความหลัก */}
                <div
                  className={`flex flex-row items-center gap-1 ${
                    msg.senderId === session?.user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.senderId !== session?.user?.id && (
                    <Avatar
                      src={msg.user?.pictureUrl}
                      size={30}
                      userId={msg.user?.userId}
                    />
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
                    <span>
                      {msg.isDeleted ? "ข้อความนี้ถูกลบ" : msg.message}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* ข้อความหลัก */}
            {!msg.replyId && (
              <div
                className={`flex flex-row items-center gap-1 ${
                  msg.senderId === session?.user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.senderId !== session?.user?.id && (
                  <Avatar
                    src={msg.user?.pictureUrl}
                    size={30}
                    userId={msg.user?.userId}
                  />
                )}
                <div
                  className={`flex max-w-xs ${
                    msg.senderId === session?.user?.id
                      ? msg.isDeleted
                        ? "text-xs self-end"
                        : msg.sticker || msg.image || msg.video || msg.files
                        ? "flex flex-col gap-1"
                        : "bg-[#0056FF] text-white self-end"
                      : msg.isDeleted
                      ? "text-xs self-end"
                      : "text-black self-start"
                  } px-2 py-1 rounded-lg`}
                >
                  <div className="flex flex-col gap-1">
                    <span>
                      {msg.isDeleted ? "ข้อความนี้ถูกลบ" : msg.message}
                    </span>
                    {msg.files && (
                      <div
                        className="flex flex-row items-center gap-1 bg-gray-100 rounded-md p-2 cursor-pointer"
                        onClick={() => router.push(msg.files.url, "_blank")}
                      >
                        <Image
                          src={getFileIcon(msg.files.type)}
                          alt="file-icon"
                          width={50}
                          height={50}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm">{msg.files.file_name}</span>
                          <span className="text-xs text-gray-500">
                            {msg.files.type}
                          </span>
                          <div className="flex flex-row items-center gap-1">
                            <span className="text-xs text-gray-500">ขนาด:</span>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(msg.files.file_size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.sticker && (
                      <Image
                        src={msg.sticker.url}
                        alt="sticker"
                        width={120}
                        height={120}
                        priority={true}
                      />
                    )}
                    {msg.image &&
                      msg.image.length > 0 &&
                      msg.image.map((image, index) => (
                        <div
                          key={index}
                          className="relative"
                          onClick={() => handleOpenImage(image)}
                        >
                          <Image
                            src={image.url}
                            alt="image"
                            width={120}
                            height={120}
                            priority={true}
                          />
                          <div className="absolute bottom-0 right-0 flex items-center justify-center bg-gray-500 bg-opacity-50 p-1 rounded-full">
                            <span className="text-white text-sm">
                              <TbZoomPan />
                            </span>
                          </div>
                        </div>
                      ))}
                    {msg.video &&
                      msg.video.length > 0 &&
                      msg.video.map((video) => (
                        <div
                          key={video.public_id}
                          className="relative"
                          onClick={() => handleOpenVideo(video)}
                        >
                          <video width="100" height="100" controls>
                            <source src={video.url} type={video.mime_type} />
                          </video>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {/* Like & Emotion */}
            <div
              className={`flex px-2 ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              {msg.likedUsers?.length > 0 && (
                <div className="flex flex-row text-xs text-gray-500 items-center gap-2">
                  <FaHeart size={15} className="text-red-500" />
                  {msg.likedUsers?.length > 1 && (
                    <AvatarGroup
                      renderSurplus={(surplus) => (
                        <span>+{surplus.toString()[0]}k</span>
                      )}
                      total={msg?.likedUsers?.length}
                      spacing="small"
                    >
                      {msg?.likedUsers?.map((user, userIndex) => (
                        <MUIAvatar
                          key={userIndex}
                          src={user.user.pictureUrl}
                          alt="avatar"
                          sx={{ width: 25, height: 25 }}
                        />
                      ))}
                    </AvatarGroup>
                  )}
                </div>
              )}
            </div>

            <div
              className={`flex flex-row text-xs text-gray-500 gap-2 ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-row justify-between gap-4 ${
                  msg.senderId === userId ? "self-end" : "self-start"
                }`}
              >
                <div className="flex flex-row items-center gap-1">
                  {Array.isArray(msg.readBy) &&
                    Array.from(msg.readBy).includes(targetUserId) &&
                    msg.senderId === userId && (
                      <span className="text-[9px] text-gray-500 mr-4">
                        อ่านแล้ว
                      </span>
                    )}
                </div>

                <div className="flex text-[9px]">
                  <Time timestamp={msg.createdAt} />
                </div>
              </div>
            </div>
            {/* Popup Menu แสดงอยู่ล่างข้อความ */}
            {menuMessage?.id === msg.id && (
              <div
                ref={menuRef}
                style={{
                  position: "absolute",
                  left: `${menuPosition.x}px`,
                  top: `${menuPosition.y}px`,
                  transform: "translate(-50%, 10px)",
                }}
              >
                <MessagePopupMenu
                  message={menuMessage}
                  onCopy={handleCopyMessage}
                  onReply={setReplyTo}
                  onDelete={handleDeleteMessage}
                  onLike={handleLikeMessage}
                  closeMenu={closeMenu}
                />
              </div>
            )}
          </div>
        ))}

        {/* Snackbar สำหรับแสดงผลแจ้งเตือน */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>

      {/* Chat Input */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-300">
        {/* Sticker Preview */}
        {sticker && (
          <div className="relative">
            <div className="relative flex flex-col items-center justify-center">
              <Image src={sticker.url} alt="sticker" width={100} height={100} />
              <IoCloseCircle
                size={20}
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() => setSticker(null)}
              />
            </div>
          </div>
        )}

        {/* Image Preview */}
        {image &&
          image.length > 0 &&
          image.map((image, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center justify-center"
            >
              <Image
                src={image.url}
                alt="Image"
                width={80}
                height={80}
                priority={true}
              />
              <IoCloseCircle
                size={20}
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() => setImage(null)}
              />
            </div>
          ))}

        {/* Video Preview */}
        {video && (
          <div className="relative">
            <video width="80" height="80" controls>
              <source src={video.url} type={video.mime_type} />
            </video>
            <IoCloseCircle
              size={20}
              className="absolute top-0 right-0 cursor-pointer"
              onClick={() => setVideo(null)}
            />
          </div>
        )}

        {/* File Preview */}
        {files && (
          <div className="flex flex-row justify-between items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white">
            <div className="flex flex-row items-center gap-2">
              <Image
                src={getFileIcon(files.type)}
                alt="file-icon"
                width={40}
                height={40}
              />
              <span className="text-sm">{files.file_name}</span>
            </div>
            <IoCloseCircle
              size={20}
              className="cursor-pointer"
              onClick={() => setFiles(null)}
            />
          </div>
        )}
        {/* Chat Input */}
        <div className="flex flex-row items-center  justify-between w-full px-2 py-2 gap-2 max-h-12">
          <GoPaperclip
            className="text-[#0056FF]"
            size={30}
            onClick={handleUploadClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className="flex flex-col w-full">
            {/* แสดงข้อความที่อ้างอิง */}
            {replyTo && (
              <div className="flex flex-col p-2 bg-gray-100 border border-gray-300 rounded-lg w-full">
                <div className="flex flex-row justify-between w-full">
                  <span className="text-xs text-gray-500">อ้างอิง:</span>
                  <IoIosCloseCircleOutline onClick={handleDeletedReply} />
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
          <AiOutlinePicture
            size={30}
            onClick={handleUploadImage}
            className="text-[#0056FF]"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleMultipleImageChange}
            multiple
            accept="image/*, video/*"
            style={{ display: "none" }}
          />
          <RiEmojiStickerLine
            onClick={handleOpenSticker}
            className="text-[#0056FF]"
            size={30}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-[#0056FF] text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
      <Dialog
        open={openSticker}
        onClose={handleCloseSticker}
        TransitionComponent={Transition}
      >
        <StickerPanel setSticker={setSticker} onClose={handleCloseSticker} />
      </Dialog>

      <Dialog
        open={openInfo}
        onClose={handleCloseInfo}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <div className="flex flex-col gap-2 rounded-lg bg-white h-full w-full pb-2">
          {/* Header */}
          <div className="flex flex-row justify-between bg-[#0056FF] items-center gap-2 w-full p-2">
            <span className="text-white">ข้อมูล</span>
            <IoCloseCircle
              size={20}
              className="cursor-pointer text-white"
              onClick={handleCloseInfo}
            />
          </div>
          {/* Participants */}
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-700 font-bold">
                วันที่สร้าง:
              </span>
              <span className="text-sm text-gray-500">
                {moment(conversation?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-700 font-bold">ผู้สร้าง:</span>
              <span className="text-sm text-gray-500">
                {conversation?.creator?.user?.fullname}
              </span>
            </div>
            <span className="text-xs text-gray-700 font-bold">ผู้เข้าร่วม</span>
            <div className="flex flex-row items-center gap-2">
              {participants &&
                Array.from(participants).map((participant) => (
                  <Avatar
                    key={participant.userId}
                    src={participant.user?.pictureUrl}
                    size={30}
                    userId={participant.userId}
                  />
                ))}
            </div>
          </div>
        </div>
      </Dialog>

      {/* แสดงรูปภาพ */}
      <Dialog
        open={openImage}
        onClose={handleCloseImage}
        TransitionComponent={Transition}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          "& .MuiDialog-paper": {
            maxWidth: "100%",
            maxHeight: "100%",
            overflow: "auto",
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor: "transparent",
          },
        }}
      >
        <div className="flex flex-col gap-2 h-full w-full pb-2">
          <div className="relative w-full h-full">
            <Image
              src={currentMedia?.url}
              alt="media"
              width={500}
              height={500}
              priority={true}
            />
            <IoCloseCircle
              size={30}
              className="absolute top-0 right-0 cursor-pointer text-[#F2F2F2]"
              onClick={handleCloseImage}
            />
          </div>
        </div>
      </Dialog>

      {/* แสดงวิดีโอ */}
      <Dialog
        open={openVideo}
        onClose={handleCloseVideo}
        TransitionComponent={Transition}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          "& .MuiDialog-paper": {
            maxWidth: "100%",
            maxHeight: "100%",
            overflow: "auto",
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor: "transparent",
          },
        }}
      >
        <div className="flex flex-col gap-2 h-full w-full pb-2">
          <div className="relative w-full h-full">
            <ReactPlayer
              url={currentMedia?.url}
              width="100%"
              height="100%"
              controls={true}
              playing={true}
            />
            <IoCloseCircle
              size={30}
              className="absolute top-0 right-0 cursor-pointer text-[#F2F2F2]"
              onClick={handleCloseVideo}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
