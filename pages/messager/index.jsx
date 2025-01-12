import { useState, useEffect, forwardRef, use } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import moment from 'moment';
import "moment/locale/th";
import { FaCirclePlus } from "react-icons/fa6";
import { Divider, Slide, Dialog, CircularProgress } from '@mui/material';
import MessageWindows from '@/components/chats/MessageWindows';
import Avatar from '@/components/utils/Avatar';
import { AppLayout } from '@/themes';
import { useSwipeable } from 'react-swipeable';
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from '@/components/Modal';
import Swal from 'sweetalert2';

moment.locale('th');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chatDeleted, setChatDeleted] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectUserId, setSelectUserId] = useState(null);
  const [chatName, setChatName] = useState("");

  const router = useRouter();
  const { receiverId } = router.query; // ดึง receiverId จาก URL
 
  const { data: session } = useSession();

  const { data, error } = useSWR(`/api/users/online?userId=${session?.user?.id}`, fetcher, {
    onSuccess: (data) => {
      setUsers(data.users);
    },
  });

  const { data: userData, error: userError } = useSWR(`/api/users/${session?.user?.id}`, fetcher, {
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const { data: chatData, error: chatError, mutate } = useSWR((session?.user?.id) ? `/api/chats/${session?.user?.id}` : null, fetcher, {
    onSuccess: (data) => {
      setChats(data.chats);
    },
  });

  useEffect(() => {
    if (receiverId && receiverId !== session?.user?.id && session?.user?.id) {
      setSelectUserId(receiverId);
      CreateChat(receiverId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverId, session?.user?.id]);

  useEffect(() => {
    if (searchUser) {
      const filtered = users.filter((user) => 
        user.fullname.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.empId.toLowerCase().includes(searchUser.toLowerCase())
    );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchUser, users]);

  useEffect(() => {
    if (chatData?.userChats?.length > 0) {
      const updatedChats = chatData.userChats.map((chat) => {
        const messagesArray = chat.messages
          ? Object.values(chat.messages) // แปลง messages เป็นอาร์เรย์
          : [];
  
        const unreadCount = messagesArray.filter(
          (msg) =>
            msg.receiverId === session?.user?.id && !msg.read // ตรวจสอบ unread
        ).length;
  
        return { ...chat, unreadCount };
      });
  
      setChats(updatedChats);
    }
  }, [chatData, session?.user?.id]);

  const handleOpen = (chatId, name) => {
    setSelectedChat(chatId);
    setChatName(name);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setSelectedChat(null);
    setOpenDialog(false);
    router.push('/messager');
  };

  const handleDeleteChat = async(chatId) => {
      const resolt = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการลบข้อความนี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบข้อความ!',
      });

      if (resolt.isConfirmed) {
        setLoading(true);
        try {
          // ลบแชทจากรายการ
          await axios.delete(`/api/chats/chat?chatId=${chatId}`);
          mutate();
        } catch (error) {
          console.error(error);
          Swal.fire('Error!', 'There was an issue deleting the chat.', 'error');
        } finally {
          setLoading(false);
        }
      }
       
  };

  const handleChatDeleted = (chatId) => {
    setChatDeleted(true);
    setSelectedChat(chatId);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleChatDeleted(selectedChat),
    onSwipedRight: () => setChatDeleted(false),
    delta: 30, // ความไวในการเลื่อน
  });

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
  };

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);

  };

  const handleSelectUser = (userId) => {
    setSelectUserId(userId);
    setOpenUserModal(false);
    CreateChat();
  }

  const CreateChat = async (receiverId) => {
    if (!receiverId) {
      receiverId = selectUserId;
    }
    const senderId = session?.user?.id;
    const data = { receiverId, senderId };

    try {
      const response = await axios.post('/api/chats', data);
      const chatId = response.data.chatId;
      console.log(chatId);
      if (chatId) {
        setSelectedChat(chatId); // ตั้งค่า chatId ที่ได้
        setOpenDialog(true); // เปิด dialog สำหรับแสดงหน้าต่างแชท
      }
      console.log('Chat response:', response.data);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
  
  return (
    <div className='flex flex-col bg-gray-300 w-full h-screen'>
      {/* Header */}
      <div className='flex flex-row items-center justify-between w-full p-4'>
        <div className='flex flex-row items-center gap-2'>
         
          <Avatar 
            src={user?.pictureUrl}
            size={36}
            userId={session?.user?.id} 
          />
        </div>
        <h1 className='text-md font-bold'>Massager</h1>
        <FaCirclePlus 
          className='cursor-pointer text-[#0056FF]'
          size={22}
          onClick={() => setOpenUserModal(true)}
        />
      </div>

      {/* body */}
      <div className='flex flex-col bg-white w-full h-full'>
        {/* Search */}
        <div className='flex flex-row items-center w-full p-2 px-4'>
          <input 
            type='text' 
            placeholder='ค้นหา' 
            className='w-full p-1 border border-gray-300 rounded-xl bg-gray-200 text-sm'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* body */}
        <div className='flex flex-col px-4 py-2 w-full gap-4'>
        {/* Messages */}
        {chatData?.userChats?.length > 0 ? (
          chatData.userChats.map((chat) => (
            <div
              key={chat.id}
              className={`grid ${chatDeleted ? 'grid-cols-7' : 'grid-cols-6'} w-full`}
              onClick={chatDeleted ? null : () => handleOpen(chat.id, chat.receiver?.fullname || chat.sender?.fullname)}
              {...swipeHandlers}
            >
              {/* Avatar */}
              <div className='flex col-span-1 items-center'>
                <Avatar
                  src={chat.receiver?.pictureUrl || chat.sender?.pictureUrl}
                  size={40}
                  userId={chat.receiver?.userId || chat.sender?.userId}
                />
              </div>

              {/* Chat Info */}
              <div className='flex flex-col col-span-4 text-sm'>
                <span className='font-bold'>
                  {chat.receiver?.fullname || chat.sender?.fullname}
                </span>
                <span className='text-gray-500 line-clamp-1'>
                  {chat?.lastMessage || 'No messages yet'}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex flex-col col-span-1 text-sm items-end gap-2">
              <span>
              <span>
                {chat?.updatedAt ? moment(chat.updatedAt).format("HH:mm") : "-"}
              </span>
              </span>
              {chat.unreadCount > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#F68B1F] rounded-full"></div>
                  <span className="text-sm text-[#F68B1F] font-bold">{chat.unreadCount}</span>
                </div>
              )}
              </div>

              {/* Delete Button */}
              {chatDeleted && (
                <div className='flex flex-col col-span-1 text-sm h-full ml-2'>
                  <div 
                    className='flex flex-col items-center justify-center bg-red-500 text-white h-[100%]'
                    onClick={() => handleDeleteChat(chat.id)}
                  >
                    <RiDeleteBinLine size={30} />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No chats found</div>
        )}
      </div>

      </div>

        <Dialog
          fullScreen
          open={openDialog}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <div className='flex flex-col w-full'>
            <MessageWindows
              handleClose={handleClose}
              selectedChat={selectedChat}
              name={chatName}
              mutate={mutate}
            />
          </div>
        </Dialog>

        {openUserModal && (
          <Modal
            open={openUserModal}
            onClose={handleCloseUserModal}
          >
            <div className='flex flex-col w-full'>
              <div className='sticky top-0 flex flex-col items-center w-full pt-2 bg-white z-10'>
                <input
                  type='text'
                  placeholder='ใส่ชื่อผู้ใช้หรือรหัสพนักงาน'
                  className='w-full p-1 border border-gray-300 rounded-xl bg-gray-200 text-sm'
                  value={searchUser}
                  onChange={handleSearchUser}
                />
                <span className='text-sm text-gray-500'>ผู้ใช้ {filteredUsers.length}</span>
              </div>

              <div className='flex flex-col w-full overflow-y-scroll'>
              {loading ? (
                <div className='flex items-center justify-center w-full h-full'>
                  <CircularProgress /> 
                </div>
              ): filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className='flex flex-row items-center w-full p-2 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleSelectUser(user.userId)}
                  >
                    <Avatar
                      src={user.pictureUrl}
                      size={30}
                      url={`/p/${user._id}`}
                    />
                    <div className='flex flex-col ml-2'>
                      <span className='text-sm font-bold'>{user.fullname}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
    </div>
  );
}

Messages.getLayout = (page) => <AppLayout>{page}</AppLayout>;