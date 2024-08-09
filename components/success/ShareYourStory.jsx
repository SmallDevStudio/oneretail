import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import { Dialog, Slide, CircularProgress, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import CommentInput from "../comments/CommentInput";
import PostInput from "../comments/PostInput";
import ReplyInput from "../comments/ReplyInput";
import { PiUserCircleDuotone } from "react-icons/pi";
import ImageGallery from "../club/ImageGallery";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ShareYourStory = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState({});
    const [showInputReply, setShowInputReply] = useState({});
    const [reply, setReply] = useState('');
    const [showReply, setShowReply] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDialog, setCurrentDialog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentOption, setCurrentOption] = useState(null);
    const [likes, setLikes] = useState({});

    const { data, error, mutate } = useSWR('/api/posts', fetcher, {
        onSuccess: (data) => {
            setPosts(data.data);
        }
    });

    const { data: user, mutate: mutateUser } = useSWR(`/api/users/${session?.user?.id}`, fetcher);

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

            const response = await axios.post('/api/posts', {
                post: data.post,
                link: data.link,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                userId
            });

            const post = response.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        description: `${user?.user?.fullname} ได้แท็คโพสใน Share Your Story`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Post',
                        url: `${window.location.origin}/stores?tab=share-your-story#${post._id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
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
            const response = await axios.post('/api/posts/comments', {
                comment: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                postId,
                userId,
            });

            const post = response.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        description: `${user?.user?.fullname} ได้แท็คโพสใน Share Your Story`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Comment',
                        url: `${window.location.origin}/stores?tab=share-your-story#${post._id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
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
            const response = await axios.post('/api/posts/replys', {
                reply: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                commentId,
                userId
            });

            const post = response.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        description: `${user?.user?.fullname} ได้แท็คโพสใน Share Your Story`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Reply',
                        url: `${window.location.origin}/stores?tab=share-your-story#${post.commentId}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
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
                userId
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
                userId
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

    const handleReplyLike = async (replyId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/posts/replylike', {
                replyId,
                userId
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
            try {
                await axios.delete(`/api/posts?postId=${postId}`);
                mutate();
                Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
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
                await axios.delete(`/api/posts/comment?commentId=${commentId}`);
                mutate();
                Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
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
                await axios.delete(`/api/posts/reply?replyId=${replyId}`);
                mutate();
                Swal.fire('Deleted!', 'Your reply has been deleted.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'There was an issue deleting the reply.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    if (error) return <div>failed to load</div>;
    if (!data) return (
        <div className="flex justify-center items-center w-full h-full p-10">
            <CircularProgress />
        </div>
    );

    return (
        <div className="flex flex-col text-white text-sm">
            {/* Input Post */}
            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center justify-center px-2 w-full gap-1">
                    <div className="flex justify-center items-center">
                        <Image
                            src={user.user?.pictureUrl}
                            alt="user"
                            width={30}
                            height={30}
                            className="rounded-full border-2"
                            loading="lazy"
                            style={{ width: '40px', height: '40px' }}
                        />
                    </div>
                    <div className="relative w-5/6 p-2 text-xs bg-gray-200 outline-none rounded-full h-8">
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
            <div className="flex flex-col w-full align-top mt-2 bg-gray-300 min-h-[100vh] text-gray-700">
                {Array.isArray(posts) && posts.map((post, index) => (
                    <div key={index} className="flex flex-col px-2 w-full gap-2 bg-gray-100 py-2 rounded mb-2" id={post?._id}>
                        <div className="flex flex-row align-top items-start">
                            <div className="flex items-start align-top w-[35px] h-[auto] pt-1">
                                <Image
                                    src={post?.user?.pictureUrl}
                                    alt="user"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </div>
                            <div className="flex flex-col w-full ml-2">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-xs font-bold text-[#0056FF]">{post?.user?.fullname}</p>
                                    {(post.userId === session?.user?.id || user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                        <div className="relative">
                                            <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'post', post._id)} />
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleOptionClose}
                                                classes={{ paper: "text-xs" }}
                                            >
                                                <MenuItem onClick={() => { handleDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                <MenuItem >Point</MenuItem>
                                            </Menu>
                                        </div>
                                    )}
                                </div>
                                <p className=" text-left text-[8px]">{moment(post?.createdAt).fromNow()}</p>
                                {post?.tagusers.length > 0 && post?.tagusers.map((taguser, index) => (
                                    <div className="flex flex-row w-full items-center gap-1 mb-2 mt-[-5px]" key={index}>
                                        <PiUserCircleDuotone className="flex text-md"/>
                                        <div key={index} className="flex w-full">
                                            <span className="text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-full text-left">
                            {post?.post && (
                                <p className="text-xs ml-2">{post?.post}</p>
                            )}
                            {post?.medias.length > 0 && (
                                <ImageGallery medias={post.medias} />
                            )}
                        </div>
                        <div className="flex flex-col w-full mt-2">
                            <div className="flex flex-row items-center justify-between w-full pl-4 pr-2">
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

                            {showComments[post._id] && Array.isArray(post.comments) && post.comments.map((comment, commentIndex) => (
                                <div key={commentIndex} className="flex flex-col w-full bg-gray-200 rounded-lg mt-2 ml-2 text-left">
                                    <div className="flex flex-row items-center px-2 w-full gap-2 rounded-lg mt-1">
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
                                                {(comment.userId === session?.user?.id || user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                                    <div className="relative">
                                                        <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'comment', comment._id)} />
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleOptionClose}
                                                            classes={{ paper: "text-xs" }}
                                                        >
                                                            <MenuItem onClick={() => { handleCommentDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                        </Menu>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[8px]">{moment(comment?.createdAt).fromNow()}</p>
                                            {comment?.tagusers.length > 0 && comment?.tagusers.map((taguser, index) => (
                                                <div className="flex flex-row w-full items-center gap-1 mb-2 mt-[-5px]" key={index}>
                                                    <PiUserCircleDuotone className="flex text-md"/>
                                                    <div key={index} className="flex w-full">
                                                        <span className="text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <p className="text-xs ml-2">{comment?.comment}</p>
                                        {comment?.medias.length > 0 && (
                                            <ImageGallery medias={comment.medias} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center justify-between w-full px-4 pb-2 mt-1">
                                            <div className="flex flex-row items-center gap-2">
                                                {likes[comment._id] ? (
                                                    <AiFillHeart className="w-3 h-3 text-red-500" onClick={() => handleCommentLike(comment._id)} />
                                                ) : (
                                                    <AiOutlineHeart className="w-3 h-3" onClick={() => handleCommentLike(comment._id)} />
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
                                                 แสดงความคิดเห็น
                                                </span>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <span className="text-xs cursor-pointer" onClick={() => setShowReply(showReply !== comment._id ? comment._id : null)}>
                                                    {showReply[comment._id] ? 'ซ่อนความคิดเห็น' : 'ดูความคิดเห็น'}
                                                </span>
                                                <span className="text-xs">{Array.isArray(comment.reply) ? comment.reply.length : 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {showReply[comment._id] && Array.isArray(comment.reply) && comment.reply.map((reply, replyIndex) => (
                                        <div key={replyIndex} className="flex flex-col w-5/7 justify-end bg-gray-300 rounded-lg px-2 pb-2 ml-4 mb-1">
                                            <div className="flex flex-row items-center px-2 py-1 w-full gap-2 justify-end rounded-lg ">
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
                                                        {(reply.userId === session?.user?.id || user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                                            <div className="relative">
                                                                <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'reply', reply._id)} />
                                                                <Menu
                                                                    anchorEl={anchorEl}
                                                                    open={Boolean(anchorEl)}
                                                                    onClose={handleOptionClose}
                                                                    classes={{ paper: "text-xs" }}
                                                                >
                                                                    <MenuItem onClick={() => { handleReplyDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                                </Menu>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[8px]">{moment(reply?.createdAt).fromNow()}</p>
                                                    {reply?.tagusers.length > 0 && reply?.tagusers.map((taguser, index) => (
                                                        <div className="flex flex-row w-full items-center gap-1 mb-2 mt-[-5px]" key={index}>
                                                        <PiUserCircleDuotone className="flex text-md"/>
                                                        <div key={index} className="flex w-full">
                                                            <span className="text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                                        </div>
                                                        </div>
                                                    ))}
                                                    <p className="text-xs">{reply?.reply}</p>
                                                    {reply?.medias.length > 0 && (
                                                        <ImageGallery medias={reply.medias} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center gap-2 justify-between pl-10 pr-1 mt-1 w-full">
                                                <div className="flex flex-row items-center gap-2">
                                                    {likes[reply._id] ? (
                                                        <AiFillHeart className="w-3 h-3 text-red-500" onClick={() => handleReplyLike(reply._id, comment.experienceId)} />
                                                    ) : (
                                                        <AiOutlineHeart className="w-3 h-3" onClick={() => handleReplyLike(reply._id, comment.experienceId)} />
                                                    )}
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
                    {currentDialog?.type === 'post' && <PostInput handleSubmit={handlePostSubmit} userId={session?.user?.id} handleClose={handleClose} />}
                    {currentDialog?.type === 'comment' && <CommentInput handleSubmit={(data) => handleCommentSubmit(currentDialog.id, data)} userId={session?.user?.id} handleClose={handleClose} />}
                    {currentDialog?.type === 'reply' && <ReplyInput handleSubmit={(data) => handleReplySubmit(currentDialog.id, data)} userId={session?.user?.id} handleClose={handleClose} />}
                </div>
            </Dialog>
            <Dialog open={loading} onClose={() => setIsLoading(false)}>
                <div className="flex justify-center items-center w-full h-full p-10">
                    <CircularProgress />
                </div>
            </Dialog>
        </div>
    );
};

export default ShareYourStory;
