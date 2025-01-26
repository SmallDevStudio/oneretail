import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Avatar from "../utils/Avatar";
import Loading from "../Loading";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

export default function Notifications({user}) {
    const { data: session } = useSession();
    const router = useRouter();
   
    const { data: notifications, error: notificationsError, mutate } = useSWR(`/api/notifications/${user.user.userId}`, fetcher);

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

    const handleClick = async (id, notification) => {
        MakeReading(id);
        router.push(notification.url);
    }

    return (
        <div className="flex flex-col gap-4 bg-white px-4 py-2 pb-20">
            <div className="flex flex-row items-center justify-between">
            <h1 className="text-xl font-bold text-[#0056FF]">แจ้งเตือน</h1>
            <span onClick={handleReadAll} className="text-sm text-[#0056FF] cursor-pointer">อ่านทั้งหมด</span>
            </div>
            <div className="flex flex-col w-full">
                {!notifications ? (
                    <Loading />
                ):(
                    notifications?.data?.length > 0 ? notifications.data.map((notification, index) => (
                        <div 
                            className={`flex flex-row items-center justify-between px-2 py-0.5 gap-2 mb-1 ${notification.isReading === false ? 'bg-blue-200/30' : ''}`}
                            key={index}
                        >
                            <div className="flex flex-row items-center gap-2">
                                <Avatar
                                    src={notification.sender.pictureUrl}
                                    size={40}
                                    userId={notification.senderId}
                                />
                                <div className="flex flex-col text-sm">
                                    <span 
                                        className="text-sm font-bold text-[#0056FF]"
                                        onClick={() => {
                                            router.push(`/p/${notification.senderId}`);
                                        }}
                                    >
                                        {notification.sender.fullname}
                                    </span>
                                    <span
                                        className="text-sm"
                                        onClick={() => {
                                            handleClick(notification._id, notification);
                                        }}
                                    >
                                        {notification.description}
                                    </span>
                                </div>
                            </div>
                            <span 
                                className="text-xs text-gray-500"
                                onClick={() => {
                                    handleClick(notification._id, notification);
                                }}
                            >
                                {moment(notification.createdAt).fromNow()}
                            </span>
                        </div>
                    )): (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-gray-500">ไม่มีแจ้งเตือน</span>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}