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
import Image from 'next/image';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import "moment/locale/th";

moment.locale('th');

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
            notifications.data.slice(0, 10);
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

    const MakeReading = async (id) => {
        try {
            const res = axios.put('/api/notifications/markAsRead', { ids: [id] });
            if (res.status === 200) {
                mutate();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick = (notification) => {
        MakeReading(notification._id);
        router.push(notification.url);
        handleDropdownClose();
        setOpenDialog(false);
    }

    if (notificationsError) return <div>Error loading data</div>;
    if (!notifications) return <CircularProgress />;

    return (
        <div className="flex flex-row gap-4 text-gray-400 pr-4">
            {/* survey report */}
            {(user?.user?.role === 'manager' || user?.user?.role === 'admin') && (
                <button onClick={() => router.push('/survey')}>
                    <MdInsertChart size={25}/>
                </button>
            )}
             
            <button 
                type="button" 
                className="relative inline-flex"
                title="Notification"
                aria-label="Notification"
                onClick={handleDropdownOpen}
            >
                <IoNotifications size={25}/>
                {notifications.Reading > 0 && (
                    <div 
                    className="absolute inline-flex items-center justify-center w-5 h-5 text-[8px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2"
                    >
                        {notifications.Reading}
                    </div>
                )}
            </button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
                PaperProps={{
                    style: {
                        width: 'auto',
                        maxWidth: '300px',
                    },
                }}
            >
                <div className="flex flex-col items-start w-full">
                    {notifications.data.slice(0, 10).map((notification, index) => (
                        <React.Fragment key={notification._id}> {/* ใช้ notification._id เป็น key */}
                            <div className={`flex flex-row items-center px-5 py-0.5 gap-4 ${notification.isReading === false ? 'bg-blue-200/30' : ''}`}
                                onClick={() => handleClick(notification)}
                            >
                                <div className="flex">
                                    <Image
                                        src={notification?.sender?.pictureUrl}
                                        alt="Picture of the author"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                        style={{ width: '40px', height: '40px'}}
                                    />
                                </div>
                                <div className="flex flex-col cursor-pointer text-sm">
                                    <span className={`text-xs text-left text-[#F68B1F] ${notification.isReading ? 'font-normal' : 'font-bold'}`}>
                                        {notification?.sender?.fullname}
                                    </span>
                                    <span className={`text-xs ${notification.isReading ? 'font-normal' : 'font-bold'}`}>
                                        {notification.description}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{moment(notification.createAt).fromNow()}</span>
                                </div>
                            </div>
                            <Divider key={`divider-${notification._id}`} /> {/* ใช้ key ที่ผสมระหว่าง divider และ _id */}
                        </React.Fragment>
                    ))}
                    <div onClick={handleShowMore} className="flex flex-col items-center justify-center text-xs mt-2 w-full">
                        <span className="cursor-pointer text-xs font-bold mt-2 text-[#0056FF]">
                            แสดงแจ้งเตือน
                        </span>
                    </div>
                </div>
            </Menu>

            <NotificationsDialog open={openDialog} onClose={handleCloseDialog} userId={user.user.userId} notifications={notifications} mutate={mutate} />
        </div>
    );
};

export default MenuPanel;
