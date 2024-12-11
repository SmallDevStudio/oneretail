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


moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FeedVideo = ({ user, posts }) => {
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

    if (!posts) return <Loading />;
    
    console

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-3 justify-between w-full">
                {posts
                    .filter(post => post?.medias?.some(media => media.type === "video"))
                    .map((post, postIndex) => (
                        <React.Fragment key={postIndex}>
                            {post?.medias
                                ?.filter(media => media.type === "video")
                                .map((media, mediaIndex) => (
                                    <div key={mediaIndex} className="p-1"> {/* เพิ่ม padding เพื่อแยกรูป */}
                                        <video
                                            src={media.thumbnail || media.url} // URL ของวิดีโอ
                                            controls={false} // ไม่แสดงปุ่มควบคุม
                                            poster={media.thumbnail || undefined} // ใช้ thumbnail ถ้ามี
                                            width="120"
                                            height="120"
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

export default FeedVideo;