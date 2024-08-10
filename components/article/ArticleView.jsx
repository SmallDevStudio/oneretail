import React, { useState } from "react";
import moment from "moment";
import "moment/locale/th";
import Image from "next/image";
import { Tooltip } from "@mui/material";
import { FiSend } from "react-icons/fi";
import { RiDeleteBinLine, RiPushpinFill } from "react-icons/ri";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";

moment.locale('th');

const ArticleView = ({ article, handleLike, userHasLiked, comments = [], handleComment, userId, session }) => {
    const [showInput, setShowInput] = useState(false);
    const [showInputReply, setShowInputReply] = useState({});
    const [showReply, setShowReply] = useState({});
    const [comment, setComment] = useState("");
    const [reply, setReply] = useState("");
    const router = useRouter();

    console.log('article', article);

    const handleToggleReplyInput = (commentId) => {
        setShowInputReply((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleToggleReply = (commentId) => {
        setShowReply((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleCommentAdded = async () => {
        const newComment = {
            articleId: article._id,
            userId: userId,
            comment: comment,
        };

        try {
            const res = await axios.post('/api/articles/comments', newComment);
            if (res.data.success) {
                setComment("");
                setShowInput(false);
                handleComment();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleReply = async (commentId) => {
        const newReply = {
            userId: userId,
            commentId: commentId,
            reply: reply,
        };

        try {
            const res = await axios.post('/api/articles/replycomments', newReply);
            if (res.data.success) {
                setReply("");
                setShowInputReply((prev) => ({
                    ...prev,
                    [commentId]: false,
                }));
                handleComment();
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const res = await axios.put(`/api/articles/comments/${commentId}`, { userId });
            if (res.data.success) {
                handleComment();
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleLikeReply = async (replyId) => {
        try {
            const res = await axios.put(`/api/articles/replycomments/${replyId}`, { userId });
            if (res.data.success) {
                handleComment();
            }
        } catch (error) {
            console.error('Error liking reply:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`/api/articles/comments?commentId=${commentId}`);
            if (res.data.success) {
                handleComment();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            const res = await axios.delete(`/api/articles/replycomments?replyId=${replyId}`);
            if (res.data.success) {
                handleComment();
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    return (
        <div className="flex flex-col mt-4">
            <div className="flex flex-row items-center gap-4 justify-between mb-4">
                <IoIosArrowBack 
                    onClick={() => router.back()} 
                    className="flex text-xl text-gray-400"
                    size={30}
                />
                <span className="text-[35px] font-black text-[#0056FF] dark:text-white">เรื่องน่าอ่าน</span>
                <div></div>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex flex-col w-full px-4">
                    <h1 className="text-3xl font-bold">{article.title}</h1>
                    <p className="text-[12px] text-gray-500">{moment(article.createdAt).format("LLL")}</p>
                    <div className="flex flex-row items-center">
                        <span className="text-[10px] text-gray-500 mr-2">ผู้สร้าง</span>
                        {article.user && (
                            <Tooltip
                                title={
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={article.user.pictureUrl || '/images/avatar-placeholder.png'}
                                            alt={article.user.fullname}
                                            width={50}
                                            height={50}
                                            className="rounded-full mb-2"
                                        />
                                        <p className="text-sm"><strong>Name:</strong> {article.user.fullname}</p>
                                        <p className="text-sm"><strong>Employee ID:</strong> {article.user.empId}</p>
                                        {article.user.position && <p className="text-sm"><strong>Position:</strong> {article.user.position}</p>}
                                        {article.user.teamGrop && <p className="text-sm"><strong>Team Group:</strong> {article.user.teamGrop}</p>}
                                        {article.user.role && <p className="text-sm"><strong>Role:</strong> {article.user.role}</p>}
                                    </div>
                                }
                                arrow
                            >
                                <span className="text-sm text-gray-500 cursor-pointer">
                                    {article.user.fullname}
                                </span>
                            </Tooltip>
                        )}
                    </div>
                </div>
                {/* Article Content */}
                <div className="flex flex-col mt-4 w-full">
                    <div>
                        {Array.isArray(article.medias) && article.medias.map((media, index) => (
                        <div key={index} className="flex flex-row items-center mb-2 w-full">
                            {media.type === "image" ? (
                                <Image 
                                    src={media.url} 
                                    alt={media.name} 
                                    width={390} 
                                    height={390} 
                                    className=""
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                                ): (
                                    <ReactPlayer
                                        url={media.url}
                                        width="100%"
                                        height="100%"
                                        controls
                                    />
                                    )}
                                </div>
                            ))}
                            <p className="text-gray-500">{article.content}</p>
                        </div>
                        {/* Quiz Panle */}
                        <div></div>

                        {/* Tags */}
                        <div className="flex flex-row items-center mt-4 gap-2 px-4">
                            <span className="flex text-sm text-[#0056FF] font-bold">Tags:</span>
                        <div className="flex flex-wrap items-center gap-2">
                            {Array.isArray(article.tags) && article.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-[#F2F2F2] px-2 py-1 rounded-full text-xs font-bold"
                                    >
                                    {tag}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                        
                    <div className="flex flex-row justify-left items-baseline space-x-4 h-8 px-2" style={{ textSizeAdjust: '100%', fontSize: '12px'}}>
                        <div className="relative inline-flex items-center columns-2 justify-center p-3 bg-[#F2871F] text-white rounded-full h-6 w-15" onClick={handleLike}>
                            {userHasLiked ? (
                                <AiFillHeart className="text-red-500 w-4 h-4 mr-1" />
                            ) : (
                                <AiOutlineHeart className="text-white w-4 h-4 mr-1" />
                            )}
                            {Array.isArray(article?.likes) ? article?.likes.length : 0}
                        </div>
                        <span>การดู {article?.views ? article?.views : 0} ครั้ง</span>
                        <div className="relative inline-flex columns-2 p-3 justify-center h-8 items-baseline" 
                            onClick={() => setShowInput(!showInput)}
                        >
                            <svg className='w-4 h-4 mr-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                            </svg>
                            <span>แสดงความคิดเห็น {comments ? comments.length : 0} ครั้ง</span>
                        </div>
                    </div>

                </div>
                {/* End Content Panel */}

                <div>
                {/* comment input  */}
                {showInput && (
                    <>
                        <div className="w-full mt-2 mb-2">
                            <div className="flex flex-row w-full bg-gray-200 rounded-xl p-1">
                                <div className="flex flex-row items-center w-full bg-gray-100 rounded-lg">
                                    <textarea
                                        className="bg-gray-100 rounded-xl p-2 w-full focus:outline-none text-sm"
                                        placeholder="เขียนความคิดเห็น"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="relative">
                                        <button 
                                            className="rounded-xl p-2 ml-1 text-gray-600"
                                            onClick={handleCommentAdded}
                                        >
                                            <FiSend />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div>
                    {/* comment container */}
                    {Array.isArray(comments) && comments.map((comment) => (
                        <div key={comment._id}>
                            <div className='flex flex-row bg-gray-200 mt-2 rounded-xl shadow-md border-2 border-gray-300 w-full'>
                                <div className='flex w-1/8 p-2'>
                                    <Image
                                        src={comment.user.pictureUrl}
                                        alt="avatar"
                                        width={40}
                                        height={40}
                                        className='rounded-full'
                                        style={{width: '40px', height: '40px'}}
                                    />
                                </div>
                                <div className='flex flex-col text-left p-1 w-5/6 ml-2'>
                                    <div className='flex flex-row items-center justify-between w-full'>
                                        <span className='text-sm'>{comment.comment}</span>
                                        <span className='text-[10px] text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
                                    </div>
                                    <div className='flex flex-row items-center justify-between w-full p-2'>
                                        <div className='flex flex-row items-center gap-5 w-full'>
                                            {comment.likes.includes(userId) ? (
                                                <AiFillHeart 
                                                    className='w-3 h-3 text-red-500' 
                                                    onClick={() => handleLikeComment(comment._id)}
                                                />
                                            ) : (
                                                <AiOutlineHeart 
                                                    className='w-3 h-3 text-gray-400'
                                                    onClick={() => handleLikeComment(comment._id)}
                                                />
                                            )}
                                            <div className='flex flex-row items-center align-middle gap-1'>
                                                <span 
                                                    className='flex text-[10px] text-gray-400 cursor-pointer'
                                                    onClick={() => handleToggleReplyInput(comment._id)}
                                                >
                                                    ความคิดเห็น
                                                </span>
                                                <span className='flex text-[12px] text-gray-400'>
                                                    {comment.replies? comment.replies.length : 0}
                                                </span>
                                            </div>
                                            <div className='flex justify-end w-1/2'>
                                                {comment.userId === userId || session?.user?.role === 'admin' ? (
                                                    <RiDeleteBinLine 
                                                        className='flex cursor-pointer text-gray-400 h-3 w-3'
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showInputReply[comment._id] && (
                                <>
                                <div className="w-full mt-2 mb-2">
                                    <div className="flex flex-row w-full bg-gray-200 rounded-xl p-1">
                                        <div className="flex flex-row items-center w-full bg-gray-100 rounded-lg">
                                            <textarea
                                                className="bg-gray-100 rounded-xl p-2 w-full focus:outline-none text-sm"
                                                placeholder="เขียนความคิดเห็น"
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                            />
                                            <div className="relative">
                                                <button 
                                                    className="rounded-xl p-2 ml-1 text-gray-600"
                                                    onClick={() => handleReply(comment._id)}
                                                >
                                                    <FiSend />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='ml-8 mt-2'>
                                {comment.replies.map((reply) => (
                                    <div key={reply._id} className='flex flex-row bg-gray-100 mt-2 rounded-xl shadow-md border-2 border-gray-200 w-full'>
                                        <div className='flex flex-row p-2 w-1/5'>
                                            <Image
                                                src={reply.user.pictureUrl}
                                                alt="avatar"
                                                width={30}
                                                height={30}
                                                className='rounded-full'
                                                style={{width: '30px', height: '30px'}}
                                            />
                                        </div>
                                            <div className='flex flex-col p-1 w-full'>
                                                <div className='flex flex-row items-center justify-between w-full'>
                                                    <span className='text-sm'>{reply.reply}</span>
                                                    <span className='text-[10px] text-gray-400'>{moment(reply.createdAt).fromNow()}</span>
                                                </div>
                                        
                                                <div className='flex flex-row items-center justify-between w-full'>
                                                    <div className='flex flex-row justify-between items-center gap-5 w-full mt-1'>
                                                        {reply.likes.includes(userId) ? (
                                                            <AiFillHeart 
                                                                className='w-3 h-3 text-red-500' 
                                                                onClick={() => handleLikeReply(reply._id)}
                                                            />
                                                        ) : (
                                                            <AiOutlineHeart 
                                                                className='w-3 h-3 text-gray-400'
                                                                onClick={() => handleLikeReply(reply._id)}
                                                            />
                                                        )}
                                                        {reply.userId === userId || session?.user?.role === 'admin' ? (
                                                            <RiDeleteBinLine 
                                                                className='flex cursor-pointer text-gray-400 w-3 h-3 mr-2'
                                                                onClick={() => handleDeleteReply(reply._id)}
                                                            />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </div>
                            </>
                            )}
                           
                        </div>
                    ))}  
                </div>    
            </div>
        </div>
    );
};

export default ArticleView;

