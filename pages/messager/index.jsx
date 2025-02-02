import { useState, useEffect, forwardRef, useCallback, useMemo } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import { FaCirclePlus } from "react-icons/fa6";
import { Slide, Dialog, CircularProgress, Menu, MenuItem, Button } from "@mui/material";
import Avatar from "@/components/utils/Avatar";
import { AppLayout } from "@/themes";
import Modal from "@/components/Modal";
import Swal from "sweetalert2";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import Time from "@/components/utils/Time";
import Contacts from "@/components/messager/Contacts";
import { IoChatbubbleSharp } from "react-icons/io5";
import { IoMdContacts } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";

moment.locale("th");

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('messager');
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { listenUserChats, deleteConversation } = useFirebaseChat();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  // Load user data and chats
  useEffect(() => {
    if (userId && chats.length === 0) {
      listenUserChats(userId, setChats);
    }
  }, [userId, listenUserChats, chats.length]);

  const handleOpen = (chatId) => {
    return router.replace("/messager/" + chatId);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };
  
  const filteredChats = useMemo(() => {
    if (!search) return chats;
    
    return chats.filter((chat) => {
      // ค้นหาจากชื่อผู้ใช้
      const userMatch = chat.participants.users.some(
        (user) =>
          user.userId !== userId &&
          user?.user?.fullname?.toLowerCase().includes(search)
      );
  
      // ค้นหาจากข้อความล่าสุด
      const messageMatch =
        chat.lastMessage?.message?.toLowerCase().includes(search) || false;
  
      return userMatch || messageMatch; // ถ้ามี match อย่างใดอย่างหนึ่งก็แสดงผล
    });
  }, [chats, search, userId]);
  

  const handleDeleteConversation = async (chatId) => {
    handleClose();
    try {
      const result = await Swal.fire({
        title: "ลบข้อความ",
        text: "คุณต้องการลบข้อความนี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ลบข้อความ",
        cancelButtonText: "ยกเลิก",
      });
  
      if (result.isConfirmed) {
        setLoading(true);
        await deleteConversation(chatId, userId);
  
        // Remove the deleted chat from the state
        setChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
        Swal.fire("ลบข้อความสำเร็จ", "", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("ลบข้อความไม่สำเร็จ", "", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <CircularProgress />;

  return (
    <div className="flex flex-col bg-gray-300 w-full h-screen">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full px-4 py-3">
        <h1 className="text-md font-bold">Massager</h1>
        <div className={`flex flex-row items-center gap-4 text-gray-500`}>
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeTab === 'messager' ? 'text-[#0056FF] font-bold' : ''}`}
            onClick={() => handleTabClick('messager')}
          >
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 450">
                <g>
                  <path fill="currentColor" d="M480.05,338.74c49.48-69.42,41.91-164.52-25.67-226.47-30.88-28.31-70.24-45.93-112.76-50.85-.27-.33-.54-.65-.83-.96C303.8,22.04,250.66,0,194.99,0,89.05,0,0,78.93,0,180c0,35.43,11.01,69.4,31.92,98.74L2.71,370.45c-1.84,5.76-.03,12.07,4.58,15.98,4.62,3.92,11.13,4.68,16.51,1.94l88.83-45.17c18.24,7.86,37.59,13.01,57.62,15.35,38.64,40.64,92.07,61.44,146.74,61.44,28.42,0,56.73-5.79,82.36-16.8l88.83,45.17c2.15,1.09,4.48,1.63,6.8,1.63,10.12,0,17.38-9.86,14.3-19.55l-29.21-91.71ZM118.68,313.02c-4.2-1.99-9.09-1.93-13.23.18l-63.27,32.17,20.66-64.87c1.5-4.72.58-9.88-2.47-13.79-19.87-25.43-30.37-55.42-30.37-86.72C30,97.29,104.01,30,194.99,30c36.64,0,71.9,11.1,100.51,31.09-96.35,9.69-173.51,84.94-173.51,178.91,0,29.23,7.49,57.37,21.62,82.58-8.55-2.55-16.88-5.73-24.93-9.55h0ZM406.52,373.2c-4.08-2.08-8.98-2.2-13.23-.18-23.39,11.11-49.77,16.98-76.31,16.98-90.98,0-164.99-67.29-164.99-150s74.01-150,164.99-150,164.99,67.29,164.99,150c0,31.3-10.5,61.29-30.37,86.71-3.05,3.9-3.98,9.07-2.47,13.79l20.66,64.87-63.27-32.17Z"/>
                  <circle fill="currentColor" cx="255.98" cy="240" r="15" transform="translate(-21.92 454.23) rotate(-80.78)"/>
                  <circle fill="currentColor" cx="315.98" cy="240" r="15"/>
                  <circle fill="currentColor" cx="375.98" cy="240" r="15"/>
                </g>
            </svg>
            <span className="text-xs">Massage</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeTab === 'contacts' ? 'text-[#0056FF] font-bold' : ''}`}
            onClick={() => handleTabClick('contacts')}
          >
            <svg className="w-6 h-6 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 506.15 426.04">
                  <g>
                    <g>
                      <g>
                        <path fill="currentColor" d="M40.5,122.08c0,51.46,41.84,93.33,93.33,93.33,123.5-4.37,123.46-182.29,0-186.63-51.46,0-93.33,41.84-93.33,93.33v-.03ZM196.02,122.08c-2.61,82.21-121.83,82.21-124.41,0,2.61-82.21,121.83-82.21,124.41,0Z"/>
                        <path fill="currentColor" d="M133.64,33.64c-48.59,0-88.24,39.65-88.24,88.44s39.65,88.44,88.44,88.44c42.17-1.5,87.72-29.81,87.72-88.44s-45.56-86.94-87.89-88.41l-.03-.03ZM133.8,188.6h0c-31.31,0-65.65-20.77-67.08-66.4,1.43-45.92,35.81-66.69,67.11-66.69h0c31.31,0,65.65,20.77,67.08,66.4v.33c-1.43,45.62-35.81,66.4-67.11,66.4v-.03Z"/>
                      </g>
                      <g>
                        <path fill="currentColor" d="M249.86,425.88c-8.09-.78-14.02-8.02-14.02-16.14v-19.27c0-55.7-43.6-102.85-99.27-104.52s-105.5,44.84-105.5,102.33v20.32c0,8.22-6,15.59-14.15,16.31-9.23.78-16.92-6.46-16.92-15.49v-18.62c0-72.89,57.39-134.23,130.28-135.95,72.89-1.73,136.7,58.76,136.7,133.44v22.11c0,9.1-7.79,16.37-17.09,15.49h-.03Z"/>
                        <path fill="currentColor" d="M133.41,281.02c1.08,0,2.18,0,3.29.07,57.36,1.7,104.03,50.77,104.03,109.41v19.27c0,5.8,4.21,10.76,9.59,11.28h0c3.07.29,5.97-.68,8.22-2.71,2.22-2.02,3.49-4.89,3.49-7.89v-22.11c0-34.86-13.79-67.54-38.81-91.96-25.01-24.43-57.98-37.4-92.88-36.59-69.2,1.63-125.49,60.43-125.49,131.06v18.62c0,3.03,1.24,5.8,3.46,7.86s5.12,3.03,8.15,2.77c5.45-.46,9.69-5.48,9.69-11.41v-20.32c0-29.22,11.58-56.55,32.61-76.96,20.22-19.63,46.6-30.33,74.65-30.33v-.07Z"/>
                      </g>
                    </g>
                    <g>
                      <g>
                        <path fill="currentColor" d="M279.74,93.3c0,51.46,41.84,93.33,93.33,93.33,123.5-4.37,123.46-182.29,0-186.63-51.46,0-93.33,41.84-93.33,93.33v-.03ZM435.29,93.3c-2.61,82.21-121.83,82.21-124.41,0,2.61-82.21,121.83-82.21,124.41,0Z"/>
                        <path fill="currentColor" d="M372.9,4.86c-48.59,0-88.24,39.65-88.24,88.44s39.65,88.44,88.44,88.44c42.17-1.5,87.72-29.81,87.72-88.44S415.27,6.36,372.94,4.86h-.03ZM373.07,159.83h0c-31.31,0-65.65-20.77-67.08-66.4,1.43-45.92,35.81-66.69,67.11-66.69h0c31.31,0,65.65,20.77,67.08,66.4v.33c-1.43,45.62-35.81,66.4-67.11,66.4v-.03Z"/>
                      </g>
                      <g>
                        <path fill="currentColor" d="M490.66,402.71c-8.58,0-15.56-6.98-15.56-15.56v-27.65c0-56.45-45.92-102.4-102.4-102.4s-102.4,45.92-102.4,102.4v23.41c0,8.58-6.95,15.56-15.56,15.56s-15.56-6.98-15.56-15.56v-23.41c0-73.6,59.87-133.48,133.48-133.48s133.48,59.87,133.48,133.48v27.65c0,8.58-6.95,15.56-15.56,15.56h.07Z"/>
                        <path fill="currentColor" d="M372.71,252.24c59.16,0,107.29,48.13,107.29,107.29v27.65c0,5.87,4.79,10.66,10.66,10.66s10.66-4.79,10.66-10.66v-27.65c0-70.9-57.69-128.58-128.58-128.58s-128.58,57.69-128.58,128.58v23.41c0,5.87,4.79,10.66,10.66,10.66s10.66-4.79,10.66-10.66v-23.41c0-59.16,48.13-107.29,107.29-107.29h-.07Z"/>
                      </g>
                    </g>
                    <path fill="currentColor" d="M488.05,409.1h-231.68c-9.84,0-17.82-7.34-17.82-16.39s7.98-16.39,17.82-16.39h231.68c9.84,0,17.82,7.34,17.82,16.39s-7.98,16.39-17.82,16.39Z"/>
                    <path fill="currentColor" d="M249.23,426.04H18.22c-9.81,0-17.77-7.34-17.77-16.39s7.95-16.39,17.77-16.39h231.01c9.81,0,17.77,7.34,17.77,16.39s-7.96,16.39-17.77,16.39Z"/>
                  </g>
            </svg>
            <span className="text-xs">Contacts</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col w-full h-full pb-20 bg-white">
        {activeTab === 'messager' && (
          <div className="flex flex-col bg-white w-full h-full">
            {/* Search */}
            <div className="flex flex-row items-center w-full p-2 px-4">
              <input
                type="text"
                placeholder="ค้นหา"
                className="w-full p-2 border border-gray-300 rounded-full bg-gray-200 text-sm"
                value={search}
                onChange={handleSearch}
              />
            </div>
    
            {/* Chats */}
            <div className="flex flex-col w-full px-2 overflow-y-auto">
              {filteredChats.map((chat, index) => {
                const otherUser = chat.participants.users.find(
                  (participant) => participant.userId !== userId
                );
    
                if (!otherUser) return null;
    
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between w-full gap-2 p-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div 
                      className="flex flex-row items-center w-full gap-2"
                      onClick={() => handleOpen(chat.chatId)}
                    >
                      <div className="relative">
                        <Avatar 
                          src={otherUser.user.pictureUrl || "/default-avatar.png"} 
                          size={40} 
                          userId={otherUser.userId}
                        />
                        {chat.unreadCount > 0 && (
                          <div className="absolute top-0 right-0 flex items-center justify-center text-xs bg-red-500 text-white p-1 w-4 h-4 rounded-full">
                            <span>{chat.unreadCount}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">
                          {otherUser.user.fullname || "Unknown User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage?.message || "No messages yet"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">
                        <Time timestamp={chat.updatedAt} />
                      </span> 
                      </div>
                      <div>
                      
                        <BsThreeDotsVertical 
                          size={20} 
                          className="text-gray-400 ml-auto" 
                          onClick={handleClick}
                        />

                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem 
                            onClick={() => handleDeleteConversation(chat.chatId, userId)}
                          >
                            <div className="flex flex-row items-center gap-2">
                              <RiDeleteBin5Line />
                                Delete
                            </div>
                          </MenuItem>
                        </Menu>
                      </div>

                    
                  </div>
                );
              })}
            </div>
          </div>
          )}

        {activeTab === 'contacts' && (
          <Contacts />
        )}
      </div>
    </div>
  );
}

Messages.getLayout = (page) => <AppLayout>{page}</AppLayout>;
