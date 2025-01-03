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

    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
    
    const { data, error, mutate, isLoading } = useSWR(`/api/courses/ratings?id=${id}`, fetcher, {
        onSuccess: (data) => {
            setCourses(data.data);
            setQuestionnaires(data.questionnaires);
            setRating(data.rating);
            setSuggestions(data.suggestions);
        },
    });

    console.log(courses);

    const { data: user } = useSWR(`/api/users/${session.user.id}`, fetcher);

    useEffect(() => {
        if (questionnaires) {
            const hasQuestionnaire = questionnaires.some(questionnaire => questionnaire.userId === session.user.id);
            setHasQuestionnaire(hasQuestionnaire);
        }
    }, [questionnaires, session.user.id] );

    useEffect(() => {
        if (courses.galleyId !== null || courses.galleyId !== undefined) {
            setHasGallery(true);
        }
    }, [courses.galleyId]);

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
            await axios.put(`/api/questionnaires?questionnaireId=${selectedSuggestions}`, { suggestion: suggestion });
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

    console.log(selectedSuggestions);

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
    
                    console.log('newComment', newComment);
    
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

    if (isLoading) return <Loading />;
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
                    <h1 className="flex text-xl font-bold mt-1 text-[#0056FF]">{courses.title}</h1>
                </div>

                <div className="flex flex-col mt-2 w-full">
                    <span className="text-md font-bold text-[#0056FF]">รายละเอียด</span>
                    <span className="text-sm font-normal">{courses.description}</span>
                    
                    <div className='flex flex-row justify-between items-center mt-5 w-full'>
                        <div className='flex flex-row items-center gap-1'>
                            <span className='text-xl font-black text-[#0056FF]'>{rating}</span>
                            <FaStar className='text-yellow-500' size={22}/>
                            <span className='text-sm font-bold text-[#0056FF] ml-1'>คะแนนหลักสูตร</span>
                            <span className='text-sm font-bold text-gray-500'>({questionnaires.length})</span>
                        </div>

                    </div>
                </div>

                <Divider className="my-2"/>

                {/* Reviews */}
                <div className="flex flex-col mt-1 w-full">
                    {suggestions.map((suggestion, index) => (
                        <div 
                            key={index}
                            className="flex flex-col mt-2 w-full"
                        >
                            <div className="flex flex-row justify-between w-full">
                               <div className="flex flex-row items-center gap-2">
                                <Image
                                        src={suggestion?.user?.pictureUrl}
                                        alt={suggestion?.user?.fullname + "avatar"}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <span className="text-md font-bold text-[#0056FF]">{suggestion.user.fullname}</span>
                               </div>

                                {(user.user.role === "manager" || user.user.role === "admin" || suggestion?.user?.userId === session.user.id) && (
                                    <div className="flex flex-row gap-1">
                                        <BsThreeDotsVertical 
                                            className="text-gray-600" 
                                            size={20} 
                                            onClick={(event) => handleSuggestionClick(event, suggestion._id)}
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

                            <div className="flex flex-row items-center gap-1 mt-2">
                                {Array.from({ length: suggestion?.rating }, (_, i) => (
                                    <>
                                    
                                    <FaStar key={i} className="text-yellow-500" size={15} />
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
                                                <Image
                                                    src={comment?.user?.pictureUrl}
                                                    alt={comment?.user?.fullname + "avatar"}
                                                    width={30}
                                                    height={30}
                                                    className="rounded-full"
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
                   {!hasQuestionnaire && 
                     <div 
                        onClick={handleOpenForm} 
                        className="flex flex-row items-center text-sm text-[#0056FF] gap-2 w-full"
                    >
                        <FaWpforms size={25}/>
                        <span className="font-bold">ทำแบบสอบถาม</span>
                    </div>
                   }
                    {hasGallery && (
                        <div 
                            className="flex flex-row items-center text-sm text-[#0056FF] gap-2 w-full"
                            onClick={() => router.push(`/gallery/${courses?.galleryId}`)}
                        >
                            <BsImages size={25}/>
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

Review.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Review.auth = true