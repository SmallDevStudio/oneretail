import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { LuMessageSquarePlus } from "react-icons/lu";
import { AppLayout } from "@/themes";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import { RiEmojiStickerLine } from "react-icons/ri";
import { ImFilePicture } from "react-icons/im";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Swal from "sweetalert2";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdOutlineHome } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SurveyMemo = () => {
    const router = useRouter();
    const { teamGrop, Group, Department, branch, startDate, endDate } = router.query;

    const [memoData, setMemoData] = useState([]);
    const [open, setOpen] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [seletedSurvey, setSelectedSurvey] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sticker, setSticker] = useState(null);
    const [media, setMedia] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);  // Menu anchor state
    const [selectedComment, setSelectedComment] = useState(null); // Track the selected comment
    
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const fetchSurveyData = async () => {
        try {
            // Fetch memo data
            const memoResponse = await axios.get(`/api/survey/board/memo`, {
                params: { startDate, endDate, teamGrop, group: Group, department: Department, branch },
            });
            const memoData = memoResponse.data.data;
    
            // Fetch comments data
            const commentsResponse = await axios.get(`/api/survey/board/comments`);
            let comments = commentsResponse.data.data;
    
            // Ensure comments is an array
            if (!Array.isArray(comments)) {
                comments = Object.values(comments);  // Convert to array if it's not
            }
    
            // Combine memo data with comments based on surveyId (which is memo.id)
            const combinedMemoData = memoData.map(memo => ({
                ...memo,
                comments: comments.filter(comment => comment.surveyId === memo.id) // Add comments to each memo
            }));
    
            setMemoData(combinedMemoData);
        } catch (error) {
            console.error("Error fetching survey data or comments:", error);
        }
    };

    useEffect(() => {
        if (teamGrop && Group && Department && branch) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, Group, Department, branch]);

    const handleClickOpen = (id) => {
        setSelectedSurvey(id);
        setOpen(true);
    };
    
    const handleClose = () => {
        setSelectedSurvey(null);
        setTextareaValue('');
        setOpen(false);
    };

    const handleComment = async () => {
        setIsLoading(true);
        const newComment = {
            surveyId: seletedSurvey,
            comment: textareaValue,
            userId: userId,
            stickers: sticker,
            medias: media,
        };

        try {
            const response = await axios.post(`/api/survey/board/comments`, newComment);
            setComments([...comments, response.data.data]);
        } catch (error) {
            console.error("Error adding comment:", error);
        }

        fetchSurveyData();
        handleClose();
        setIsLoading(false);
    };

    const handleDeleteComment = async (commentId) => {
        console.log("commentId:", commentId);
        setIsLoading(true);
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this comment? This process cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/survey/board/delete?id=${commentId}`);
            } catch (error) {
                console.error("Error deleting comment:", error);
            }finally {
                handleMenuClose();
                setIsLoading(false);
            }
        } else {
            handleMenuClose();
            setIsLoading(false);
            return;
        }

        fetchSurveyData();
        setIsLoading(false);
    };

    const handleMenuClick = (event, commentId) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedComment(commentId);  // Save the commentId for deletion
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    if (isLoading || !memoData) return <div><CircularProgress /></div>;

    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => router.back()}
                    size={25}
                />
                <h2 className="text-3xl font-bold text-[#0056FF]">
                    Verbatim
                </h2>
                <div></div>
            </div>

            <div className="flex flex-col justify-center items-center gap-1 mt-2 w-full">
                <span className="font-bold text-lg text-[#F2871F]">{branch}</span>
            </div>

            <div className="flex flex-row items-center gap-1 mt-2 px-2 w-full text-gray-400 text-xs">
                <MdOutlineHome size={15}
                    onClick={() => router.push(`/main`)}
                />
                <IoIosArrowForward size={15}/>
                <div
                    className="flex flex-row items-center gap-1"
                    onClick={() => router.push(`/survey`)}
                >
                    <span>TeamGroup</span>
                </div>
                
            </div>

            <div className="flex flex-col mt-5 w-full">
            {memoData && memoData.length > 0 ? (
                <div>
                    {memoData.map((memo, index) => (
                        <div key={index} className="flex flex-col p-2 w-full">
                            {/* Display memo data */}
                            <div className="flex flex-row gap-4 p-2 w-full bg-gray-200 rounded-3xl text-sm">
                                <div className="flex flex-col w-[40px]">
                                    <Image
                                        src="/images/survey/3.svg"
                                        alt="Profile"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-[calc(75%-40px)]">
                                    <p className="text-xs">{moment(memo.createdAt).locale("th").format("DD MMMM YYYY")}</p>
                                    <p className="text-sm">{memo.memo}</p>
                                </div>
                                <div 
                                    className="flex flex-col justify-center items-center mt-1 w-[50px]"
                                    onClick={() => handleClickOpen(memo.id)}
                                >
                                    <LuMessageSquarePlus className="text-gray-700" size={20}/>
                                    <p className="text-xs">ตอบกลับ</p>
                                </div>
                            </div>

                            {/* Display related comments directly from memo.comments */}
                            {memo.comments && memo.comments.length > 0 && (
                                <div className="flex flex-col pl-5 pt-1 w-full">
                                    {memo.comments.map((comment, commentIndex) => (
                                        <div 
                                            key={commentIndex} 
                                            className="flex flex-row p-2 gap-2 bg-gray-100 rounded-3xl text-sm w-full"
                                        >
                                            <div className="flex flex-col w-[40px]">
                                                <Image
                                                    src={comment.user.pictureUrl}
                                                    alt="Profile"
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 w-[calc(90%-40px)]">
                                                <p className="text-xs">{moment(comment.createdAt).locale("th").format("DD MMMM YYYY")}</p>
                                                <p className="text-sm line-clamp-2">{comment.comment}</p>
                                            </div>
                                            <div className="flex flex-col items-center mt-1 w-[20px]">
                                                <HiOutlineDotsVertical 
                                                    className="text-gray-700" 
                                                    size={20} 
                                                    onClick={(e) => handleMenuClick(e, comment._id)}
                                                />
                                            </div>

                                            {/* Dropdown menu */}
                                            <Menu
                                                anchorEl={menuAnchorEl}
                                                open={Boolean(menuAnchorEl)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={() => handleDeleteComment(selectedComment)}>
                                                    ลบความคิดเห็น
                                                </MenuItem>
                                            </Menu>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    ไม่มีข้อมูล
                </div>
            )}
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullWidth={true} // ทำให้ Dialog เต็มหน้าจอในแนวกว้าง
                maxWidth="md" // กำหนดขนาดสูงสุดของ Dialog เป็นขนาด "md"
                PaperProps={{
                    style: {
                        maxHeight: "50vh", // กำหนดความสูงของ Dialog เป็น 50% ของหน้าจอ
                        borderRadius: "15px", // กำหนดให้มุมของ Dialog โค้งมน
                        margin: "10px",
                        padding: "10px",
                    }
                }}
            >
                <div>
                    <div className="flex flex-row items-center gap-2 mt-5 w-full">
                        <IoIosArrowBack 
                            className="text-xl inline text-gray-700"
                            onClick={handleClose}
                            size={25}
                        />
                        <div>
                            <span className="font-bold text-lg text-[#0056FF]">ตอบกลับความคิดเห็น</span>
                        </div>
                    </div>

                    <Divider className="w-full mt-4 mb-4" />

                    <div className="flex flex-col justify-center items-center gap-1 mt-2 px-4 w-full">
                        <div className="flex flex-col p-2 bg-white border rounded-xl w-full">
                            <textarea
                                className="w-full outline-none resize-none"
                                placeholder="กรอกความคิดเห็น"
                                value={textareaValue}
                                onChange={(e) => setTextareaValue(e.target.value)}
                            />
                            <div className="flex flex-row justify-end items-center gap-2 px-1">
                                <RiEmojiStickerLine 
                                    className="text-xl inline text-gray-500"
                                    size={20}
                                />
                                <ImFilePicture 
                                    className="text-xl inline text-gray-500"
                                    size={18}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-2 px-6 w-full mt-2">
                        <button
                            className="text-white bg-[#0056FF] rounded-xl px-6 py-1"
                            onClick={handleComment}
                        >
                            ส่ง
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default SurveyMemo;

SurveyMemo.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyMemo.auth = true;
