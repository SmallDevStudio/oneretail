// MenuPanel Component
import React, { useState } from 'react';
import { IoNotifications } from "react-icons/io5";
import { MdInsertChart } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import useSWR from 'swr';
import Loading from '../Loading';
import { useRouter } from 'next/router';

const fetcher = (url) => fetch(url).then((res) => res.json());

const MenuPanel = ({ user }) => {
    const { data: notifications, error: notificationsError } = useSWR(`/api/notifications/${user.user.userId}`, fetcher);
    
    const router = useRouter();

    if (notificationsError ) return <div>Error loading data</div>;
    if (!notifications ) return <Loading />;

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
                data-dropdown-toggle="dropdownNotification"
                id='Notification'
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

            <div 
                id="dropdownNotification" 
                className="z-15 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80"
            >
            </div>

        </div>
    );
};

export default MenuPanel;
