import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa6";
import { BsImages, BsThreeDotsVertical } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { Divider } from '@mui/material';
import { AppLayout } from "@/themes";
import Loading from "@/components/Loading";
import Form from "@/components/courses/form";
import Swal from "sweetalert2";
import Avatar from "@/components/utils/Avatar";

const fetcher = url => axios.get(url).then(res => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Review = () => {
    const [courses, setCourses] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [rating, setRating] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [hasQuestionnaire, setHasQuestionnaire] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedSuggestions, setSelectedSuggestions] = useState(null);
    const [suggestionAnchorEl, setSuggestionAnchorEl] = useState(null); // สำหรับ suggestions
    const [commentAnchorEl, setCommentAnchorEl] = useState(null); // สำหรับ comments
    const [openComment, setOpenComment] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedComment, setSelectedComment] = useState(null);
    const [isEditComment, setIsEditComment] = useState(false);
    const [openSuggestion, setOpenSuggestion] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [hasGallery, setHasGallery] = useState(false);
    const [questionnairesActive, setQuestionnairesActive] = useState(false);
    const [anonymous, setAnonymous] = useState(false);

    const router = useRouter();
    const { id } = router.query;
    const { data: session, status } = useSession();
    
    
    const { data, error, mutate, isLoading } = useSWR(`/api/courses/ratings?id=${id}`, fetcher, {
        onSuccess: (data) => {
            setCourses(data.data);
            setQuestionnaires(data.questionnaires);
            setRating(data.rating);
            setSuggestions(data.suggestions);
        },
    });

    useEffect(() => {
        if (status === "loading") return;
        if (!session) return;
    
        const userId = session?.user?.id;
        // ใช้ userId ได้อย่างปลอดภัยหลังจาก session โหลดเสร็จ
    }, [status, session]);

    const userId = session?.user?.id || null;

    const { data: user } = useSWR(userId ? `/api/users/${userId}` : null, fetcher);

    useEffect(() => {
        if (courses.questionnairesActive === false) {
            setQuestionnairesActive(false);
        } else {
            setQuestionnairesActive(true);
        }
    }, [courses.questionnairesActive]);

    useEffect(() => {
        if (questionnaires) {
            const hasQuestionnaire = questionnaires.some(questionnaire => questionnaire.userId === userId);
            setHasQuestionnaire(hasQuestionnaire);
        }
    }, [questionnaires, userId] );

    useEffect(() => {
        if (courses.galleryId !== null || courses.galleryId !== undefined || courses.galleryId !== '') {
            setHasGallery(true);
        }
    }, [courses.galleryId]);

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    const handleCommentOpen = (id) => {
        setSelectedSuggestions(id);
        handleClose();
        setOpenComment(true);
    };

    const handleCloseComment = () => {
        setSelectedSuggestions(null);
        setComment('');
        setOpenComment(false);
    };

    const handleSuggestionClick = (event, suggestionId) => {
        setSelectedSuggestions(suggestionId);
        setSuggestionAnchorEl(event.currentTarget);
    };
    
    const handleSuggestionClose = () => {
        setSelectedSuggestions(null);
        setSuggestionAnchorEl(null);
    };
    
    // จัดการ comments
    const handleCommentClick = (event, commentId) => {
        setSelectedComment(commentId); // หรือเก็บ commentId ตามที่ต้องการ
        setCommentAnchorEl(event.currentTarget);
    };
    
    const handleCommentClose = () => {
        setSelectedComment(null);
        setCommentAnchorEl(null);
    };

    const handleOpenSuggestion = (suggestion) => {
        setSelectedSuggestions(suggestion._id);
        setSuggestion(suggestion?.suggestion);
        setOpenSuggestion(true);
        setSuggestionAnchorEl(null);
    };

    const handleCloseSuggestion = () => {
        setSelectedSuggestions(null);
        setSuggestion('');
        setOpenSuggestion(false);
    };

    const handleUpdateSuggestion = async() => {
        try {
            await axios.put(`/api/questionnaires?questionnaireId=${selectedSuggestions}`, { suggestion: suggestion, anonymous: anonymous });
            handleCloseSuggestion();
            mutate(`/api/courses/ratings?id=${id}`);
    
            await Swal.fire({
                icon: 'success',
                title: 'Suggestion updated successfully',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteSuggestion = async() => {
        const clearSuggestion = '';
        try {
            await axios.put(`/api/questionnaires?questionnaireId=${selectedSuggestions}`, { suggestion: clearSuggestion });
            await axios.delete(`/api/questionnaires?questionnaireId=${selectedSuggestions}`);
            handleCloseSuggestion();
            mutate(`/api/courses/ratings?id=${id}`);
    
            await Swal.fire({
                icon: 'success',
                title: 'Suggestion deleted successfully',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleAddComment = async() => {
        if (isEditComment) {
            try {
                if (comment.trim() !== '') {
                    await axios.put(`/api/courses/comments?commentId=${selectedComment}`, { comment: comment });
                    handleCloseComment();
                    setIsEditComment(false);
                    mutate(`/api/courses/ratings?id=${id}`);
    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Comment updated successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    handleCloseComment();
                    setIsEditComment(false);
                    await Swal.fire({
                        icon: 'error',
                        title: 'Please enter a comment',
                        showConfirmButton: false,
                        timer: 1500
                    });
                };
            } catch (error) {
                console.error(error);
            }

        } else {
            try {
                if (comment.trim() !== '') {
                    const newComment = {
                        comment: comment,
                        questionnaireId: selectedSuggestions,
                        userId: session.user.id,
                    };
    
                    await axios.post('/api/courses/comments', newComment);
                    handleCloseComment();
                    mutate(`/api/courses/ratings?id=${id}`);
    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Comment added successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    handleCloseComment();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Please enter a comment',
                        showConfirmButton: false,
                        timer: 1500
                    });
                };
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDeleteComment = async(commentId) => {
        try {
            const resolte = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you really want to delete this comment? This process cannot be undone",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
            });
            if (!resolte.isConfirmed) return;
            await axios.delete(`/api/courses/comments?commentId=${commentId}`);
            mutate(`/api/courses/ratings?id=${id}`);
            await Swal.fire({
                icon: 'success',
                title: 'Comment deleted successfully',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditComment = async(comment) => {
        console.log('Editing comment:', comment);
        setComment(comment);
        setIsEditComment(true);
        setOpenComment(true);
        setCommentAnchorEl(null);
    };

    if (isLoading || !courses || !questionnaires ) return <Loading />;
    if (error) return <div>Failed to load</div>;

    return (
        <div className='flex flex-col p-2 w-full'>
            <div className='flex flex-row justify-between items-center'>
                <div>
                    <IoIosArrowBack 
                        className="text-xl inline text-gray-700"
                        onClick={() => router.back()}
                        size={30}
                    />
                </div>
                <span className="text-3xl font-bold mt-1 text-[#0056FF]">
                    หลักสูตร
                </span>
                <div></div>
            </div>

            <div className="flex flex-col px-4 mt-2 w-full">
                <div className="flex flex-col justify-center items-center w-full">
                    <h1 className="flex text-md font-bold mt-1 text-[#0056FF]">{courses.title}</h1>
                </div>

                <div className="flex flex-col mt-2 w-full">
                    <span className="text-sm font-bold text-[#0056FF]">รายละเอียด</span>
                    <span className="text-xs font-normal">{courses.description}</span>
                    
                    <div className='flex flex-row justify-between items-center mt-5 w-full'>
                        <div className='flex flex-row items-center gap-1'>
                            <span className='text-xl font-black text-[#0056FF]'>{(rating).toFixed(2)}</span>
                            {rating > 0 ? (
                                    Array.from({ length: rating.toFixed(2) }, (_, i) => (
                                        <>                           
                                            <FaStar key={i} className="text-yellow-500" size={15} />
                                        </>
                                    ))
                                ) : (
                                    <FaStar className="text-gray-200" size={15} />
                                )}
                            <span className='text-sm font-bold text-[#0056FF] ml-1'>คะแนนหลักสูตร</span>
                            <span className='text-sm font-bold text-gray-500'>({questionnaires.length})</span>
                        </div>

                    </div>
                </div>

                <Divider className="my-2"/>

                {/* Reviews */}
                <div className="flex flex-col mt-1 pb-24 w-full">
                    {suggestions.map((suggestion, index) => (
                        <div 
                            key={index}
                            className="flex flex-col mt-2 w-full"
                        >
                            <div className="flex flex-row justify-between w-full">
                               <div className="flex flex-row gap-2">
                                    <Avatar 
                                        src={suggestion?.anonymous ? "/images/anonymous.png" : suggestion?.user?.pictureUrl} 
                                        size={40} 
                                        userId={suggestion?.anonymous ? null : suggestion?.user?.userId} 
                                    />
                                    <span className="text-xs font-bold text-[#0056FF]">{suggestion?.anonymous ? "ไม่แสดงตัวตน" : suggestion?.user?.fullname}</span>
                               </div>

                                {(user.user.role === "manager" || user.user.role === "admin" || suggestion?.user?.userId === session.user.id) && (
                                    <div className="flex flex-row gap-1">
                                        <BsThreeDotsVertical 
                                            className="text-gray-600" 
                                            size={15} 
                                            onClick={(event) => handleSuggestionClick(event, suggestion?._id)}
                                        />
                                        <Menu
                                            anchorEl={suggestionAnchorEl}
                                            open={Boolean(suggestionAnchorEl)}
                                            onClose={handleSuggestionClose}
                                        >
                                            <MenuItem onClick={() => handleOpenSuggestion(suggestion)}>แก้ไข</MenuItem>
                                            <MenuItem onClick={handleDeleteSuggestion}>ลบ</MenuItem>
                                            {(user.user.role === "admin" || user.user.role === "manager") && 
                                                <MenuItem onClick={() => handleCommentOpen(suggestion?._id)}>แสดงความคิดเห็น</MenuItem>
                                            }
                                            
                                        </Menu>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row items-center gap-1 mt-1">
                                {Array.from({ length: suggestion?.rating }, (_, i) => (
                                    <>
                                    
                                    <FaStar key={i} className="text-yellow-500" size={12} />
                                    </>
                                ))}
                            </div>

                            <span className="text-sm text-gray-600 font-normal mt-2">{suggestion?.suggestion}</span>
                            
                            <Divider className="my-2"/>

                            {suggestion?.comments?.map((comment, index) => (
                                <div key={index} className="flex flex-col px-2 w-full">
                                    <div className="flex flex-col bg-gray-200 p-2 rounded-xl w-full">
                                        <div className="flex flex-row justify-between w-full">
                                            <div className="flex flex-row items-center gap-1">
                                                <Avatar 
                                                    src={comment?.user?.pictureUrl} 
                                                    size={30} 
                                                    userId={comment?.user?.userId} 
                                                />
                                                <span className="text-sm font-bold text-[#0056FF]">{comment?.user?.fullname}</span>
                                            </div>
                                            {(user.user.role === "manager" || user.user.role === "admin") && (
                                                <div>
                                                    <BsThreeDotsVertical 
                                                        className="text-gray-600" 
                                                        size={14} 
                                                        onClick={(event) => handleCommentClick(event, comment._id)}
                                                    />
                                                    <Menu
                                                        anchorEl={commentAnchorEl}
                                                        open={Boolean(commentAnchorEl)}
                                                        onClose={handleCommentClose}
                                                    >
                                                        <MenuItem onClick={() => handleEditComment(comment?.comment)}>แก้ไข</MenuItem>
                                                        <MenuItem onClick={() => handleDeleteComment(comment?._id)}>ลบ</MenuItem>
                                                    </Menu>
                                                </div>
                                            )}
                                            
                                        </div>
                                        <span className="text-xs text-gray-600 font-normal mt-2">{comment?.comment}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                </div>

                {/* Toolbar */}
                <div className="fixed flex flex-col bottom-20 bg-white mt-2 w-full gap-2">
                   {questionnairesActive && !hasQuestionnaire && 
                     <div 
                        onClick={handleOpenForm} 
                        className="flex flex-row items-center text-sm text-[#0056FF] gap-2 w-full"
                    >
                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138.77 139.86">
                    
                            <g data-name="Layer 1">
                                <g data-name="Layer 13">
                                <g>
                                    <path fill="currentColor" d="M59.19,130.27H21.71c-6.69,0-12.12-5.44-12.12-12.12V32.87c0-6.68,5.44-12.12,12.12-12.12h9.14c-.12,2.27.42,4.56,1.74,6.5,1.97,2.91,5.24,4.64,8.75,4.64h37.21c3.51,0,6.78-1.74,8.75-4.64,1.31-1.94,1.86-4.22,1.74-6.5h9.15c6.69,0,12.12,5.44,12.12,12.12v28.34c0,2.51,2.04,4.55,4.55,4.55s4.55-2.04,4.55-4.55v-28.34c0-11.7-9.52-21.22-21.22-21.22h-12.11l-1.8-4.51c-1.62-4.04-5.47-6.65-9.82-6.65h-29.04c-4.35,0-8.21,2.62-9.82,6.66l-1.8,4.51h-12.09C10.02,11.66.5,21.18.5,32.88v85.27c0,11.69,9.52,21.22,21.22,21.22h37.48c2.51,0,4.55-2.04,4.55-4.55s-2.04-4.55-4.55-4.55ZM39.96,20.76l4.09-10.23c.23-.57.77-.93,1.37-.93h29.04c.61,0,1.15.37,1.37.93l4.09,10.23c.25.64.02,1.14-.15,1.38-.16.24-.54.65-1.23.65h-37.21c-.69,0-1.06-.41-1.23-.65-.16-.24-.4-.75-.15-1.38Z"/>
                                    <path fill="currentColor" d="M59.19,139.86H21.71c-11.97,0-21.71-9.74-21.71-21.72V32.88C0,20.9,9.74,11.16,21.71,11.16h11.75l1.68-4.19c1.69-4.23,5.73-6.97,10.28-6.97h29.04c4.55,0,8.59,2.73,10.28,6.97l1.67,4.19h11.77c11.97,0,21.72,9.74,21.72,21.72v28.34c0,2.78-2.26,5.05-5.05,5.05s-5.05-2.26-5.05-5.05v-28.34c0-6.41-5.21-11.62-11.62-11.62h-8.64c.02,2.3-.61,4.46-1.84,6.28-2.07,3.04-5.49,4.86-9.17,4.86h-37.21c-3.68,0-7.11-1.82-9.17-4.86-1.23-1.82-1.86-3.98-1.84-6.28h-8.62c-6.41,0-11.62,5.21-11.62,11.62v85.28c0,6.41,5.21,11.62,11.62,11.62h37.48c2.79,0,5.05,2.27,5.05,5.05s-2.26,5.05-5.05,5.05ZM21.71,12.16C10.29,12.16,1,21.46,1,32.88v85.27c0,11.42,9.29,20.72,20.71,20.72h37.48c2.23,0,4.05-1.82,4.05-4.05s-1.82-4.05-4.05-4.05H21.71c-6.96,0-12.62-5.66-12.62-12.62V32.87c0-6.96,5.66-12.62,12.62-12.62h9.67l-.03.53c-.12,2.27.45,4.41,1.65,6.19,1.88,2.77,4.99,4.42,8.34,4.42h37.21c3.34,0,6.46-1.65,8.34-4.42,1.2-1.78,1.77-3.92,1.65-6.19l-.03-.53h9.68c6.96,0,12.62,5.66,12.62,12.62v28.34c0,2.23,1.81,4.05,4.05,4.05s4.05-1.82,4.05-4.05v-28.34c0-11.42-9.29-20.72-20.72-20.72h-12.45l-1.92-4.82c-1.54-3.85-5.21-6.34-9.36-6.34h-29.04c-4.15,0-7.82,2.49-9.35,6.34l-1.93,4.82h-12.43ZM78.54,23.3h-37.21c-.67,0-1.25-.31-1.64-.87-.37-.56-.44-1.23-.2-1.85h0s4.09-10.23,4.09-10.23c.3-.76,1.03-1.25,1.84-1.25h29.04c.82,0,1.54.49,1.84,1.25l4.09,10.23c.35.89-.02,1.59-.2,1.85-.37.55-.97.87-1.64.87ZM40.42,20.94h0c-.16.4-.04.72.1.92.19.28.47.43.81.43h37.21c.43,0,.68-.23.81-.43.14-.2.26-.52.1-.92l-4.09-10.23c-.15-.38-.5-.62-.91-.62h-29.04c-.4,0-.76.24-.91.62l-4.09,10.23Z"/>
                                </g>
                                <g>
                                    <path fill="currentColor" d="M92.87,66.53c0-2.51-2.04-4.55-4.55-4.55h-33.95c-2.51,0-4.55,2.04-4.55,4.55s2.04,4.55,4.55,4.55h33.95c2.52,0,4.55-2.03,4.55-4.55Z"/>
                                    <path fill="currentColor" d="M88.33,71.57h-33.95c-2.78,0-5.05-2.26-5.05-5.05s2.26-5.05,5.05-5.05h33.95c2.78,0,5.05,2.26,5.05,5.05s-2.26,5.05-5.05,5.05ZM54.38,62.48c-2.23,0-4.05,1.82-4.05,4.05s1.81,4.05,4.05,4.05h33.95c2.23,0,4.05-1.82,4.05-4.05s-1.81-4.05-4.05-4.05h-33.95Z"/>
                                </g>
                                <g>
                                    <path fill="currentColor" d="M36.16,61.98h-4.6c-2.51,0-4.55,2.04-4.55,4.55s2.04,4.55,4.55,4.55h4.61c2.51,0,4.55-2.04,4.55-4.55s-2.04-4.55-4.55-4.55Z"/>
                                    <path fill="currentColor" d="M36.16,71.58h-4.61c-2.78,0-5.05-2.26-5.05-5.05s2.26-5.05,5.05-5.05h4.6c2.79,0,5.05,2.26,5.05,5.05s-2.26,5.05-5.05,5.05ZM31.55,62.48c-2.23,0-4.05,1.82-4.05,4.05s1.81,4.05,4.05,4.05h4.61c2.23,0,4.05-1.82,4.05-4.05s-1.82-4.05-4.05-4.05h-4.6Z"/>
                                </g>
                                <g>
                                    <path fill="currentColor" d="M54.39,89.55c-2.51,0-4.55,2.04-4.55,4.55s2.04,4.55,4.55,4.55h22.48c2.51,0,4.55-2.04,4.55-4.55s-2.04-4.55-4.55-4.55h-22.48Z"/>
                                    <path fill="currentColor" d="M76.87,99.15h-22.48c-2.78,0-5.05-2.26-5.05-5.05s2.26-5.05,5.05-5.05h22.48c2.78,0,5.05,2.26,5.05,5.05s-2.26,5.05-5.05,5.05ZM54.39,90.05c-2.23,0-4.05,1.82-4.05,4.05s1.81,4.05,4.05,4.05h22.48c2.23,0,4.05-1.82,4.05-4.05s-1.81-4.05-4.05-4.05h-22.48Z"/>
                                </g>
                                <g>
                                    <path fill="currentColor" d="M36.16,89.56h-4.6c-2.51,0-4.55,2.04-4.55,4.55s2.04,4.55,4.55,4.55h4.61c2.51,0,4.55-2.04,4.55-4.55s-2.04-4.55-4.55-4.55Z"/>
                                    <path fill="currentColor" d="M36.16,99.15h-4.61c-2.78,0-5.05-2.26-5.05-5.05s2.26-5.05,5.05-5.05h4.6c2.79,0,5.05,2.26,5.05,5.05s-2.26,5.05-5.05,5.05ZM31.55,90.06c-2.23,0-4.05,1.82-4.05,4.05s1.81,4.05,4.05,4.05h4.61c2.23,0,4.05-1.82,4.05-4.05s-1.82-4.05-4.05-4.05h-4.6Z"/>
                                </g>
                                <g>
                                    <path fill="currentColor" d="M133.97,79.95c-5.56-5.56-15.25-5.56-20.81,0l-34.33,34.33c-1.21,1.21-2,2.74-2.28,4.42l-1.88,11.13c-.44,2.61.42,5.28,2.29,7.15,1.55,1.54,3.63,2.38,5.77,2.38.45,0,.91-.04,1.36-.11l11.12-1.88c1.69-.28,3.22-1.07,4.42-2.28l34.33-34.33c5.74-5.74,5.74-15.08,0-20.81ZM93.42,128.44l-9.56,1.62,1.61-9.56,23.92-23.92,7.95,7.95-23.92,23.92ZM127.54,94.32l-3.77,3.77-7.95-7.95,3.77-3.77c2.13-2.13,5.82-2.13,7.95,0h0c2.19,2.2,2.19,5.76,0,7.95Z"/>
                                    <path fill="currentColor" d="M82.73,139.85c-2.28,0-4.51-.92-6.13-2.53-1.99-1.99-2.89-4.82-2.43-7.59l1.88-11.13c.3-1.79,1.14-3.41,2.42-4.69l34.33-34.33c5.73-5.73,15.78-5.73,21.51,0h0c2.87,2.87,4.45,6.69,4.45,10.76s-1.58,7.89-4.45,10.76l-34.33,34.33c-1.28,1.28-2.9,2.12-4.7,2.42l-11.12,1.88c-.51.08-.98.12-1.45.12ZM123.56,76.29c-3.69,0-7.37,1.34-10.05,4.01l-34.33,34.33c-1.13,1.13-1.87,2.57-2.14,4.15l-1.88,11.13c-.41,2.44.39,4.95,2.15,6.71,1.43,1.42,3.41,2.24,5.42,2.24.41,0,.83-.03,1.29-.11l11.11-1.88c1.59-.27,3.03-1,4.15-2.14l34.33-34.33c2.68-2.68,4.16-6.25,4.16-10.06s-1.48-7.37-4.16-10.05h0c-2.68-2.68-6.36-4.02-10.05-4.02ZM83.25,130.66l1.75-10.41,24.39-24.39,8.65,8.65-24.38,24.39-10.41,1.76ZM85.94,120.73l-1.47,8.71,8.71-1.47,23.45-23.46-7.24-7.24-23.46,23.46ZM123.77,98.79l-8.65-8.65,4.12-4.12c1.1-1.11,2.68-1.74,4.32-1.74h0c1.64,0,3.22.63,4.32,1.74l.15.16c2.23,2.4,2.18,6.17-.15,8.5l-4.12,4.12ZM116.54,90.14l7.24,7.24,3.41-3.41c1.99-1.99,1.99-5.24,0-7.24l-.12-.12c-.91-.85-2.17-1.33-3.49-1.33h0c-1.38,0-2.7.53-3.62,1.45l-3.42,3.42Z"/>
                                </g>
                                </g>
                            </g>
                        </svg>
                        <span className="font-bold">ทำแบบสอบถาม</span>
                    </div>
                   }
                    {courses?.galleryId && hasGallery && (
                        <div 
                            className="flex flex-row items-center text-sm text-[#0056FF] gap-2 w-full"
                            onClick={() => router.push(`/gallery/${courses?.galleryId}`)}
                        >
                            <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 158.7 140.45">
                                <g id="Layer_1-2" data-name="Layer 1">
                                    <g>
                                        <path fill="currentColor" d="M143.21.54L35.14,0c-8.54,0-15.49,6.95-15.49,15.49v10.47h-4.16c-8.54,0-15.49,6.95-15.49,15.49v83.51c0,8.54,6.95,15.49,15.49,15.49h108.07c8.54,0,15.49-6.95,15.49-15.49v-4.16h4.16c8.54,0,15.49-6.95,15.49-15.49V16.03c0-8.54-6.95-15.49-15.49-15.49ZM147.37,105.31c0,2.29-1.87,4.15-4.16,4.15h-4.16V41.45c0-8.54-6.95-15.49-15.49-15.49H30.99v-10.47c0-2.29,1.87-4.16,4.16-4.16l108.07.54c2.29,0,4.16,1.87,4.16,4.16v89.29ZM123.56,129.12H15.49c-2.29,0-4.16-1.87-4.16-4.16V41.45c0-2.29,1.87-4.16,4.16-4.16h108.07c2.29,0,4.16,1.87,4.16,4.16v83.51c0,2.29-1.87,4.16-4.16,4.16Z"/>
                                        <path fill="currentColor" d="M96.99,79.32c9.22,0,16.72-7.5,16.72-16.72s-7.5-16.72-16.72-16.72-16.72,7.5-16.72,16.72,7.5,16.72,16.72,16.72ZM96.99,57.21c2.97,0,5.39,2.42,5.39,5.39s-2.42,5.39-5.39,5.39-5.39-2.42-5.39-5.39,2.42-5.39,5.39-5.39Z"/>
                                        <path fill="currentColor" d="M24.58,115.93l27.08-40.57,26.07,36.84c1,1.4,2.57,2.28,4.29,2.38,1.77.1,3.39-.58,4.54-1.86l14.35-15.9,14.12,19.53c1.11,1.53,2.84,2.35,4.6,2.35,1.15,0,2.31-.35,3.32-1.07,2.54-1.83,3.11-5.38,1.27-7.92l-18.22-25.21c-1-1.38-2.58-2.25-4.29-2.34-1.71-.11-3.37.59-4.51,1.87l-14.3,15.84-26.75-37.78c-1.08-1.52-2.78-2.48-4.7-2.39-1.87.02-3.6.97-4.64,2.52l-31.66,47.42c-1.74,2.61-1.04,6.13,1.57,7.87,2.6,1.73,6.12,1.04,7.86-1.57Z"/>
                                    </g>
                                </g>
                            </svg>
                            <span className="font-bold">Link แกลอรี่หลักสูตรนี้</span>
                        </div>
                    )}
                </div>
            </div>
            <Dialog
                fullScreen
                open={openForm}
                onClose={handleCloseForm}
                TransitionComponent={Transition}
            >
                <Form 
                    course={courses}
                    handleCloseForm={handleCloseForm}
                />
            </Dialog>

            <Dialog
                open={openSuggestion}
                onClose={handleCloseSuggestion}
                TransitionComponent={Transition}
                sx={{
                '& .MuiDialog-paper': {
                    width: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    overflow: 'auto',
                },
                }}
            >
                <div className="flex flex-col p-4 w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                        <span className="text-xl font-bold text-[#0056FF]">แก้ไขรีวิว</span>
                        <IoClose className="text-2xl" onClick={handleCloseSuggestion} size={25}/>
                    </div>

                    <div className="flex flex-col mt-2 gap-1 w-full">
                        <div className="flex flex-row items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="anonymous" 
                                id="anonymous" 
                                checked={suggestion?.anonymous}
                                onChange={(e) => setAnonymous(e.target.checked)}
                            />
                            <label htmlFor="" className="text-sm font-bold text-gray-500">ไม่ระบุตัวตน</label>
                        </div>
                        <label htmlFor="suggestion" className="text-sm font-bold text-gray-500">แก้ไขรีวิว</label>
                        <textarea
                            id="suggestion"
                            name="suggestion"
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="แก้ไขรีวิว"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            rows="4"
                        />

                        <div className="flex flex-row justify-center gap-2 mt-2">
                            <button
                                className="bg-[#0056FF] text-white py-1 px-4 rounded-full"
                                onClick={handleUpdateSuggestion}
                            >
                                แก้ไข
                            </button>
                            <button 
                                className="bg-red-500 text-white py-1 px-4 rounded-full"
                                onClick={handleCloseSuggestion}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>

                </div>
            </Dialog>

            <Dialog
                open={openComment}
                onClose={handleCloseComment}
                TransitionComponent={Transition}
                sx={{
                '& .MuiDialog-paper': {
                    width: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    overflow: 'auto',
                },
                }}
            >
                <div className="flex flex-col p-4 w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                        <span className="text-xl font-bold text-[#0056FF]">แสดงความคิดเห็น</span>
                        <IoClose className="text-2xl" onClick={handleCloseComment} size={25}/>
                    </div>

                    <div className="flex flex-col mt-2 gap-1 w-full">
                        <label htmlFor="comment" className="text-sm font-bold text-gray-500">แสดงความคิดเห็น</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="แสดงความคิดเห็น"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            rows="4"
                        />

                        <div className="flex flex-row justify-center gap-2 mt-2">
                            <button
                                className="bg-[#0056FF] text-white py-1 px-4 rounded-full"
                                onClick={handleAddComment}
                            >
                                <span className="text-sm font-bold">ยืนยัน</span>
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded-full"
                                onClick={handleCloseComment}
                            >
                                <span className="text-sm font-bold">ยกเลิก</span>
                            </button>
                            
                        </div>
                    </div>
                    
                </div>
                
            </Dialog>
            
        </div>
    );

}

export default Review;
