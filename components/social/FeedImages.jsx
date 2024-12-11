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
import { PiUserCircleDuotone } from "react-icons/pi";
import ImageGallery from "@/components/club/ImageGallery";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
import { BsPinAngleFill } from "react-icons/bs";
import Loading from "@/components/Loading";
import Modal from "../Modal";


moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FeedImages = ({ user, posts }) => {
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
    const [selectedPost, setSelectedPost] = useState(null);
    const [showPost, setShowPost] = useState(false);

    const router = useRouter();

    const folder = 'share-your-story';

    useEffect(() => {
        if (posts.length) {
            const initialLikes = posts.reduce((acc, post) => {
                acc[post._id] = post.likes.some(like => like.userId === session?.user?.id);
                post?.comments.forEach(comment => {
                    acc[comment._id] = comment?.likes?.some(like => like.userId === session?.user?.id);
                    comment?.reply?.forEach(reply => {
                        acc[reply._id] = reply?.likes?.some(like => like.userId === session?.user?.id);
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
                        description: `ได้แท็คโพสใน Share Your Story`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Post',
                        url: `${window.location.origin}stores?tab=share-your-story#${post._id}`,
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
                        description: `ได้แท็คโพสใน Share Your Story`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Comment',
                        url: `${window.location.origin}stores?tab=share-your-story#${post._id}`,
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
                        description: `ได้แท็คโพสใน Share Your Story`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Reply',
                        url: `${window.location.origin}stores?tab=share-your-story#${post.commentId}`,
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

    const handlePoints = async (post) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจ?',
            text: `ที่จะให้ 500 Points กับ ${post.user.fullname} หรือไม่`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'Cancel',
        });
    
        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.post('/api/points/point', {
                    userId: post.user._id,
                    description: `ได้ Point จากโพส Share Your Story`,
                    contentId: post._id,
                    path: 'share your story',
                    subpath: 'post',
                    points: 500,
                    type: 'earn',
                });
                mutate();
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'There was an issue deleting the post.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePinned = async (postId, pinned) => {
        if (!pinned || pinned === false || pinned === null) {
            pinned = true;
        } else {
            pinned = false;
        }

        try {
            await axios.put('/api/posts/pinned', {
                id: postId,
                pinned
            });
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectPost = (post) => {
        setSelectedPost(post);
        setShowPost(true);
    }

    const handleClosePost = () => {
        setShowPost(false);
        setSelectedPost(null);
    }

    console.log('selected post:', selectedPost);

    if (!posts) return <Loading />;
    

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-3 justify-between w-full">
                {posts
                    .filter(post => post?.medias?.some(media => media.type === "image")) // กรองโพสต์ที่มีเฉพาะภาพ
                    .map((post, postIndex) => (
                        <React.Fragment key={postIndex}>
                            {post?.medias
                                ?.filter(media => media.type === "image") // กรองเฉพาะ media ที่เป็นภาพ
                                .map((media, mediaIndex) => (
                                    <div 
                                        key={mediaIndex} 
                                        className="p-1"
                                        onClick={() => handleSelectPost(post)}
                                    > {/* เพิ่ม padding เพื่อแยกรูป */}
                                        <Image
                                            src={media.url}
                                            alt="Post Image"
                                            width={100}
                                            height={100}
                                            className="rounded-md"
                                            style={{
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                height: "120px",
                                                width: "120px",
                                            }}
                                        />
                                    </div>
                                ))}
                        </React.Fragment>
                    ))}
            </div>

            {selectedPost && showPost && (
                <Modal
                    open={showPost}
                    onClose={handleClosePost}
                >
                    <div className="flex flex-col w-full overflow-y-auto">
                        {/* post header */}
                        <div className="flex flex-row items-center w-full gap-1">
                            <div className="flex flex-col w-[50px]">
                                <Image
                                    src={selectedPost?.user?.pictureUrl}
                                    alt="User Avatar"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        height: "32px",
                                        width: "32px",
                                    }}
                                    onClick={() => {
                                        router.push(`/p/${selectedPost?.user?.userId}`);
                                        handleClosePost();
                                    }}
                                />
                            </div>
                            <div className="flex flex-col w-full text-sm">
                                <span className="font-bold text-[#0056FF]">{selectedPost?.user?.fullname}</span>
                                <span className="text-gray-500 text-xs">{moment(selectedPost?.createdAt).fromNow()}</span>
                            </div>
                        </div>

                        {/* post content */}
                        <div className="flex flex-col w-full mt-2">
                            <span className="text-sm">{selectedPost?.post}</span>
                            {selectedPost?.medias?.map((media, index) => (
                                <div key={index} className="flex flex-col w-full">
                                    <Image
                                        src={media.url}
                                        alt="Post Image"
                                        width={500}
                                        height={500}
                                        className="rounded-md"
                                        style={{
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            height: "auto",
                                            width: "100%",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* post footer */}
                        <div className="flex flex-row justify-between w-full mt-2">
                            <div className="flex flex-row items-center gap-1">
                                {likes[selectedPost._id] ? (
                                    <AiFillHeart className="w-4 h-4 text-red-500" onClick={() => handleLike(post._id)} />
                                ) : (
                                    <AiOutlineHeart className="w-4 h-4" onClick={() => handleLike(post._id)} />
                                )}
                                <span>
                                    {Array.isArray(selectedPost?.likes) ? selectedPost?.likes.length : 0}
                                </span>
                            </div>

                                <div className="flex flex-row items-center gap-2">
                                    <svg className='w-3 h-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                    <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                    <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                    <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                    <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                                    </svg>
                                    <span className="text-xs cursor-pointer" onClick={() => handleClickOpen('comment', selectedPost._id)}>
                                        แสดงความคิดเห็น
                                    </span>
                                </div>
                                    
                                <div className="flex flex-row items-center gap-2">
                                    <span className="text-xs cursor-pointer" onClick={() => setShowComments(showComments !== selectedPost._id ? selectedPost._id : null)}>
                                        {showComments === selectedPost._id ? 'ซ่อนความคิดเห็น' : 'ดูความคิดเห็น'}
                                    </span>
                                    <span className="text-xs">{Array.isArray(selectedPost.comments) ? selectedPost.comments.length : 0}</span>
                                </div>
                        </div>

                        {showComments === selectedPost._id && Array.isArray(selectedPost.comments) && selectedPost.comments.map((comment, commentIndex) => (
                                <div key={commentIndex} className="flex flex-col w-full">
                                <div className="flex flex-col w-full bg-gray-300 rounded-lg mt-2">
                                    <div className="flex flex-row items-center px-2 w-full gap-2 rounded-lg mt-1">
                                        <div className="flex items-center justify-center align-top w-[25px]">
                                            <Image
                                                src={comment?.user?.pictureUrl}
                                                alt="user"
                                                width={20}
                                                height={20}
                                                className="rounded-full"
                                                style={{ width: '20px', height: '20px' }}
                                                loading="lazy"
                                                onClick={() => router.push(`/p/${comment?.user?.userId}`)}
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-row justify-between items-center">

                                                <p 
                                                    className="text-xs font-bold text-[#0056FF]"
                                                    onClick={() => router.push(`/p/${comment?.user?.userId}`)}
                                                >
                                                    {comment?.user?.fullname}
                                                </p>

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
                                            <p className="text-[10px] text-left">{moment(comment?.createdAt).fromNow()}</p>
                                            <div className="inline flex-wrap flex-row text-left gap-1 items-center w-full mt-[-5px]">
                                                {comment?.tagusers.length > 0 && comment?.tagusers.map((taguser, index) => (
                                                <span key={index} className="inline-block text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col px-1 w-full">
                                        <p className="text-sm text-left px-1">{comment?.comment}</p>
                                        {comment?.sticker && comment.sticker.url ?
                                            <div className="flex">
                                                <Image
                                                    src={comment?.sticker?.url}
                                                    alt="sticker"
                                                    width={100}
                                                    height={100}
                                                    className="rounded-lg"
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            </div>
                                        : null}
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
                                                    {showReply === comment._id ? 'ซ่อนความคิดเห็น' : 'ดูความคิดเห็น'}
                                                </span>
                                                <span className="text-xs">{Array.isArray(comment.reply) ? comment.reply.length : 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    </div>

                                    {showReply === comment._id && Array.isArray(comment.reply) && comment.reply.map((reply, replyIndex) => (
                                        <div key={replyIndex} className="flex flex-col w-full pl-5 mt-1 ml-2">
                                        <div  className="flex flex-col bg-gray-200 rounded-lg  w-full ">
                                            <div className="flex flex-row w-full  p-2 gap-2">
                                                <div className="flex w-[25px]">
                                                    <Image
                                                        src={reply?.user?.pictureUrl}
                                                        alt="user"
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full"
                                                        style={{ width: '20px', height: '20px' }}
                                                        loading="lazy"
                                                        onClick={() => router.push(`/p/${reply?.user?.userId}`)}
                                                    />
                                                </div>

                                                <div className="flex flex-col w-full">
                                                    <div className="flex flex-row justify-between items-center">

                                                        <p 
                                                            className="text-xs font-bold text-[#0056FF]"
                                                            onClick={() => router.push(`/p/${reply?.user?.userId}`)}
                                                        >
                                                            {reply?.user?.fullname}
                                                        </p>

                                                        {(reply.userId === session?.user?.id || user?.user?.role === 'admin' || user?.user?.role === 'manager') && (
                                                            <div className="relative">
                                                                <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'reply', reply._id)} />
                                                                <Menu
                                                                    anchorEl={anchorEl}
                                                                    open={Boolean(anchorEl)}
                                                                    onClose={handleOptionClose}
                                                                    classes={{ paper: "text-xs" }}
                                                                    sx={{ fontSize: '10px' }}
                                                                >
                                                                    <MenuItem onClick={() => { handleReplyDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                                </Menu>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex text-[10px]">{moment(reply?.createdAt).fromNow()}</p>
                                                    <div className="inline flex-wrap flex-row text-left gap-1 items-center w-full mt-[-5px]">
                                                        {reply?.tagusers.length > 0 && reply?.tagusers.map((taguser, index) => (
                                                            <span key={index} className="inline-block text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-left px-1">{reply?.reply}</p>
                                                    {reply?.sticker && reply?.sticker?.url && (
                                                        <div className="flex">
                                                            <Image
                                                                src={reply?.sticker?.url}
                                                                alt="sticker"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-lg"
                                                                style={{ width: '100px', height: 'auto' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {reply?.medias.length > 0 && (
                                                        <ImageGallery medias={reply.medias} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center gap-2 justify-between pl-5 py-1 mt-1 w-full">
                                                <div className="flex flex-row items-center gap-2">
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
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                
                            ))}
                    </div>
                </Modal>
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
    );
};

export default FeedImages;