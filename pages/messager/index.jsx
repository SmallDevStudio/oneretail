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
      <div className="flex flex-row items-center justify-between w-full px-4 py-2">
        <h1 className="text-md font-bold">Massager</h1>
        <div className={`flex flex-row items-center gap-4 text-gray-500`}>
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeTab === 'messager' ? 'text-[#0056FF] font-bold' : ''}`}
            onClick={() => handleTabClick('messager')}
          >
            <IoChatbubbleSharp size={20}/>
            <span className="text-xs">Massage</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeTab === 'contacts' ? 'text-[#0056FF] font-bold' : ''}`}
            onClick={() => handleTabClick('contacts')}
          >
            <IoMdContacts size={20}/>
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
                className="w-full p-1 border border-gray-300 rounded-xl bg-gray-200 text-sm"
                value={search}
                onChange={handleSearch}
              />
            </div>
    
            {/* Chats */}
            <div className="flex flex-col w-full px-2 mt-2 overflow-y-auto">
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
                      className="flex flex-row items-center gap-2"
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
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="text-xs text-gray-400 ml-auto">
                        <Time timestamp={chat.updatedAt} />
                      </span> 
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
