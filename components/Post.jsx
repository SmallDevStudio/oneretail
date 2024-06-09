import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Image from 'next/image';
import getEmbedComponent from '@/utils/getEmbedComponent';
import 'moment/locale/th';
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FiSend } from "react-icons/fi";


moment.locale('th');

const Post = ({ post, user, onDelete }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  console.log('comments:', comments);


  const handleLike = async () => {
    try {
      await axios.put(`/api/posts/${post._id}`, { likes: [...post.likes, user._id] });
      setLikes(likes + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/posts/${post._id}`);
      onDelete(post._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent) return;

    try {
      const res = await axios.post('/api/comments', {
        content: commentContent,
        user: user._id,
        postId: post._id,
      });
      setComments([...comments, res.data.data]);
      setCommentContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  return (
    <div className="post">
      <div className="user-info">
        <Image src={post.user.pictureUrl} alt="avatar" width={40} height={40} />
        <div className="flex flex-col text-left">
          <span className="font-bold">
            {post.user.fullname}
          </span>
          <span className="text-[10px]">
            {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div className="justify-start items-center">
        <span className="flex text-md mb-1">
          {post.content}
        </span>
        {post.link && getEmbedComponent(post.link)}
      </div>
      <div className="flex flex-row justify-between mt-1">
        <div className="flex gap-2">
          <button onClick={handleLike}>
            <div className="flex items-center">
              <AiOutlineLike 
                size={18} 
                color={post.likes.includes(user._id) ? 'red' : 'black'}
                className="mr-1"
              />
              {likes}
            </div>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="ml-3">
            <div className="flex items-center">
              <FaRegCommentDots 
              size={18} 
              color="black"
              className='mr-1'
              />
              {comments.length}
            </div>
          </button>
        </div>
        {user.role === 'admin' || user._id === post.user._id ? (
          <button onClick={handleDelete}>
            <MdDeleteOutline 
              size={20} 
              color="black"
              className='mr-1'
            />
          </button>
        ) : null}
      </div>
      {showComments && (
        <div className="flex flex-col ">
          {comments.map((comment) => (
            <>
            <div key={comment._id} className="flex w-full flex-col border-2 border-gray-100 p-1 rounded-xl items-center">
              <div className="flex flex-row gap-2 m-2 w-full">
              <div className="w-30 h-30 min-w-[30px] mr-2">
                <Image 
                  src={comment.user.pictureUrl} 
                  alt="avatar" 
                  width={30} 
                  height={30}
                  className='rounded-full'
                />
              </div>
              <div className="flex flex-col w-full">
                <div className='flex justify-between items-center'>
                  <span className="flex font-bold ml-2">
                    {comment.user.fullname}
                  </span>
                  <span className="text-[10px] ml-2">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                <p className="flex justify-start ml-2 text-sm">
                  {comment.content}
                </p>
            
              </div>
              </div>

              <div className="flex justify-end mt-[-10px] w-full">
                {user.role === 'admin' || user._id === comment.user._id ? (
                  <button onClick={() => handleCommentDelete(comment._id)}>
                    <MdDeleteOutline size={15} color="black" className='mr-1' />
                  </button>
                ) : null}
            </div>
            
            </div>
            
            </>
          ))}
          <form onSubmit={handleCommentSubmit} className="flex flex-row w-full items-center mt-2">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <button type="submit">
              <FiSend 
                size={20} 
                className='mr-1 ml-2 text-[#0056FF]'
              />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};


export default Post;