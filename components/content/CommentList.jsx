import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import { RiDeleteBin5Line } from "react-icons/ri";

const CommentList = ({ comments: initialComments, contentId, user }) => {
  const [comments, setComments] = useState(initialComments || []);

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/content/comments/${commentId}`);
      // Refresh comments
      const res = await axios.get(`/api/content/comments?contentId=${contentId}`);
      setComments(res.data.data);
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  return (
    <div className="comments">
      {comments.length > 0 ? comments.map((comment) => (
      <>
        <div key={comment._id} className='flex bg-gray-200 p-2 m-2 rounded-xl items-center shadow-md border-2 border-gray-300'>
          <div className="flex flex-row gap-2 m-2 w-full">
            <div className="w-50 h-50 min-w-[50px] mr-2" >
              <Image 
                src={comment.user.pictureUrl} 
                alt="avatar" 
                width={50} 
                height={50}
                className='rounded-full'
            />
            </div>

            <div className='flex flex-col text-left w-full'>
              <div className='flex flex-row items-center justify-between'>
                <span className='flex font-bold'>
                  {comment.user.fullname}
                </span>
                <span className='flex text-[10px]'>
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
              <span className='text-sm'>
                {comment.content}
              </span>
              {user.role === 'admin' || user.userId === comment.user.userId ? (
                <div className='flex w-full justify-end'>
                  <button onClick={() => handleDeleteComment(comment._id)}>
                    <RiDeleteBin5Line className='text-gray-500 text-sm' />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </>
      )) : <p>No comments yet.</p>}
    </div>
  );
};

export default CommentList;