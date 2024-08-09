import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import useSWR from 'swr';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoIosArrowBack } from "react-icons/io";
import Divider from '@mui/material/Divider';
import moment from 'moment';
import "moment/locale/th";
moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

const NotificationsDialog = ({ open, onClose, userId }) => {

    const router = useRouter();
    const { data: notifications, error: notificationsError } = useSWR(`/api/notifications/all/${userId}`, fetcher);

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

                    <ul className="w-full text-xs mt-2">
                        {notifications.data.map((notification) => (
                            <Link key={notification._id} href={notification.url || '#'}>
                            <li className={`${notification.isReading ? '' : 'font-bold text-[#0056FF]'} mb-1`}>
                                <div className='flex flex-row items-center justify-between w-full'>
                                    <div className='flex flex-row items-center gap-2 w-4/6'>
                                        <span >{notification.description}</span>
                                    </div>
                                    <span className='text-[10px]'>{moment(notification.createAt).fromNow()}</span>
                                </div>
                            </li>
                            </Link>
                        ))}
                    </ul>
            </div>
        </Dialog>
    );
};

export default NotificationsDialog;