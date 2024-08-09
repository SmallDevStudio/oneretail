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
moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

const NotificationsDialog = ({ open, onClose, userId }) => {
    const router = useRouter();
    const { data: notifications, error: notificationsError, mutate } = useSWR(`/api/notifications/all/${userId}`, fetcher);

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
            const res = await axios.delete(`/api/notifications?id=${id}`);
            if (res.status === 200) {
                mutate();
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (notificationsError) return <div>Error loading data</div>;
    if (!notifications) return <Loading />;

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <div className='p-5'>
                <div className='flex flex-row items-center w-full mb-2'>
                    <IoIosArrowBack size={30} onClick={() => onClose()} className='text-gray-700 cursor-pointer' />
                    <span className='text-gray-700 ml-2 font-bold text-lg'>All Notifications</span>
                </div>

                    <Divider />

                    <div className="w-full text-xs mt-2">
                        {Array.isArray(notifications.data) && notifications.data.map((notification) => (
                            <div className={`${notification.isReading ? '' : 'font-bold text-[#0056FF]'} mb-1`}
                            >
                                <div className='flex flex-row items-center justify-between w-full gap-2'>
                                    <div className='' onClick={() => handleClick(notification)}>
                                        <Image
                                            src={notification.sender.pictureUrl}
                                            alt="avatar"
                                            width={40}
                                            height={40}
                                            className='rounded-full'
                                            loading='lazy'
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </div>
                                    <div className='flex flex-col w-3/6' onClick={() => handleClick(notification)}>
                                        <span className='text-xs'>{notification.sender.fullname}</span>
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