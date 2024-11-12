import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import "moment/locale/th";
import Image from 'next/image';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dialog, Slide, CircularProgress, Menu, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import CommentInput from "../comments/CommentInput";
import ReplyInput from "../comments/ReplyInput";
import ImageGallery from "../club/ImageGallery";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CommentList = ({ content, comments, user, contentMutate, commentMutate }) => {
    const [showComments, setShowComments] = useState({});
    const [showReply, setShowReply] = useState({});
    const [currentDialog, setCurrentDialog] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkError, setCheckError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentOption, setCurrentOption] = useState(null);
    const [likes, setLikes] = useState([]);
    const [hasLike, setHasLike] = useState(false);
    const [commentLikes, setCommentLikes] = useState({});
    const [replyLikes, setReplyLikes] = useState({});
    const { data: session } = useSession();

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (content && session) {
            setLikes(content.likes);
            setHasLike(content.likes.includes(session.user.id));
        }
    }, [content, session]);

    useEffect(() => {
        if (comments && session) {
            const commentLikesState = {};
            const replyLikesState = {};

            comments.forEach((comment) => {
                commentLikesState[comment._id] = comment?.likes?.some(like => like.userId === session.user.id);

                comment?.reply?.forEach((reply) => {
                    replyLikesState[reply._id] = reply?.likes?.some(like => like.userId === session.user.id);
                });
            });

            setCommentLikes(commentLikesState);
            setReplyLikes(replyLikesState);
        }
    }, [comments, session]);

    const handleCommentSubmit = async (contentId, data) => {

        if (!data.sticker && !data.post && (!data.media || data.media.length === 0)) {
            setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
            return;
        }

        setLoading(true);
        try {
            const userId = session?.user?.id;
    
            // Check if there is either post content or media content
            if (!data.sticker && !data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }
    
            const response = await axios.post('/api/content/comments', {
                comment: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                sticker: data.sticker,
                contentId,
                userId,
            });

            const post = response.data.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        senderId: userId,
                        description: `ได้แท็คโพสใน Learning`,
                        referId: post._id,
                        path: 'Learning',
                        subpath: 'Comment',
                        url: `/learning/${contentId}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            commentMutate();
            handleClose();
            setShowComments({ ...showComments, [postId]: true });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleReplySubmit = async (commentId, data) => {

        if (!data.sticker && !data.post && (!data.media || data.media.length === 0)) {
            setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
            return;
        }

        setLoading(true);
        try {
            const userId = session?.user?.id;
    
            // Check if there is either post content or media content
            if (!data.sticker && !data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }
    
            const response = await axios.post('/api/content/reply', {
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
                        description: `ได้แท็คโพสใน Learning`,
                        referId: post._id,
                        path: 'Learning',
                        subpath: 'Reply',
                        url: `/learning/${id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            commentMutate();
            handleClose();
            setShowReply({ ...showReply, [commentId]: true });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleLike = async (contentId) => {
        const userId = session.user.id;
        try {
            await axios.put('/api/content/like', { contentId, userId });
            setHasLike(!hasLike);
            contentMutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentLike = async (commentId) => {
        const userId = session.user.id;
        try {
            await axios.put('/api/content/comments/like', { commentId, userId });
            setCommentLikes(prevLikes => ({
                ...prevLikes,
                [commentId]: !prevLikes[commentId]
            }));
            commentMutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReplyLike = async (replyId) => {
        const userId = session.user.id;
        try {
            await axios.put('/api/content/reply/like', { replyId, userId });
            setReplyLikes(prevLikes => ({
                ...prevLikes,
                [replyId]: !prevLikes[replyId]
            }));
            commentMutate();
        } catch (error) {
            console.error(error);
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
                await axios.delete(`/api/content/comments?commentId=${commentId}`);
                commentMutate();
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
                await axios.delete(`/api/content/${replyId}`);
                commentMutate();
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'There was an issue deleting the reply.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOptionClick = (event, type, id) => {
        setAnchorEl(event.currentTarget);
        setCurrentOption({ type, id }); // Store both the type (comment/reply) and the ID
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

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between items-baseline space-x-4 h-8 px-3 bg-white" style={{ textSizeAdjust: '100%', fontSize: '12px' }}>
                    <div className="relative inline-flex items-center columns-2 justify-center p-3 bg-[#F2871F] text-white rounded-full h-6 w-15"
                        onClick={() => handleLike(content._id)}>
                        {hasLike ? <AiFillHeart className="w-4 h-4 mr-1 text-red-500" />
                            : <AiOutlineHeart className="w-4 h-4 mr-1" />}
                        {Array.isArray(likes) ? likes.length : 0}
                    </div>
                    <div className="relative inline-flex columns-2 p-3 justify-center h-8 items-baseline"
                        onClick={() => handleClickOpen('comment', content._id)}>
                        <span>ความคิดเห็น {comments ? comments.length : 0} ครั้ง</span>
                    </div>
                    <span>การดู {content?.views ? content?.views : 0} ครั้ง</span>
                </div>
            </div>

            <div className="flex flex-col w-full bg-gray-300 min-h-[300px]">
            {comments && comments.length > 0 ? comments.map((comment, index) => (
                    <div key={index} className="px-1">
                    <div className="flex flex-col w-full bg-white rounded-xl mt-1 px-2 border">
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
                                {(comment.userId === session?.user?.id || user?.role === 'admin' || user?.role === 'manager') && (
                                            <div className="relative">
                                                <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'comment', comment._id)} />
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleOptionClose}
                                                    classes={{ paper: "text-xs" }}>
                                                    <MenuItem onClick={() => { handleCommentDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                </Menu>
                                            </div>
                                        )}
                                    </div>
                                <p className="text-[8px] text-left">{moment(comment?.createdAt).fromNow()}</p>
                                {comment?.tagusers?.length > 0 && comment?.tagusers.map((taguser, index) => (
                                <div className="flex flex-row w-full items-center gap-1 mb-2 mt-[-5px]" key={index}>
                                    <div key={index} className="flex w-full">
                                        <span className="text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-full px-2 mt-1">
                            <p className="text-sm text-left px-7">{comment?.comment}</p>
                            {comment?.sticker && (
                                <div className="flex justify-center">
                                    <Image
                                        src={comment?.sticker?.url}
                                        alt="Sticker"
                                        width={150}
                                        height={150}
                                        className="object-cover"
                                    />
                                </div>
                            )}
                                {comment?.medias?.length > 0 && (
                                <ImageGallery medias={comment.medias} />
                                )}
                        </div>
                        <div>
                            <div className="flex flex-row items-center justify-between w-full px-4 pb-1 mt-1">
                                 <div className="flex flex-row items-center gap-1 py-1">
                                    {commentLikes[comment._id] ? (
                                        <AiFillHeart className="w-3 h-3 text-red-500" onClick={() => handleCommentLike(comment._id)} />
                                        ) : (
                                        <AiOutlineHeart className="w-3 h-3" onClick={() => handleCommentLike(comment._id)} />
                                        )}
                                        <span className="text-xs">
                                            {Array.isArray(comment?.likes) ? comment?.likes.length : 0}
                                        </span>
                                </div>
                                <div className="flex flex-row items-center gap-1 py-1">
                                    <svg className='w-3 h-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                        <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                        <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                        <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                        <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                                    </svg>
                                    <span className="text-xs cursor-pointer" onClick={() => handleClickOpen('reply', comment._id)}>
                                        ตอบกลับ
                                    </span>
                                </div>
                                <div className="flex flex-row items-center gap-1 py-1">
                                    <span className="text-xs cursor-pointer" onClick={() => setShowReply(showReply !== comment._id ? comment._id : null)}>
                                        {showReply === comment._id ? 'ซ่อนตอบกลับ' : 'แสดงตอบกลับ'}
                                    </span>
                                    <span className="text-xs">{Array.isArray(comment.reply) ? comment.reply.length : 0}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                    
                        </div>  
                    </div>
                        {showReply === comment._id && Array.isArray(comment.replies) && comment.replies.map((reply, replyIndex) => (
                            <div key={replyIndex} className="pl-5">
                                <div className="flex flex-col w-full bg-white rounded-xl px-2">
                                    <div className="flex flex-row items-center px-2 w-full gap-2 rounded-lg mt-1">
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
                                                <span>{reply._id}</span>
                                                {(reply.userId === session?.user?.id || user?.role === 'admin' || user?.role === 'manager') && (
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
                                            <p className="flex text-[8px]">{moment(reply?.createdAt).fromNow()}</p>
                                            {reply?.tagusers?.length > 0 && reply?.tagusers.map((taguser, index) => (
                                            <div className="flex flex-row w-full items-center gap-1 mb-2 mt-[-5px]" key={index}>
                                                <div key={index} className="flex w-full">
                                                    <span className="text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                                </div>
                                            </div>
                                            ))}
                                            
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full px-3">
                                        <p className="text-sm">{reply?.reply}</p>
                                            {reply?.sticker && reply?.sticker?.url && (
                                                <div className="flex">
                                                    <Image
                                                        src={reply?.sticker?.url}
                                                        alt="sticker"
                                                        width={100}
                                                        height={100}
                                                        className=""
                                                        style={{ width: '100px', height: 'auto' }}
                                                    />
                                                </div>
                                            )}
                                            {reply?.medias?.length > 0 && (
                                            <ImageGallery medias={reply.medias} />
                                            )}
                                    </div>
                                    <div className="flex flex-row items-center gap-1 pl-3 justify-between mt-1 w-full">
                                        <div className="flex flex-row items-center gap-2">
                                        {replyLikes[reply._id] ? (
                                            <AiFillHeart className="w-3 h-3 text-red-500" onClick={() => handleReplyLike(reply._id, comment.articleId)} />
                                            ) : (
                                            <AiOutlineHeart className="w-3 h-3" onClick={() => handleReplyLike(reply._id, comment.articleId)} />
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
                    )): (
                    <div>
                        <p>ไม่มีความคิดเห็น</p>
                    </div>
                    )}
                    <Dialog 
                        fullScreen
                        open={isDialogOpen}
                        onClose={handleClose}
                        TransitionComponent={Transition}
                    >
                        <div className="flex flex-col mt-2 p-2">
                            {currentDialog?.type === 'comment' && <CommentInput handleSubmit={(data) => handleCommentSubmit(currentDialog.id, data)} userId={session?.user?.id} handleClose={handleClose} checkError={checkError}/>}
                            {currentDialog?.type === 'reply' && <ReplyInput handleSubmit={(data) => handleReplySubmit(currentDialog.id, data)} userId={session?.user?.id} handleClose={handleClose} checkError={checkError}/>}
                        </div>
                    </Dialog>
                    <Dialog open={loading} onClose={() => setIsLoading(false)}>
                        <div className="flex justify-center items-center w-full h-full p-10">
                            <CircularProgress />
                        </div>
                    </Dialog>
                {/* End Page */}
        </div>
        </div>
    );
};

export default CommentList;
