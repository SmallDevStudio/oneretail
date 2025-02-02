import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { Dialog, Slide, CircularProgress, Menu, MenuItem } from "@mui/material";
import CommentInput from "@/components/comments/CommentInput";
import PostInput from "@/components/comments/PostInput";
import ReplyInput from "@/components/comments/ReplyInput";
import ImageGallery from "@/components/club/ImageGallery";
import Swal from "sweetalert2";
import { MdOutlineMail, MdOutlinePostAdd } from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { FaUserPlus, FaUserTimes, FaCoins } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";
import Loading from "@/components/Loading";
import Follower from "@/components/social/Follower";
import ImageTab from "@/components/profile/ImageTab";
import VideoTab from "@/components/profile/videoTab";
import Messager from "@/components/utils/Messager";


moment.locale("th");

const LineProgressBar = dynamic(() => import("@/components/ProfileLineProgressBarnew"), { ssr: false });

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [showComments, setShowComments] = useState({});
    const [showReply, setShowReply] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDialog, setCurrentDialog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentOption, setCurrentOption] = useState(null);
    const [likes, setLikes] = useState({});
    const [checkError, setCheckError] = useState(null);
    const [percentage, setPercentage] = useState(0);
    const [tabs, setTabs] = useState('posts');

    const { data: session } = useSession();
    const router = useRouter();
    const { userId } = router.query;

    const folder = 'share-your-story';

    const { data: user, mutate: mutateUser } = useSWR(`/api/users/${session?.user?.id}`, fetcher);
    const { data: survey, error: surveyError } = useSWR(session ? `/api/survey/user?userId=${session.user.id}` : null, fetcher, {
        onSuccess: (data) => setPercentage(parseFloat(data?.percent)),
    });
    const { data: badges, error: badgesError } = useSWR(`/api/badges`, fetcher);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/profile/${userId}`);
                setUserData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

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

    const activeTab = (tab) => {
        setTabs(tab);
    }

    const percent = userData?.level?.nextLevelRequiredPoints
        ? parseFloat((userData?.points?.totalPoints / userData?.level?.nextLevelRequiredPoints ) * 100)
        : 0;

    if(loading || !userData) return <Loading />;

    return (
        <div className="flex flex-col bg-gray-300 w-full min-h-screen mb-20">
            <div>
                <div className="flex flex-col w-full bg-white">
                    <div className="flex flex-row items-center w-full mt-2 px-2 py-1">
                        <div className="flex items-center">
                            <IoIosArrowBack 
                                size={24}
                                className="text-[#0056FF] cursor-pointer"
                                onClick={() => router.back()}
                            />
                            <span className="text-[#0056FF] font-bold text-md ml-2">{userData?.user?.fullname}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 ml-auto pr-2">
                            <IoSearch size={24} />
                            <Messager userId={userId} size={24} />
                        
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex flex-row justify-evenly items-center px-8 py-4 w-full">
                        {/* Avatar */}
                        <div 
                            className="flex flex-row items-center gap-2 relative"
                            style={{ 
                                height: "140px",
                                width: "140px",
                            }}
                        >
                            <Image
                                src={userData?.user?.pictureUrl}
                                alt="user"
                                width={100}
                                height={100}
                                className="rounded-full"
                                priority
                                style={{ 
                                    objectFit: "contain",
                                    width: "80px",
                                    height: "80px",
                                }}
                            />
                            <Image
                                src="/images/profile/Badge.svg"
                                alt="Badge"
                                width={100}
                                height={100}
                                className="absolute top-0 right-2"
                                priority
                                style={{ 
                                    objectFit: "contain",
                                    width: "140px",
                                    height: "140px",
                                }}
                            />
                            <div className="absolute bottom-4 left-6 flex items-center" style={{ width: "100%", zIndex: 5 }}>
                                <span className="text-[8px] font-bold text-white">
                                    LEVEL{userData?.level?.level}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col justify-between gap-2 items-center w-full">
                            <span className="text-[#0056FF] font-bold text-xl">{userData?.user?.fullname}</span>
                            <div className="flex flex-col items-center w-full gap-2 mb-1">
                                <LineProgressBar percent={percentage} />
                                <span className="text-gray-300 text-xs">
                                    ภาพรวมอุณหภูมิความสุขในการทำงาน
                                </span>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-4 w-full">
                                {userData?.user?.userId === session?.user?.id ? (
                                    <>
                                    <div className="flex flex-row px-4 py-1 bg-[#0056FF] text-white text-sm rounded-full items-center gap-1 ">
                                        <span>Point: <strong>{userData?.points?.totalPoints}</strong></span>
                                    </div>
                                    <div className="flex flex-row px-4 py-1 bg-[#F2871F] text-white text-sm rounded-full items-center gap-1">
                                        <span>Coins: <strong>{userData?.coins?.totalCoins}</strong></span>
                                    </div>
                                    </>
                                ): (
                                    <>
                                    <Follower 
                                        targetId={userData?.user?.userId} 
                                    />
                                    <div 
                                        className="flex flex-row px-2 py-1 bg-gray-200 text-[10px] rounded-full items-center gap-1"
                                        onClick={() => router.push("/messager?receiverId=" + userData?.user?.userId)}
                                    >
                                        <AiOutlineMessage size={15} />
                                        <span>ส่งข้อความ</span>
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Badge */}
                <div className="flex flex-col justify-center items-center mt-1 bg-white p-2 w-full">
                    <div className="flex bg-[#0056FF] text-white font-bold text-lg rounded-full px-4 py-0.5">
                        <span>
                            Learning Badge
                        </span>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 px-2 w-full">
                        {badges.data.map((badge, index) => (
                            <div key={index}>
                                <Image
                                    src={badge?.image[0]?.url}
                                    alt="badge"
                                    width={100}
                                    height={100}
                                    className="grayscale opacity-20"
                                    priority
                                    style={{ 
                                        objectFit: "contain",
                                        width: "auto",
                                        height: "100px",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail */ }
                <div className="flex flex-col mt-1 bg-white p-2 w-full">
                    <ul className="flex flex-row justify-between items-center text-sm text-[#0056FF]">
                        <div className="flex flex-row items-center w-2/6">
                        <span
                            className='font-bold text-lg'
                        >
                            รายละเอียด
                        </span>
                        </div>
                        <div className="flex flex-row justify-evenly items-center text-sm text-gray-500 w-full">
                            <li
                                className={`cursor-pointer  ${tabs === "posts" ? "border-b-2 border-[#F2871F] text-[#0056FF] font-bold" : ""}`}
                                onClick={() => activeTab('posts')}
                            >
                                โพสต์
                            </li>

                            <li
                                className={`cursor-pointer ${tabs === "picture" ? "border-b-2 border-[#F2871F] text-[#0056FF] font-bold" : ""}`}
                                onClick={() => activeTab('picture')}
                            >
                                รูปภาพ
                            </li>
                            <li
                                className={`cursor-pointer ${tabs === "video" ? "border-b-2 border-[#F2871F] text-[#0056FF] font-bold" : ""}`}
                                onClick={() => activeTab('video')}
                            >
                                วีดีโอ
                            </li>
                        </div>
                    </ul>

                    <div className="flex flex-col mt-1 bg-white p-2 text-xs w-full">
                        <span className="text-[#0056FF] font-bold">TeamGroup: {userData?.emp?.teamGrop}</span>
                        <span className="text-[#0056FF] font-bold ">{userData?.emp?.position ? "Position: " + userData?.emp?.position : ""}</span>
                        <span className="text-[#0056FF] font-bold ">{userData?.emp?.group ? "Group: " + userData?.emp?.group : ""}</span>
                        <span className="text-[#0056FF] font-bold ">{userData?.emp?.department ? "Department: " + userData?.emp?.department : ""}</span>
                        <span className="text-[#0056FF] font-bold ">{userData?.emp?.email ? "e-mail: " + userData?.emp?.email : ""}</span>
                    </div>
                </div>
                
                {/* Input */}
                {tabs === "posts" && (
                <div className="flex flex-col mt-1 bg-white p-2 w-full">
                    
                        <>
                        <span className="text-[#0056FF] font-bold text-lg">
                            โพสต์
                        </span>
                        <div className="flex flex-row justify-center items-center gap-2 mt-2 w-full">
                            <div>
                                <Image
                                    src={userData?.user?.pictureUrl}
                                    alt="user"
                                    width={50}
                                    height={50}
                                    className="rounded-full object-cover"
                                    style={{ width: '40px', height: '40px' }}
                                />
                            </div>

                            <div 
                                className="flex border-2 border-gray-200 items-center px-2 rounded-full w-full h-8"
                                onClick={() => handleClickOpen('post')}
                            >
                                <span className="text-sm text-gray-500">คุณคิดอะไรอยู่..?</span>
                            </div>
                        </div>
                        </>
                    
                </div>
                )}
                    
                
                 {/* Post */}
                 <div className="flex flex-col w-full">
                    {tabs === "posts" && 
                        userData?.posts?.length > 0 ? (
                            userData?.posts?.map((post, index) => (
                        <div 
                            key={index} 
                            id={post?._id} 
                            className="flex flex-col px-2 w-full gap-2 bg-white mt-1 py-2 mb-1"
                        >
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
                                        <p className="text-xs font-bold text-[#0056FF]">
                                            {post?.page === 'share-your-story' ? 
                                              <div className="flex flex-row gap-1">
                                                <span>{post?.user?.fullname}</span>
                                                <span>{'>'}</span>
                                                <span 
                                                    className="text-[#F68B1F]"
                                                    onClick={() => router.push(`/stores?tab=share-your-story#${post?._id}`)}
                                                > 
                                                    Share your story
                                                </span>
                                              </div> 
                                            : post?.user?.fullname}
                                        </p>
                                        <div className="flex flex-row gap-2">
                                            {post?._id && post?.pinned ? (
                                                <BsPinAngleFill className="text-[#F68B1F]" />
                                            ) : (
                                                ''
                                            )}
                                            {(user?.user?.role === 'admin' || user?.user?.role === 'manager' || post?.userId === session?.user?.id) && (
                                                <div className="relative">
                                                    <BsThreeDotsVertical onClick={(e) => handleOptionClick(e, 'post', post._id)} />
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl) && currentOption?.id === post._id}
                                                        onClose={handleOptionClose}
                                                        classes={{ paper: "text-xs" }}
                                                    >
                                                        <MenuItem onClick={() => { handlePinned(post?._id, post?.pinned); handleOptionClose(); }}>
                                                            {post?.pinned ? 'Unpin' : 'Pin'}
                                                        </MenuItem>
                                                        <MenuItem onClick={() => { handleDelete(currentOption.id); handleOptionClose(); }}>Delete</MenuItem>
                                                    </Menu>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className=" text-left text-[10px]">{moment(post?.createdAt).fromNow()}</p>
                                    <div className="inline flex-wrap flex-row text-left gap-1 items-center w-full mt-[-5px]">
                                        {post?.tagusers.length > 0 && post?.tagusers.map((taguser, index) => (
                                        <span key={index} className="inline-block text-[10px] text-[#F2871F]">{taguser?.fullname}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full text-left">
                                {post?.post && (
                                    <p className="text-xs ml-2 mb-2">{post?.post}</p>
                                )}
                                {post?.medias.length > 0 && (
                                    <ImageGallery medias={post.medias} userId={session?.user?.id} />
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
    
                                {showComments === post._id && Array.isArray(post.comments) && post.comments.map((comment, commentIndex) => (
                                    <div key={commentIndex} className="flex flex-col w-full">
                                    <div className="flex flex-col w-full bg-gray-300 rounded-lg mt-2 ml-2">
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
                        </div>
                            ))
                        ): null}
                </div>
            </div>
            <Dialog 
                fullScreen
                open={isDialogOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <div className="flex flex-col mt-2 p-2">
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

            {tabs === "picture" && 
                <ImageTab 
                    userId={userId}
                    ImageData={userData?.images}
                />
                }
            {tabs === "video" && (
                <VideoTab 
                    userId={userId}
                    videoData={userData?.video}
                />
            )}
        </div>
        
    );
};

export default ProfilePage;

ProfilePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
ProfilePage.auth = true;