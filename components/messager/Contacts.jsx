import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Avatar from "../utils/Avatar";
import { Dialog, Slide, Divider } from "@mui/material";
import MessageWindows from "../messager/messagewindow";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Contacts() {
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const { createConversation } = useFirebaseChat();
    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data: friends, mutate } = useSWR(
        `/api/onesociety/follower?userId=${userId}`,
        fetcher
    );

    const { data: users, mutate: mutateUsers } = useSWR(
        `/api/users`,
        fetcher
    );

    useEffect(() => {
        if (search) {
            const filtered = users?.users.filter((user) =>
                user?.fullname?.toLowerCase().includes(search.toLowerCase()) || 
                user?.empId?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [search, users?.users]);

    const handleSelectUser = (targetId) => {
        setSelectedUsers(targetId);
        handleCreateChat(targetId);
    };

    const handleCreateChat = async (targetId) => {
        try {
          if (!userId || !targetId) return;
      
          const chatId = await createConversation(userId, [userId, targetId], "private");
      
          setSelectedChat(chatId);
          return router.push(`/messager/${chatId}`);
        } catch (error) {
          console.error("Error creating chat:", error);
        }
      };

    return (
        <div className="flex flex-col p-2 w-full">
            <span className="text-xl font-bold text-[#0056FF]">รายชื่อ</span>
            <div className="flex flex-col items-center w-full my-2">
                <input
                    type="text"
                    placeholder="กรอกชื่อ หรือรหัสพนักงาน"
                    className="w-full border border-gray-300 rounded-full px-2 py-0.5"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex justify-end w-full">
                    {filteredUsers?.length > 0 && (
                        <span className="text-gray-400 text-xs">{filteredUsers?.length} รายชื่อ</span>
                    )}
                </div>
            </div>
            <span className="text-หท font-bold text-[#0056FF]">เพื่อนและผู้ติดตาม</span>
            <div className="flex flex-col w-full gap-2 bg-gray-100 py-2 px-1">
                <div className="flex flex-row gap-2 overflow-x-auto">
                {friends?.data?.map((friend) => (
                    <div key={friend?.user?.userId}>
                        <Avatar
                            src={friend?.user?.pictureUrl}
                            size={50}
                            userId={friend?.user?.userId}
                        />
                    </div>
                ))}
                </div>
            </div>

            <div className="flex flex-col w-full gap-2 my-2 px-1 overflow-y-auto">
                {filteredUsers?.map((user) => (
                    <div 
                        key={user?.userId}
                        className="flex flex-row items-center w-full gap-2 my-2"
                        onClick={() => handleSelectUser(user.userId)}
                    >
                        <Avatar
                            src={user?.pictureUrl}
                            size={40}
                            userId={user?.userId}
                        />
                        <span className="text-sm font-bold text-[#0056FF]">{user?.empId}</span>
                        <span className="text-sm font-bold text-[#0056FF]">{user?.fullname}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}