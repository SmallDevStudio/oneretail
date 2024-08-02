import React from 'react';
import { IoNotifications } from "react-icons/io5";
import { MdInsertChart } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import useSWR from 'swr';

const MenuPanel = () => {
    return (
        <div className="flex flex-row gap-4 text-gray-400">
             <button>
                <MdInsertChart size={18}/>
            </button>
            <button 
                type="button" 
                className="relative inline-flex"
                title="Notification"
                aria-label="Notification"
                data-dropdown-toggle="dropdownNotification"
                id='Notification'
            >
            <IoNotifications size={18}/>
            <div 
                className="absolute inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2"
            >
                20
            </div>
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