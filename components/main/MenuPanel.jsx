import React, { useState } from 'react';
import { IoNotifications } from "react-icons/io5";
import { MdInsertChart } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem, Button, Dialog } from "@mui/material";
import useSWR from 'swr';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import NotificationsDialog from '../NotificationsDialog';
import axios from 'axios';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { FcLike } from "react-icons/fc";
import { FaTag } from "react-icons/fa";

const fetcher = (url) => fetch(url).then((res) => res.json());

const MenuPanel = ({ user }) => {
    const { data: notifications, error: notificationsError, mutate } = useSWR(`/api/notifications/${user.user.userId}`, fetcher);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const router = useRouter();

    const handleDropdownOpen = (event) => {
        setAnchorEl(event.currentTarget);

        // Mark the first 10 notifications as read
        if (notifications?.data?.length > 0) {
            const notificationIds = notifications.data.slice(0, 10).map(n => n._id);
            axios.put('/api/notifications/markAsRead', { ids: notificationIds }).then(() => {
                mutate(); // Re-fetch the notifications after updating
            });
        }
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    const handleShowMore = () => {
        setOpenDialog(true);
        handleDropdownClose();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    if (notificationsError) return <div>Error loading data</div>;
    if (!notifications) return <CircularProgress />;

    return (
        <div className="flex flex-row gap-4 text-gray-400">
            {/* survey report */}
            {(user.user.role === 'admin' || user.user.role === 'manager') && (
                <button onClick={() => router.push('/survey')}>
                    <MdInsertChart size={18}/>
                </button>
            )}
             
            <button 
                type="button" 
                className="relative inline-flex"
                title="Notification"
                aria-label="Notification"
                onClick={handleDropdownOpen}
            >
                <IoNotifications size={18}/>
                {notifications.data.length > 0 && (
                    <div 
                    className="absolute inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2"
                    >
                        {notifications.data.length}
                    </div>
                )}
            </button>

            <button>
                <BsThreeDotsVertical size={18}/>
            </button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
                PaperProps={{
                    style: {
                        width: 'auto',
                        maxWidth: '300px',
                        padding: '10px',
                    },
                }}
            >
                {notifications.data.slice(0, 10).map((notification) => (
                    <li key={notification._id} className='p-1'>
                        <Link href={notification.url || '#'}>
                            <div className="flex flex-row items-center gap-2 cursor-pointer text-sm">
                            {notification.type === 'like' ? <FcLike size={18}/> : <FaTag size={18} className='text-[#0056FF]'/>}
                            <span className={`text-xs ${notification.isReading ? 'font-normal' : 'font-bold'}`}>{notification.description}</span>
                            </div>
                        </Link>
                    </li>
                ))}
                <li onClick={handleShowMore} className="flex flex-col items-center justify-center text-xs mt-2 w-full">
                    <Divider className='w-full'/>
                    <span className="cursor-pointer text-xs font-bold mt-2 text-[#0056FF]">
                        แสดงแจ้งเตือน
                    </span>
                </li>
            </Menu>

            <NotificationsDialog open={openDialog} onClose={handleCloseDialog} userId={user.user.userId} />
        </div>
    );
};

export default MenuPanel;
