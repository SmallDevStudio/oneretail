import React, { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import { Dialog, Slide } from "@mui/material";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import CommentInput from "../comments/CommentInput";
import moment from "moment";
import "moment/locale/th";
moment.locale('th');


const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Experience = () => {
    const { data: session } = useSession();
    const [post, setPost] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState('');
    const [video, setVideo] = useState('');
    const [experiences, setExperiences] = useState([]);
    const [comment, setComment] = useState('');
    const [showInputComment, setShowInputComment] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showInputReply, setShowInputReply] = useState({});
    const [reply, setReply] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    
    const { data, error, mutate } = useSWR('/api/club/experience', fetcher, {
        onSuccess: (data) => {
            setExperiences(data.data);
        }
    });

    const { data: userData, error: userError } = useSWR('/api/users', fetcher, {
        onSuccess: (data) => {
            setUsers(data.users);
        }
    });

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };
    
    const PostSubmit = async (data) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
            await axios.post('/api/club/experience', {
                post: data.post,
                userId,
                link,
                media: data.media,
                files: data.files,
                tagusers: data.tagusers
            });
            setPost('');
            setLink('');
            setImage('');
            setVideo('');
            setLoading(false);
            handleClose();
            mutate();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const handleCommentSubmit = async (experienceId) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
            await axios.post('/api/club/experiencecomment', {
                experienceId,
                userId,
                comment,
                files,
                tagusers
            });
            setComment('');
            setLoading(false);
            mutate();
            setShowInputComment(false);
            setShowComments({ ...showComments, [experienceId]: true });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const handleReplySubmit = async (commentId) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
            await axios.post('/api/club/experiencereply', {
                commentId,
                userId,
                reply,
                files,
                tagusers
            });
            setReply('');
            setLoading(false);
            mutate();
            setShowInputReply(false);
            setShowComments(true);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const handleLike = async (experience) => {
        const userId = session?.user?.id;
      
        try {
          // อัปเดต like ในฐานข้อมูล
          await axios.post('/api/club/experience/like', {
            experienceId: experience._id,
            userId
          });
      
          // เพิ่ม notification
          await axios.post('/api/notifications', {
            userId: experience.userId,
            description: `Your post has been liked by ${session?.user?.fullname}`,
            contentId: experience._id,
            link: `/club?tab=experience?experience=${experience._id}`,
            type: 'like'
          });
      
          mutate(); // อัปเดตข้อมูลใหม่
        } catch (error) {
          console.error(error);
        }
      };

    const handleCommentLike = async (comment, experience) => {
        const userId = session?.user?.id;
      
        try {
          // อัปเดต like ในฐานข้อมูล
          await axios.post('/api/club/experiencecomment/like', {
            commentId: comment._id,
            userId
          });
      
          // เพิ่ม notification
          await axios.post('/api/notifications', {
            userId: comment.userId,
            description: `Your comment has been liked by ${session?.user?.fullname}`,
            contentId: comment._id,
            link: `/club?tab=experience?experience=${experience._id}`,
            type: 'like'
          });
      
          mutate(); // อัปเดตข้อมูลใหม่
        } catch (error) {
          console.error(error);
        }
      };

      const handleReplyLike = async (reply, experience) => {
        const userId = session?.user?.id;

        try {
            // อัปเดต like ในฐานข้อมูล
            await axios.post('/api/club/experiencereply/like', {
                replyId: reply._id,
                userId
            });

            // เพิ่ม notification
            await axios.post('/api/notifications', {
                userId: reply.userId,
                description: `Your reply has been liked by ${session?.user?.fullname}`,
                contentId: reply._id,
                link: `/club?tab=experience?experience=${experience._id}`,
                type: 'like'
            });

            mutate(); // อัปเดตข้อมูลใหม่
        } catch (error) {
            console.error(error);
        }
    }

    const handleCommentDelete = async (commentId) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
            await axios.delete(`/api/comments/${commentId}`);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleDelete = async (experienceId) => {
        try {
            await axios.delete(`/api/club/experience/${experienceId}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReplyDelete = async (replyId) => {
        try {
            await axios.delete(`/api/club/experiencereply/${replyId}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (
        <div className="flex flex-col text-white text-sm">
            {/* Input Post */}
            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center px-2 w-full gap-1">
                    <div className="relative w-full p-2 text-xs bg-gray-200 outline-none rounded-full h-8">
                        <input
                            type="text"
                            placeholder="คุณคิดอะไรอยู่..?"
                            className="w-full bg-transparent focus:outline-none"
                            onClick={() => handleClickOpen()}
                        />
                    </div>
                </div>
            </div>

            {/* Post Container */}
            <div className="flex flex-col w-full mt-2">
                {Array.isArray(experiences) && experiences.map((experience, index) => (
                    <div key={index} className="flex flex-col px-2 w-full gap-2 bg-black/70 py-2 rounded-xl mb-2" id={experience?._id}>
                        <div className="flex flex-row items-center">
                            <div className="flex items-center justify-center align-top w-[35px]">
                                <Image
                                    src={experience?.user?.pictureUrl}
                                    alt="user"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </div>
                            <div className="flex flex-col w-full ml-2">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-xs font-bold text-[#0056FF]">{experience?.user?.fullname}</p>
                                    <p className="text-[8px]">{moment(experience?.createdAt).fromNow()}</p>
                                </div>
                                <p className="text-xs">{experience?.post}</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full mt-2">
                            <div className="flex flex-row items-center justify-between w-full pl-4 pr-2">
                                <div className="flex flex-row items-center gap-2">
                                    <svg className={`w-3 h-3 }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275.26 275.28">
                                        <path fill='currentColor' d="M215.39,275.28H10.87c-6.01,0-10.87-4.87-10.87-10.88V113.14c0-6.01,4.87-10.87,10.87-10.87h56.27L143.42,14.33c10.29-11.86,26.19-16.88,41.49-13.09l.73.18c13.15,3.25,23.89,12.69,28.73,25.24,4.79,12.43,3.19,26.46-4.27,37.53l-25.69,38.08h49.35c12.57,0,24.32,5.55,32.23,15.23,7.81,9.55,10.89,21.94,8.45,33.99l-18.37,90.75c-3.88,19.14-20.98,33.04-40.68,33.04ZM82.98,253.53h132.41c9.39,0,17.53-6.56,19.36-15.6l18.37-90.75c1.14-5.63-.31-11.43-3.97-15.9-3.77-4.61-9.38-7.25-15.4-7.25h-69.81c-4.02,0-7.71-2.22-9.6-5.77s-1.66-7.85.59-11.19l37.13-55.04c3.54-5.26,4.28-11.65,2.01-17.55-2.32-6.02-7.29-10.37-13.65-11.94l-.73-.18c-7.34-1.81-14.94.58-19.85,6.23l-76.87,88.62v136.32ZM21.75,253.53h39.48V124.02H21.75v129.51Z"/>
                                    </svg>
                                    <span>
                                        {Array.isArray(experience?.likes) ? experience?.likes.length : 0}
                                    </span>
                                </div>
                                
                                <div className="flex flex-row items-center gap-2">
                                    <svg className='w-3 h-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                    <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                    <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                    <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                    <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                                    </svg>
                        
                                    <span className="text-xs cursor-pointer" onClick={() => setShowInputComment(showInputComment !== experience._id ? experience._id : null)}>
                                        แสดงความคิดเห็น
                                    </span>
                                </div>
                                    
                                <div className="flex flex-row items-center gap-2">
                                    <span className="text-xs cursor-pointer" onClick={() => setShowComments(showComments !== experience._id ? experience._id : null)}>
                                        {showComments === experience._id ? 'ซ่อนความคิดเห็น' : 'ดูความคิดเห็น'}
                                    </span>
                                    <span className="text-xs">{Array.isArray(experience.comments) ? experience.comments.length : 0}</span>
                                </div>
                            </div>

                            {showInputComment === experience._id && (
                                <div className="flex flex-row items-center p-2 gap-2 mt-2">
                                    <textarea
                                        className="p-2 bg-gray-200 text-black text-xs outline-none rounded-full w-full"
                                        placeholder="เขียนความคิดเห็น"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={1}
                                    />
                                    <button className="p-2 bg-gray-800 text-white text-xs outline-none rounded-full" onClick={() => handleCommentSubmit(experience._id)}>
                                        <FiSend />
                                    </button>
                                </div>
                            )}

                            {showComments === experience._id && Array.isArray(experience.comments) && experience.comments.map((comment, commentIndex) => (
                                <div key={commentIndex} className="flex flex-col w-full bg-black/50 rounded-lg mt-2 ml-2">
                                    <div className="flex flex-row items-center px-2 w-full gap-2 bg-black/50 rounded-lg mt-1">
                                        <div className="flex items-center justify-center align-top w-[25px]">
                                            <Image
                                                src={comment?.user?.pictureUrl}
                                                alt="user"
                                                width={20}
                                                height={20}
                                                className="rounded-full"
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-row justify-between items-center">
                                                <p className="text-xs font-bold text-[#0056FF]">{comment?.user?.fullname}</p>
                                                <p className="text-[8px]">{moment(comment?.createdAt).fromNow()}</p>
                                            </div>
                                            <p className="text-xs">{comment?.comment}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center justify-between w-full px-4 pb-2 mt-1">
                                            <div className="flex flex-row items-center gap-2">
                                                <svg className={`w-3 h-3 }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275.26 275.28">
                                                    <path fill='currentColor' d="M215.39,275.28H10.87c-6.01,0-10.87-4.87-10.87-10.88V113.14c0-6.01,4.87-10.87,10.87-10.87h56.27L143.42,14.33c10.29-11.86,26.19-16.88,41.49-13.09l.73.18c13.15,3.25,23.89,12.69,28.73,25.24,4.79,12.43,3.19,26.46-4.27,37.53l-25.69,38.08h49.35c12.57,0,24.32,5.55,32.23,15.23,7.81,9.55,10.89,21.94,8.45,33.99l-18.37,90.75c-3.88,19.14-20.98,33.04-40.68,33.04ZM82.98,253.53h132.41c9.39,0,17.53-6.56,19.36-15.6l18.37-90.75c1.14-5.63-.31-11.43-3.97-15.9-3.77-4.61-9.38-7.25-15.4-7.25h-69.81c-4.02,0-7.71-2.22-9.6-5.77s-1.66-7.85.59-11.19l37.13-55.04c3.54-5.26,4.28-11.65,2.01-17.55-2.32-6.02-7.29-10.37-13.65-11.94l-.73-.18c-7.34-1.81-14.94.58-19.85,6.23l-76.87,88.62v136.32ZM21.75,253.53h39.48V124.02H21.75v129.51Z"/>
                                                </svg>
                                                <span>
                                                    {Array.isArray(comment?.likes) ? comment?.likes.length : 0}
                                                </span>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <svg className='w-3 h-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                                <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                                <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                                <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                                <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                                                </svg>
                                                <span className="text-xs cursor-pointer" onClick={() => setShowInputReply(showInputReply !== comment._id ? comment._id : null)}>
                                                 แสดงความคิดเห็น
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-xs cursor-pointer" onClick={() => setShowReply(showReply !== comment.reply._id ? comment.reply._id : null)}>
                                                    {showReply === comment.reply._id ? 'ซ่อนความคิดเห็น' : 'ดูความคิดเห็น'}
                                                </span>
                                                <span className="text-xs">{Array.isArray(comment.reply) ? comment.reply.length : 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {showInputReply === comment._id && (
                                        <div className="flex flex-row items-center p-2 gap-2">
                                            <textarea
                                                className="p-2 bg-gray-200 text-black text-xs outline-none rounded-full w-full"
                                                placeholder="เขียนความคิดเห็น"
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                rows={1}
                                            />
                                            <button className="p-2 bg-gray-800 text-white text-xs outline-none rounded-full" 
                                                onClick={() => handleReplySubmit(comment._id)}>
                                                <FiSend />
                                            </button>
                                        </div>
                                    )}

                                    {showReply === comment.reply._id && Array.isArray(comment.reply) && comment.reply.map((reply, replyIndex) => (
                                        <div key={replyIndex} className="flex flex-col w-5/7 justify-end bg-black/10 rounded-lg px-2 pb-2 ml-4 mb-1">
                                            <div className="flex flex-row items-center px-2 w-full gap-2 justify-end bg-black/10 rounded-lg">
                                                <div className="flex items-center justify-center align-top w-[25px]">
                                                    <Image
                                                        src={reply?.user?.pictureUrl}
                                                        alt="user"
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full"
                                                        style={{ width: '20px', height: '20px' }}
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <div className="flex flex-row justify-between items-center">
                                                        <p className="text-xs font-bold text-[#0056FF]">{reply?.user?.fullname}</p>
                                                        <p className="text-[8px]">{moment(reply?.createdAt).fromNow()}</p>
                                                    </div>
                                                    <p className="text-xs">{reply?.reply}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center gap-2 justify-between pl-10 pr-1 mt-1 w-full">
                                                <div className="flex flex-row items-center gap-2">
                                                    <svg className={`w-3 h-3 }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275.26 275.28">
                                                        <path fill='currentColor' d="M215.39,275.28H10.87c-6.01,0-10.87-4.87-10.87-10.88V113.14c0-6.01,4.87-10.87,10.87-10.87h56.27L143.42,14.33c10.29-11.86,26.19-16.88,41.49-13.09l.73.18c13.15,3.25,23.89,12.69,28.73,25.24,4.79,12.43,3.19,26.46-4.27,37.53l-25.69,38.08h49.35c12.57,0,24.32,5.55,32.23,15.23,7.81,9.55,10.89,21.94,8.45,33.99l-18.37,90.75c-3.88,19.14-20.98,33.04-40.68,33.04ZM82.98,253.53h132.41c9.39,0,17.53-6.56,19.36-15.6l18.37-90.75c1.14-5.63-.31-11.43-3.97-15.9-3.77-4.61-9.38-7.25-15.4-7.25h-69.81c-4.02,0-7.71-2.22-9.6-5.77s-1.66-7.85.59-11.19l37.13-55.04c3.54-5.26,4.28-11.65,2.01-17.55-2.32-6.02-7.29-10.37-13.65-11.94l-.73-.18c-7.34-1.81-14.94.58-19.85,6.23l-76.87,88.62v136.32ZM21.75,253.53h39.48V124.02H21.75v129.51Z"/>
                                                    </svg>
                                                    <span className="text-sm">
                                                        {Array.isArray(reply?.likes)? reply?.likes?.length : 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Dialog 
                fullScreen
                open={isDialogOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <div className="flex flex-col mt-2 p-2">
                    <div className="flex flex-row items-center mb-4 gap-4">
                        <IoIosArrowBack className="text-xl inline text-gray-700" onClick={handleClose} />
                        <span>แสดงความคิดเห็น</span>
                    </div>
                    <CommentInput handleSubmit={PostSubmit}/>
                </div>
            </Dialog>
        </div>
    )
}

export default Experience;
