import React, { useState } from "react";
import UserAvartar from "../UserAvartar";

const CommentBar = () => {
    const [comment, setComment] = useState('');
    const user = localStorage.getItem('user');
    const { userId, fullname, pictureUrl } = JSON.parse(user);
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

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
        <div className="flex flex-col bg-gray-200 min-h-[100vh] min-w-[100vw]">
            <div className="flex flex-row justify-center bg-white p-3">
                <div className="w-[60px] h-[60px]">
                    <UserAvartar />
                </div>
                <div>
                    <input
                        type="text"
                        id="input"
                        className="max-w-[250px] w-full border-2 border-gray-300 rounded-full p-2 "
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 h-10 ml-2 rounded-full"
                    onClick={handleClick}
                >
                    Post
                </button>
            </div>
        </div>
    );
}

export default CommentBar;