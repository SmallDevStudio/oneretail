import React, { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { FaRegCommentDots } from "react-icons/fa";
import Avatar from "../utils/Avatar";
import UserList from "./UserList";
import { Dialog, Slide, CircularProgress } from "@mui/material";
import MessageWindows from "../messager/messagewindow";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Friends() {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const { createConversation } = useFirebaseChat();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: friends, mutate , isValidating, error, isLoading } = useSWR(
    `/api/onesociety/follower?userId=${userId}`,
    fetcher
  );

  const handleCreateChat = async (friend) => {
    try {
      const targetId = friend?.user?.userId;
  
      if (!userId || !targetId) return;
  
      const chatId = await createConversation(userId, [userId, targetId], "private");
  
      setSelectedChat(chatId);
      setIsOpenChat(true); // เปิดหน้าต่าง Chat
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };
  
  const handleCloseChat = () => {
    setIsOpenChat(false);
    setSelectedChat(null);
  };
  
  if (isLoading) return <CircularProgress />;

  return (
    <>
      <div className="flex flex-col gap-4 bg-white px-4 py-2">
        <span className="text-lg font-bold text-[#0056FF]">เพื่อนของคุณ</span>
        <UserList users={friends?.data} />
        <div className="flex flex-col gap-2">
          {friends?.data?.length > 0 ? (
            friends.data.map((friend, index) => (
              <div key={index} className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                  <Avatar
                    src={friend?.user?.pictureUrl}
                    size={30}
                    userId={friend?.user?.userId}
                  />
                  <div className="flex flex-row items-center gap-1">
                    <span className="text-sm text-[#0056FF] font-bold">
                      {friend?.user?.fullname}
                    </span>
                    <span className="text-xs">
                      {friend?.friend ? "(เพื่อน)" : "(ติดตาม)"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div
                    className="bg-gray-200 px-3 py-1 rounded-lg cursor-pointer"
                    onClick={() => handleCreateChat(friend)}
                  >
                    <FaRegCommentDots size={20} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-500 font-bold">ไม่มีเพื่อน</span>
            </div>
          )}
        </div>
      </div>
      <Dialog
        fullScreen
        open={isOpenChat}
        onClose={handleCloseChat}
        TransitionComponent={Transition}
      >
        {selectedChat && (
          <MessageWindows
            selectedChat={selectedChat}
            name={selectedChat?.fullname}
            mutate={mutate}
            handleClose={handleCloseChat}
          />
        )}
      </Dialog>
    </>
  );
}
