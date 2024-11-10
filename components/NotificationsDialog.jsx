import React from 'react';
import axios from 'axios';
import { Dialog } from "@mui/material";
import useSWR from 'swr';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoIosArrowBack } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import moment from 'moment';
import "moment/locale/th";
import Swal from 'sweetalert2';
moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

const NotificationsDialog = ({ open, onClose, userId, notifications, mutate }) => {
    const router = useRouter();
    
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
    }

    const handleDelete = async (id) => {
        try {
            confirm('Are you sure you want to delete this notification?');
            const res = await axios.delete(`/api/notifications?id=${id}`);
            if (res.status === 200) {
                mutate();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleReadAll = async () => {
        try {
            const res = await axios.put('/api/notifications/markAsRead', { ids: notifications.data.map(notification => notification._id) });
            if (res.status === 200) {
                mutate();
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (!notifications) return <Loading />;
    

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <div className='p-5'>
                <div className='flex flex-row items-center justify-between w-full mb-2'>
                    <div className='flex flex-row items-center'>
                    <IoIosArrowBack size={30} onClick={() => onClose()} className='text-gray-700 cursor-pointer' />
                    <span className='text-gray-700 ml-2 font-bold text-lg'>All Notifications</span>
                    </div>
                    <span 
                        className='text-gray-700 font-bold text-sm cursor-pointer'
                        onClick={() => handleReadAll()}
                    >อ่านทั้งหมด
                    </span>
                </div>

                    <Divider />

                    <div className="w-full text-xs mt-2">
                        {notifications.data.map((notification , index) => (
                            <div key={index} className={`${notification.isReading ? '' : 'font-bold text-[#0056FF]'} mb-1`}
                            >
                                <div className='flex flex-row items-center justify-between w-full gap-2'>
                                    <div className='w-[50px] h-[50px]' onClick={() => handleClick(notification)}>
                                        <Image
                                            src={notification?.sender?.pictureUrl}
                                            alt="avatar"
                                            width={40}
                                            height={40}
                                            className='rounded-full object-contain border'
                                            loading='lazy'
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                    </div>
                                    <div className='flex flex-col w-3/6' onClick={() => handleClick(notification)}>
                                        <span className='text-xs'>{notification?.sender?.fullname}</span>
                                        <span >{notification.description}</span>
                                    </div>
                                    <span className='text-[10px]'>{moment(notification.createAt).fromNow()}</span>
                                    <TiDelete size={20} className='text-red-500'
                                        onClick={() => handleDelete(notification._id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </Dialog>
    );
};

export default NotificationsDialog;