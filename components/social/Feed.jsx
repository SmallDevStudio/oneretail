import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { Dialog, Slide, CircularProgress, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import CommentInput from "@/components/comments/CommentInput";
import PostInput from "@/components/comments/PostInput";
import ReplyInput from "@/components/comments/ReplyInput";
import ImageGallery from "@/components/main/ImageGallery";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
import { BsPinAngleFill } from "react-icons/bs";
import Loading from "@/components/Loading";
import Avatar from "@/components/utils/Avatar";
import PostPanel from "./Post/PostPanel";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Feed = ({ user, posts }) => {
    const { data: session } = useSession();
    const [showComments, setShowComments] = useState({});
    const [showReply, setShowReply] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDialog, setCurrentDialog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentOption, setCurrentOption] = useState(null);
    const [likes, setLikes] = useState({});
    const [checkError, setCheckError] = useState(null);
    const [tagMore, setTagMore] = useState(false);

    const router = useRouter();

    const folder = 'post';

    useEffect(() => {
        if (posts.length) {
            const initialLikes = posts.reduce((acc, post) => {
                acc[post._id] = post.likes.some(like => like.userId === session?.user?.id);
                post.comments.forEach(comment => {
                    acc[comment._id] = comment.likes.some(like => like.userId === session?.user?.id);
                    comment.reply.forEach(reply => {
                        acc[reply._id] = reply.likes.some(like => like.userId === session?.user?.id);
                    });
                });
                return acc;
            }, {});
            setLikes(initialLikes);
        }
    }, [posts, session]);

    const handleOptionClick = (event, type, id) => {
        setAnchorEl(event.currentTarget);
        setCurrentOption({ type, id });
    };

    const handleOptionClose = () => {
        setAnchorEl(null);
        setCurrentOption(null);
    };

    const handleClickOpen = (type, id) => {
        setCurrentDialog({ type, id });
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setCurrentDialog(null);
    };

    const handlePostSubmit = async (data) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
    
            // Check if there is either post content or media content
            if (!data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }
    

            const response = await axios.post('/api/posts', {
                post: data.post,
                link: data.link,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                pinned: false,
                userId,
                page: 'post'
            });

            const post = response.data.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    const response = await axios.post('/api/notifications', {
                        userId: user.userId,
                        senderId: userId,
                        description: `ได้แท็คโพสใน One Society`,
                        referId: post._id,
                        path: 'post',
                        subpath: 'Post',
                        url: `${window.location.origin}one-society#${post._id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            handleClose();
            mutate();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (postId, data) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
    
            // Check if there is either post content or media content
            if (!data.sticker && !data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }
    
            const response = await axios.post('/api/posts/comments', {
                comment: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                sticker: data.sticker,
                postId,
                userId,
            });

            const post = response.data.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        senderId: userId,
                        description: `ได้แท็คโพสใน One Society`,
                        referId: post._id,
                        path: 'post',
                        subpath: 'Comment',
                        url: `${window.location.origin}one-society#${post._id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            mutate();
            handleClose();
            setShowComments({ ...showComments, [postId]: true });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleReplySubmit = async (commentId, data) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
    
            // Check if there is either post content or media content
            if (!data.sticker && !data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }
    
            const response = await axios.post('/api/posts/replys', {
                reply: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                sticker: data.sticker,
                commentId,
                userId
            });

            const post = response.data.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        senderId: userId,
                        description: `ได้แท็คโพสใน One Society`,
                        referId: post._id,
                        path: 'post',
                        subpath: 'Reply',
                        url: `${window.location.origin}one-society#${post.commentId}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            mutate();
            handleClose();
            setShowReply({ ...showReply, [commentId]: true });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/posts/like', {
                postId,
                userId,

            });

            setLikes(prevLikes => ({
                ...prevLikes,
                [postId]: !prevLikes[postId]
            }));
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentLike = async (commentId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/posts/commentlike', {
                commentId,
                userId,
            });

            setLikes(prevLikes => ({
                ...prevLikes,
                [commentId]: !prevLikes[commentId]
            }));
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReplyLike = async (replyId, postId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/posts/replylike', {
                replyId,
                userId,
                postId,
               
            });

            setLikes(prevLikes => ({
                ...prevLikes,
                [replyId]: !prevLikes[replyId]
            }));
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (postId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this post? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
    
        if (result.isConfirmed) {
            setLoading(true);
            const userId = session?.user?.id;
            try {
                await axios.delete(`/api/posts?postId=${postId}&userId=${userId}`);
                mutate();
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'There was an issue deleting the post.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleCommentDelete = async (commentId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this comment? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
    
        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`/api/posts/comments?commentId=${commentId}`);
                mutate();
            } catch (error) {
                console.error('Error deleting comment:', error);
                Swal.fire('Error!', 'There was an issue deleting the comment.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleReplyDelete = async (replyId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this reply? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
    
        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`/api/posts/replys?replyId=${replyId}`);
                mutate();
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'There was an issue deleting the reply.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };
    
    return (
        (!posts || posts.length === 0) ? (
            <Loading />
        ) : (
            <div className="flex flex-col max-w-screen">
            {/* Input Post */}
            <div className="flex flex-col bg-white py-2">
                <div className="flex flex-row items-center justify-center px-2 w-full gap-2">
                    <div>
                        <Avatar 
                            src={user?.user?.pictureUrl} 
                            size={40} 
                            userId={user?.user?.userId} 
                        />
                    </div>
                    <div className="relative w-5/6 p-2 text-xs border border-gray-200 outline-none rounded-full h-8">
                        <input
                            type="text"
                            placeholder="คุณคิดอะไรอยู่..?"
                            className="w-full bg-transparent focus:outline-none"
                            onClick={() => handleClickOpen('post')}
                        />
                    </div>
                </div>
            </div>

            {/* Post Container */}
            {!posts ? (
                <Loading />
            ): (
                <div className="flex flex-col bg-gray-300 text-gray-700 mt-2 max-w-screen">
                {posts.map((post, index) => (
                    !post ? (
                        <CircularProgress key={index} />
                    ): (
                    <>
                    <div 
                        key={index} 
                        id={post?._id} 
                        className="flex flex-col px-2 gap-2 bg-gray-100 py-2 mb-2 p-2"
                    >
                        {/* Header */}
                        <div className="flex flex-row justify-between w-full">
                            <div className="flex flex-row w-full gap-2">
                                <Avatar
                                    src={post?.user?.pictureUrl}
                                    size={40}
                                    userId={post?.user?.userId}
                                />
                                <div className="flex flex-col text-sm w-[calc(100%-50px)]">
                                    <div className="flex flex-row flex-wrap items-center gap-2 text-sm font-bold text-[#0056FF]">
                                        <span
                                            onClick={() => router.push(`/p/${post?.user?.userId}`)}
                                        >
                                            {post?.user?.fullname}
                                        </span>
                                        {post?.page !== "post" && 
                                            <>
                                            <span className="text-gray-500">{'>'}</span>
                                            <span 
                                                className="text-[#F68B1F]"
                                                onClick={() => router.push(`/stores?tab=share-your-story#${post?._id}`)}
                                            > 
                                                {post?.page}
                                            </span>
                                            </>
                                        }
                                        <div className="flex flex-row flex-wrap items-center gap-1 mt-[-5px]">
                                        {post?.tagusers && post?.tagusers.length > 0 && (
                                            <>
                                            <span className="text-gray-500 text-xs">กับ</span>
                                            {tagMore && post?.tagusers ? (
                                                post?.tagusers.slice(0, 2).map((user) => (
                                                    <span
                                                        key={user.userId}
                                                        className="inline text-[#F68B1F] text-xs"
                                                        onClick={() => router.push(`/p/${user.userId}`)}
                                                    >
                                                        {user.fullname}
                                                    </span>
                                                    ))
                                                ):(
                                                    post?.tagusers.map((user) => (
                                                        <span
                                                            key={user.userId}
                                                            className="inline text-[#F68B1F] text-xs"
                                                            onClick={() => router.push(`/p/${user.userId}`)}
                                                        >
                                                            {user.fullname}
                                                        </span>
                                                    )
                                                ))}
                                                {tagMore && post?.tagusers?.length > 2 ? (
                                                    <span onClick={() => setTagMore(false)} className="text-gray-500 text-xs">ดูน้อยลง</span>
                                                    ): (
                                                    <span onClick={() => setTagMore(true)} className="text-gray-500 text-xs">ดูเพิ่มขึ้น</span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        </div>
                                        <span className="text-gray-500 text-xs">{moment(post?.createdAt).fromNow()}</span>
                                </div>
                            </div>
                            
                            <div>
                                {(user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                    <div className="relative">
                                        <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'post', post._id)} />
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && currentOption?.id === post._id}
                                            onClose={handleOptionClose}
                                            classes={{ 
                                                paper: "text-xs",
                                                }}
                                        >
                                            <MenuItem onClick={() => { handleDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                        </Menu>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Post */}
                        <div className="flex flex-col">
                            {post?.post && (
                                <span className="text-sm mb-1">{post?.post}</span>
                            )}
                            {post?.medias.length > 0 && (
                                <ImageGallery medias={post.medias} userId={session?.user?.id} />
                            )}              
                            {post?.sticker && post?.sticker?.url && (
                                <div className="flex flex-col justify-center items-center w-full">
                                    <Image
                                        src={post?.sticker?.url}
                                        alt="sticker"
                                        width={200}
                                        height={200}
                                        priority
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-row justify-between w-full px-2">
                            <div className="flex flex-row items-center gap-2">
                                {likes[post._id] ? (
                                    <AiFillHeart className="w-4 h-4 text-red-500" onClick={() => handleLike(post._id)} />
                                ) : (
                                    <AiOutlineHeart className="w-4 h-4" onClick={() => handleLike(post._id)} />
                                )}
                                <span>
                                    {Array.isArray(post?.likes) ? post?.likes.length : 0}
                                </span>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <svg className='w-3 h-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                    <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                    <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                    <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                    <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                                </svg>
                                <span className="text-xs cursor-pointer" onClick={() => handleClickOpen('comment', post._id)}>
                                    แสดงความคิดเห็น
                                </span>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <span className="text-xs cursor-pointer" onClick={() => setShowComments(showComments !== post._id ? post._id : null)}>
                                    {showComments === post._id ? 'ซ่อนความคิดเห็น' : 'ดูความคิดเห็น'}
                                </span>
                                <span className="text-xs">{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                            </div>

                        </div>
                        
                    </div>
                    {/* Comment */}
                    {showComments === post._id && (
                        <div className="flex flex-col gap-2 bg-gray-100 px-4 py-2 mb-2">
                            {post.comments.map((comment, commentIndex) => (
                                <>
                                    <div
                                        key={commentIndex}
                                        className="flex flex-col w-full gap-2"
                                    >
                                        <div className="flex flex-row w-full gap-2">
                                            <Avatar
                                                src={comment?.user?.pictureUrl}
                                                size={30}
                                                userId={comment?.user?.userId}
                                            />
                                             <div className="flex flex-col text-sm w-[calc(100%-50px)]">
                                                <div className="flex flex-row flex-wrap items-center gap-2 text-sm font-bold text-[#0056FF]">
                                                    <span
                                                        onClick={() => router.push(`/p/${comment?.user?.userId}`)}
                                                    >
                                                        {comment?.user?.fullname}
                                                    </span>
                                                    <div className="flex flex-row flex-wrap items-center gap-1 mt-[-5px]">
                                                    {comment?.tagusers && comment?.tagusers.length > 0 && (
                                                        <>
                                                        <span className="text-gray-500 text-xs">กับ</span>
                                                        {tagMore && comment?.tagusers ? (
                                                            comment?.tagusers.slice(0, 2).map((user) => (
                                                                <span
                                                                    key={user.userId}
                                                                    className="inline text-[#F68B1F] text-xs"
                                                                    onClick={() => router.push(`/p/${user.userId}`)}
                                                                >
                                                                    {user.fullname}
                                                                </span>
                                                                ))
                                                            ):(
                                                                comment?.tagusers.map((user) => (
                                                                    <span
                                                                        key={user.userId}
                                                                        className="inline text-[#F68B1F] text-xs"
                                                                        onClick={() => router.push(`/p/${user.userId}`)}
                                                                    >
                                                                        {user.fullname}
                                                                    </span>
                                                                )
                                                            ))}
                                                            {tagMore && comment?.tagusers?.length > 2 ? (
                                                                <span onClick={() => setTagMore(false)} className="text-gray-500 text-xs">ดูน้อยลง</span>
                                                                ): (
                                                                <span onClick={() => setTagMore(true)} className="text-gray-500 text-xs">ดูเพิ่มขึ้น</span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                </div>
                                                <span className="text-gray-500 text-xs">{moment(comment?.createdAt).fromNow()}</span>
                                            </div>
                                            {(comment.userId === session?.user?.id || user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                                <div className="relative">
                                                    <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'comment', comment._id)} />
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleOptionClose}
                                                        classes={{ paper: "text-xs" }}
                                                        sx={{ fontSize: "8px" }}
                                                    >
                                                        <MenuItem onClick={() => { handleCommentDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                    </Menu>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            {comment?.comment && (
                                                <span className="text-sm mb-1">{comment?.comment}</span>
                                            )}
                                            {comment?.medias.length > 0 && (
                                                <ImageGallery medias={comment.medias} userId={session?.user?.id} />
                                            )}              
                                            {comment?.sticker && comment?.sticker?.url && (
                                                <div className="flex flex-col w-full">
                                                    <Image
                                                        src={comment?.sticker?.url}
                                                        alt="sticker"
                                                        width={100}
                                                        height={100}
                                                        priority
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-row justify-between w-full px-2">
                                            <div className="flex flex-row items-center gap-2">
                                                {likes[comment._id] ? (
                                                    <AiFillHeart className="w-4 h-4 text-red-500" onClick={() => handleCommentLike(comment._id)} />
                                                ) : (
                                                    <AiOutlineHeart className="w-4 h-4" onClick={() => handleCommentLike(comment._id)} />
                                                )}
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
                                                <span className="text-xs cursor-pointer" onClick={() => handleClickOpen('reply', comment._id)}>
                                                 ตอบกลับความคิดเห็น
                                                </span>
                                            </div>

                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-xs cursor-pointer" onClick={() => setShowReply(showReply !== comment._id ? comment._id : null)}>
                                                    {showReply === comment._id ? 'ซ่อนตอบกลับความคิดเห็น' : 'ดูตอบกลับความคิดเห็น'}
                                                </span>
                                                <span className="text-xs">{Array.isArray(comment.reply) ? comment.reply.length : 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            {showReply === comment._id && Array.isArray(comment.reply) && comment.reply.map((reply, replyIndex) => (
                                                <div
                                                    key={replyIndex}
                                                    className="flex flex-col w-full gap-2"
                                                >
                                                    <div className="flex flex-row w-full gap-2">
                                                        <Avatar
                                                            src={reply?.user?.pictureUrl}
                                                            size={30}
                                                            userId={reply?.user?.userId}
                                                        />
                                                        <div className="flex flex-col text-sm w-[calc(100%-40px)]">
                                                            <div className="flex flex-row flex-wrap items-center gap-2 text-xs font-bold text-[#0056FF]">
                                                                <span
                                                                    onClick={() => router.push(`/p/${reply?.user?.userId}`)}
                                                                >
                                                                    {reply?.user?.fullname}
                                                                </span>
                                                                <div className="flex flex-row flex-wrap items-center gap-1 mt-[-5px]">
                                                                {reply?.tagusers && reply?.tagusers.length > 0 && (
                                                                    <>
                                                                    <span className="text-gray-500 text-xs">กับ</span>
                                                                    {tagMore && reply?.tagusers ? (
                                                                        reply?.tagusers.slice(0, 2).map((user) => (
                                                                            <span
                                                                                key={user.userId}
                                                                                className="inline text-[#F68B1F] text-xs"
                                                                                onClick={() => router.push(`/p/${user.userId}`)}
                                                                            >
                                                                                {user.fullname}
                                                                            </span>
                                                                            ))
                                                                        ):(
                                                                            reply?.tagusers.map((user) => (
                                                                                <span
                                                                                    key={user.userId}
                                                                                    className="inline text-[#F68B1F] text-xs"
                                                                                    onClick={() => router.push(`/p/${user.userId}`)}
                                                                                >
                                                                                    {user.fullname}
                                                                                </span>
                                                                            )
                                                                        ))}
                                                                        {tagMore && reply?.tagusers?.length > 2 ? (
                                                                            <span onClick={() => setTagMore(false)} className="text-gray-500 text-xs">ดูน้อยลง</span>
                                                                            ): (
                                                                            <span onClick={() => setTagMore(true)} className="text-gray-500 text-xs">ดูเพิ่มขึ้น</span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>  
                                                            </div>
                                                            <span className="text-gray-500 text-xs">{moment(reply?.createdAt).fromNow()}</span>
                                                        </div>
                                                        {(reply?.userId === session?.user?.id || user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                                            <div className="relative">
                                                                <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'comment', comment._id)} />
                                                                <Menu
                                                                    anchorEl={anchorEl}
                                                                    open={Boolean(anchorEl)}
                                                                    onClose={handleOptionClose}
                                                                    classes={{ paper: "text-xs" }}
                                                                    sx={{ fontSize: "8px" }}
                                                                >
                                                                    <MenuItem onClick={() => { handleReplyDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                                </Menu>
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div className="flex flex-col">
                                                        {reply?.reply && (
                                                            <span className="text-sm mb-1">{reply?.reply}</span>
                                                        )}
                                                        {reply?.medias.length > 0 && (
                                                            <ImageGallery medias={reply.medias} userId={session?.user?.id} />
                                                        )}              
                                                        {reply?.sticker && reply?.sticker?.url && (
                                                            <div className="flex flex-col w-full">
                                                                <Image
                                                                    src={reply?.sticker?.url}
                                                                    alt="sticker"
                                                                    width={100}
                                                                    height={100}
                                                                    priority
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-row justify-between w-full px-2">
                                                        {likes[reply._id] ? (
                                                            <AiFillHeart className="w-3 h-3 text-red-500" onClick={() => handleReplyLike(reply._id, comment.postId)} />
                                                        ) : (
                                                            <AiOutlineHeart className="w-3 h-3" onClick={() => handleReplyLike(reply._id, comment.postId)} />
                                                        )}
                                                        <span className="text-sm">
                                                            {Array.isArray(reply?.likes)? reply?.likes?.length : 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </>
                            ))}
                        </div>
                    )}
                    </>
                    )
                ))}
                </div>
            )}
            
            <Dialog 
                fullScreen
                open={isDialogOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <div className="flex flex-col mt-2 p-2 max-h-screen">
                    {currentDialog?.type === 'post' && <PostInput handleSubmit={handlePostSubmit} userId={session?.user?.id} handleClose={handleClose} checkError={checkError} folder={folder} />}
                    {currentDialog?.type === 'comment' && <CommentInput handleSubmit={(data) => handleCommentSubmit(currentDialog.id, data)} userId={session?.user?.id} handleClose={handleClose} checkError={checkError} folder={folder}/>}
                    {currentDialog?.type === 'reply' && <ReplyInput handleSubmit={(data) => handleReplySubmit(currentDialog.id, data)} userId={session?.user?.id} handleClose={handleClose} checkError={checkError} folder={folder}/>}
                </div>
            </Dialog>
            <Dialog open={loading} onClose={() => setIsLoading(false)}>
                <div className="flex justify-center items-center w-full h-full p-10">
                    <CircularProgress />
                </div>
            </Dialog>

        </div>
        )
    );
};

export default Feed;