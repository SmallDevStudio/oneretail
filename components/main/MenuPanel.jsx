import React from 'react';
import { IoNotifications } from "react-icons/io5";
import { MdInsertChart } from "react-icons/md";
import useSWR from 'swr';

const MenuPanel = () => {
    return (
        <div className="flex flex-row absolute top-2 right-4 gap-2 text-gray-400">
             <button>
                <MdInsertChart />
            </button>
            <button 
                type="button" 
                className="relative inline-flex"
                title="Notification"
                aria-label="Notification"
                data-dropdown-toggle="dropdownNotification"
                id='Notification'
            >
            <IoNotifications />
            <div 
                className="absolute inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2"
            >
                20
            </div>
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