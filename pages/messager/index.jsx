import { useState, useEffect, forwardRef, useCallback, useMemo } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import { FaCirclePlus } from "react-icons/fa6";
import { Slide, Dialog, CircularProgress } from "@mui/material";
import Avatar from "@/components/utils/Avatar";
import { AppLayout } from "@/themes";
import Modal from "@/components/Modal";
import Swal from "sweetalert2";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import Time from "@/components/utils/Time";
import Contacts from "@/components/messager/Contacts";
import { IoChatbubbleSharp } from "react-icons/io5";
import { IoMdContacts } from "react-icons/io";

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

  const { listenUserChats } = useFirebaseChat();
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
    return router.push("/messager/" + chatId);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredChats = useMemo(() => {
    if (!search) return chats;
    return chats.filter((chat) =>
      chat.participants.users.some(
        (user) =>
          user.userId !== userId &&
          user.fullname.toLowerCase().includes(search)
      )
    );
  }, [chats, search, userId]);

  const handleTabClick = useCallback((tab) => {
          setActiveTab(tab);
      }, []);

  if (loading) return <CircularProgress />;

  return (
    <div className="flex flex-col bg-gray-300 w-full h-screen">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full p-4">
        <h1 className="text-md font-bold">Massager</h1>
        <div className={`flex flex-row items-center gap-2 text-gray-500`}>
          <IoChatbubbleSharp 
            className={activeTab === 'messager' ? 'text-[#0056FF]' : ''}
            size={20}
            onClick={() => handleTabClick('messager')}
          />
          <IoMdContacts 
            className={activeTab === 'contacts' ? 'text-[#0056FF]' : ''}
            size={20}
            onClick={() => handleTabClick('contacts')}
          />
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
                    className="flex flex-row items-center w-full gap-2 p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleOpen(chat.chatId)}
                  >
                    <Avatar src={otherUser.user.pictureUrl || "/default-avatar.png"} size={40} />
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
