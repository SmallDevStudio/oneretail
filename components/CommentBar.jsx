import React from 'react'
import UserAvartar from './UserAvartar';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiSend } from "react-icons/fi";

const CommentBar = (id) => {
    const [comment, setComment] = useState('');
    const user = localStorage.getItem('user');
    const { userId, fullname, pictureUrl } = JSON.parse(user);
    const contentId = id.id;

    const handleClick = async () => {
        const input = document.getElementById('input');
        input.value = '';
        const commentData = {
            comment: comment,
            contentId: contentId,
            userId: userId,
            fullname: fullname,
            userImage: pictureUrl
        }
        console.log(commentData);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            })
            console.log(res);
        } catch (error) {
            console.log(error);
        }
        
    }

    return (
        <div className="sticky bottom-14 z-50 w-full h-18 p-3 justify-center items-center bg-gray-200 border-1 border-gray-300 shadow-inner ">
           <div className="flex flex-row w-full justify-center items-center text-center">
                <UserAvartar />
                    <input type="text" id='input' className="w-full p-2 rounded-full ml-2 text-sm ring-2 ring-gray-300" placeholder="Add a comment..." 
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button 
                        type="button" 
                        className=" text-[#0056FF] font-bold text-xl py-2 px-4 rounded-full hover:text-blue-900"
                        onClick={handleClick}
                    >
                        <FiSend />
                    </button>
           </div>
        </div>
    )
}

export default CommentBar;