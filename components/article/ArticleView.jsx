import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/th";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiUserCircleDuotone } from "react-icons/pi";
import { Dialog, Slide, CircularProgress, Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import QuizPanel from "./QuizPanel";
import useSWR from "swr";
import Loading from "../Loading";
import { useSession } from "next-auth/react";
import { Divider } from "@mui/material";
import PostModal from "../PostModal";
import Swal from "sweetalert2";
import CommentInput from "../comments/CommentInput";
import ReplyInput from "../comments/ReplyInput";
import ImageGallery from "../club/ImageGallery";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ArticleView = ({ articleId }) => {
    const [article, setArticle] = useState();
    const [comments, setComments] = useState([]);
    const [hasAnswer, setHasAnswer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [currentDialog, setCurrentDialog] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkError, setCheckError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentOption, setCurrentOption] = useState(null);
    const [likes, setLikes] = useState({});

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data, error, mutate } = useSWR(`/api/articles/${articleId}`, fetcher, {
        onSuccess: (data) => {
            setArticle(data?.data);
            setComments(data?.data?.comments);
            setQuiz(data.data.quiz);
            const initialLikes = {
                [data?.data?._id]: data?.data?.likes?.some(like => like.userId === userId),
                ...data?.data?.comments.reduce((acc, comment) => {
                    acc[comment?._id] = comment?.likes?.some(like => like.userId === userId);
                    comment?.replies?.forEach(reply => {
                        acc[reply?._id] = reply?.likes?.some(like => like.userId === userId);
                    });
                    return acc;
                }, {})
            };
            setLikes(initialLikes);
        },
    });

    const { data: user, mutate: mutateUser } = useSWR(`/api/users/${session?.user?.id}`, fetcher);

    const { data: useAnswer, error: answerError, isLoading: answerLoading, mutate: answerMutate } = useSWR(`/api/articles/quiz/answers?articleId=${articleId}&userId=${userId}`, fetcher);

    useEffect(() => {
        if (useAnswer && Array.isArray(useAnswer?.data)) {
            const hasAnswer = useAnswer?.data?.some(answer => answer.userId === userId, answer => answer.isAnswer === true);
            setHasAnswer(hasAnswer);
        }else{
            return
        }
      }, [userId, useAnswer]);


    const handleAnswer = async (answer) => {
        const isCorrect = {
            articleId,
            questionId: quiz._id,
            userId: userId,
            isAnswer: answer.isAnswer,
            answer: answer.answer,
            point: article?.point
        };

        try {
            // บันทึกคำตอบของผู้ใช้
            const res = await axios.post('/api/articles/quiz/answers', isCorrect);

            if (res.data.data.answer) {
               const resPoint = await axios.post('/api/points/point', {
                    userId: session?.user?.id,
                    points: article?.point,
                    description: 'ตอบคำถามในบทความ',
                    contentId: article?._id,
                    path: 'article',
                    subpath: 'quiz',
                    type: 'earn'
                });

                if (resPoint.data.success) {
                    // บันทึกคำตอบของผู้ใช้
                    answerMutate();
                    setShowModal(true);
                }

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: 'คุณตอบคำถามไม่ถูกต้อง',
                });
                setHasAnswer(true);
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleCommentSubmit = async (articleId, data) => {
        setLoading(true);
        try {
            const userId = session?.user?.id;
    
            // Check if there is either post content or media content
            if (!data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }

            const response = await axios.post('/api/articles/comments', {
                comment: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                articleId,
                userId,
            });

            console.log('Response:', response.data);

            const articleComment = response.data.data;

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        senderId: userId,
                        description: `ได้แท็คโพสใน Article`,
                        referId: article._id,
                        path: 'article',
                        subpath: 'Comment',
                        url: `${window.location.origin}articles/${article._id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            mutate();
            handleClose();

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
            if (!data.post && (!data.media || data.media.length === 0)) {
                setCheckError('กรุณากรอกข้อความหรือเพิ่มรูปภาพ');
                setLoading(false);
                return; // Exit the function if the condition is not met
            }
            
            const res = await axios.post('/api/articles/reply', {
                reply: data.post,
                medias: data.media,
                files: data.files,
                tagusers: data.selectedUsers,
                commentId,
                userId
            });

            console.log('Response:', res.data);

            if (data.selectedUsers && data.selectedUsers.length > 0) {
                for (const user of data.selectedUsers) {
                    await axios.post('/api/notifications', {
                        userId: user.userId,
                        senderId: userId,
                        description: `ได้แท็คโพสใน Article`,
                        referId: article._id,
                        path: 'article',
                        subpath: 'Reply',
                        url: `${window.location.origin}articles/${article._id}`,
                        type: 'Tag'
                    });
                }
            }

            setLoading(false);
            setCheckError(null);
            mutate();
            handleClose();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    const handleLike = async (articleId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/articles/like', {
                articleId,
                userId,

            });

            setLikes(prevLikes => ({
                ...prevLikes,
                [articleId]: !prevLikes[articleId]
            }));
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentLike = async (commentId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/articles/comments/like', {
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

    const handleReplyLike = async (replyId, articleId) => {
        const userId = session?.user?.id;

        try {
            await axios.put('/api/articles/reply/like', {
                replyId,
                userId,
                articleId,
               
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
                await axios.delete(`/api/articles/comments?commentId=${commentId}`);
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
                await axios.delete(`/api/articles/reply?replyId=${replyId}`);
                mutate();
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'There was an issue deleting the reply.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const onRequestClose = () => {
        setShowModal(false);
    }

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

   if (answerLoading || answerLoading) return <Loading />;
   if (error || answerError) return <div>Failed to load</div>;

    return (
        <div className="flex flex-col w-full min-w-[100%]">
            <div className="flex flex-col w-full bg-white min-w-[100%]">
            <div className="flex flex-row items-center gap-4 justify-between mt-4">
                <IoIosArrowBack 
                    onClick={() => router.back()} 
                    className="flex text-xl text-gray-400"
                    size={30}
                />
                <span className="text-[35px] font-black text-[#0056FF] dark:text-white">เรื่องน่าอ่าน</span>
                <div></div>
            </div>
            <div className="flex flex-col w-full mt-4">
                <div className="flex flex-col w-full px-4">
                    <h1 className="text-xl font-bold">{article?.title}</h1>
                    <p className="text-[12px] text-gray-500">{moment(article?.createdAt).format("LLL")}</p>
                    
                </div>
                {/* Article Content */}
                <div className="flex flex-col mt-4 w-full">
                    <div>
                        {Array.isArray(article?.medias) && article?.medias.map((media, index) => (
                        <div key={index} className="flex flex-row items-center mb-2 w-full">
                            {media?.type === "image" ? (
                                <Image 
                                    src={media?.url} 
                                    alt={media?.public_id} 
                                    width={390} 
                                    height={390} 
                                    className=""
                                    loading="lazy"
                                    style={{
                                        width: 'auto',
                                        height: 'auto',
                                    }}
                                />
                                ): (
                                    <ReactPlayer
                                        url={media?.url}
                                        width="100%"
                                        height="100%"
                                        controls
                                    />
                                    )}
                                </div>
                            ))}
                            <p className="text-gray-500">{article?.content}</p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-row items-center gap-2 px-4">
                            <span className="flex text-sm text-[#0056FF] font-bold">Tags:</span>
                        <div className="flex flex-wrap items-center gap-2">
                            {Array.isArray(article?.tags) && article?.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-[#F2F2F2] px-2 py-1 rounded-full text-xs font-bold"
                                    >
                                    {tag}
                                </div>
                                ))}
                            </div>
                        </div>

                        {/* Quiz Panle */}
                        <div className="flex flex-col w-full">
                            {!hasAnswer && quiz ? (
                                <div className="flex flex-col w-full">
                                    <Divider className="w-full p-1" />
                                    <QuizPanel quiz={quiz} handleAnswer={handleAnswer} className="w-full"/>
                                </div>
                            ): null}
                        </div>

                    </div>
                    <Divider className="w-full p-1"/>
                    {/* Tools Panel */}
                    <div className="flex flex-row justify-between items-center px-2 py-2" style={{ textSizeAdjust: '100%', fontSize: '12px'}}>
                        <div className="relative inline-flex items-center columns-2 justify-center p-3 bg-[#F2871F] text-white rounded-full h-6 w-15"
                            onClick={() => handleLike(article._id)}
                        >
                            {likes[article?._id] ? (
                                <AiFillHeart className="text-red-500 w-4 h-4 mr-1" />
                            ) : (
                                <AiOutlineHeart className="text-white w-4 h-4 mr-1" />
                            )}
                            {Array.isArray(article?.likes) ? article?.likes.length : 0}
                        </div>
                        
                        <div className="relative inline-flex columns-2 justify-center items-center" 
                            onClick={() => handleClickOpen('comment', article._id)}
                        >
                            <svg className='w-4 h-4 mr-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                                <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                                <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                                <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
                            </svg>
                            <span>แสดงความคิดเห็น</span>
                        </div>
                        <div className="flex flex-row">
                            <span>ความคิดเห็น {comments ? comments.length : 0} ครั้ง</span>
                        </div>
                    </div>

                </div>
                </div>
                <PostModal isOpen={showModal} onRequestClose={onRequestClose} score={article?.point} />
                {/* End Content Panel */}
                
                {/* comment container */}
                {comments && comments?.length > 0 ? comments.map((comment, index) => (
                    <div key={index} className="px-1">
                    <div className="flex flex-col w-full bg-white rounded-xl mt-1 px-2">
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
                        <div className="flex flex-col w-full px-2">
                            <p className="text-xs">{comment?.comment}</p>
                                {comment?.medias.length > 0 && (
                                <ImageGallery medias={comment.medias} />
                                )}
                        </div>
                        <div>
                            <div className="flex flex-row items-center justify-between w-full px-4 pb-1 mt-2">
                                 <div className="flex flex-row items-center gap-1 py-1">
                                    {likes[comment._id] ? (
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
                                            
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full px-3">
                                        <p className="text-xs">{reply?.reply}</p>
                                            {reply?.medias.length > 0 && (
                                            <ImageGallery medias={reply.medias} />
                                            )}
                                    </div>
                                    <div className="flex flex-row items-center gap-1 pl-3 justify-between mt-1 w-full">
                                        <div className="flex flex-row items-center gap-2">
                                        {likes[reply._id] ? (
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
        
    );
};

export default ArticleView;

