import React from 'react'
import UserAvartar from './UserAvartar';
import { useSession } from 'next-auth/react';
import { FiSend } from "react-icons/fi";

const CommentBar = (id) => {


    return (
        <div className="fixed bottom-14 z-50 w-full h-18 p-3 justify-center items-center bg-gray-200 border-1 border-gray-300 shadow-inner ">
           <div className="flex flex-row w-full justify-center items-center">
                <UserAvartar />
                <form className="w-full flex flex-row">
                    <input type="text" className="w-full p-2 rounded-full ml-2" placeholder="Add a comment..." />
                    <button 
                        type="button" 
                        className=" text-gray-700 font-bold text-xl py-2 px-4 rounded-full hover:text-blue-600"
                    >
                        <FiSend />
                    </button>
                </form>
           </div>
        </div>
    )
}

export default CommentBar;