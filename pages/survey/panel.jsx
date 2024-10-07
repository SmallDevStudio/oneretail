import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import StickerPanel from "@/components/stickers/StickerPanel";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import { RiEmojiStickerLine } from "react-icons/ri";
import { ImFilePicture } from "react-icons/im";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import Swal from "sweetalert2";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SurveyPanel = () => {
    const [open, setOpen] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [seletedComment, setSelectedComment] = useState(null);
    const [openSticker, setOpenSticker] = useState(false);
    const [sticker, setSticker] = useState(null);
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);  // Menu anchor state

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const surveyId = router.query.surveyId;

    const { data: survey, error: surveyError, mutate: fetchSurveyData } = useSWR(() => userId ? `/api/survey/board/comments/${surveyId}` : null, fetcher);
    const { data: user } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);

    if (surveyError) return <div>Error loading Survey</div>;
    if (!survey) return <CircularProgress />;

    const handleEditComment = (id) => {
        console.log("Editing", id);
        // Implement edit logic
    };

    const handleDeleteComment = async (id) => {
        setMenuAnchorEl(null);
    
        // Await the Swal.fire promise to ensure it waits for user action
        const result = await Swal.fire({
            title: 'คุณต้องการลบความคิดเห็นใช่หรือไม่?',
            text: 'คุณจะไม่สามารถย้อนกลับได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0056FF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
        });
    
        if (result.isConfirmed) {
            setIsLoading(true);
            console.log("Deleting", id);
            try {
                await axios.delete(`/api/survey/board/comments/delete?id=${id}`);
                fetchSurveyData(); // Refresh survey data
                Swal.fire({
                    icon: 'success',
                    title: 'ลบความคิดเห็นสําเร็จ',
                    text: 'คุณได้ลบความคิดเห็นเรียบร้อยแล้ว',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#0056FF',
                    allowOutsideClick: true,
                });
            } catch (error) {
                console.error("Error deleting comment:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'ลบความคิดเห็นไม่สําเร็จ',
                    text: 'เกิดข้อผิดพลาดขณะลบความคิดเห็น',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#0056FF',
                    allowOutsideClick: true,
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSend = async () => {
        setIsLoading(true);

        const newReply = {
            commentId: seletedComment,
            userId: userId,
            reply: textareaValue,
            sticker,
            medias: media,
        };

        try {
            const response = await axios.post(`/api/survey/board/reply`, newReply);
            if (response.success) {
                try {
                    await axios.post('/api/notifications', {
                        userId: response.data.data.userId,
                        senderId: userId,
                        description: `แสดงความคิดเห็นใน Verbatim`,
                        referId: response.data.data._id,
                        path: 'Survey',
                        subpath: 'Memo',
                        url: `/survey/panel?surveyId=${survey.data._id}`,
                        type: 'Reply'
                    });
                } catch (error) {
                    console.error("Error posting notification:", error);
                }
            }
            
            setSelectedComment(null);
            setTextareaValue('');
            setSticker(null);
            setMedia([]);
            fetchSurveyData();
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'ส่งความคิดเห็นสําเร็จ',
                text: 'คุณได้ส่งความคิดเห็นเรียบร้อยแล้ว',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#0056FF',
                allowOutsideClick: true,
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClickOpen = (id) => {
        setSelectedComment(id);
        setOpen(true);
    };
    
    const handleClose = () => {
        setSelectedComment(null);
        setTextareaValue('');
        setOpen(false);
    };

    const handleOpenSticker = () => {
        setOpenSticker(true);
    };

    const handleCloseSticker = () => {
        setOpenSticker(false);
    };

    const handleMenuClick = (event, commentId) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedComment(commentId);  // Save the commentId for deletion
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedComment(null);
    };

    const isCommentOwner = (commentUserId) => {
        return commentUserId === userId;
    };

    const canDelete = () => {
        return user?.role === "admin" || user?.role === "manager";
    };


    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => handleClose()}
                    size={25}
                />
                <h2 className="text-3xl font-bold text-[#0056FF]">
                    Verbatim
                </h2>
                <div></div>
            </div>

            <div className="flex flex-col mt-5 w-full">
                <div className="flex flex-col px-2 py-1 w-full">
                    <div className="flex flex-row gap-4 px-2 py-1 w-full bg-gray-300 rounded-xl text-sm">
                        <div className="flex flex-col w-[40px]">
                            <Image
                                src="/images/survey/3.svg"
                                alt="Profile"
                                width={50}
                                height={50}
                                className="rounded-full bg-white p-1"
                                style={{ width: '40px', height: '40px' }}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1 w-[calc(75%-40px)]">
                            <p className="text-xs">{moment(survey?.data?.createdAt).locale("th").format("DD MMMM YYYY")}</p>
                            <p className="text-sm">{survey?.data?.memo}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Comments List */}
            {Array.isArray(survey?.data?.comments) && 
                survey?.data?.comments.map((comment, index) => (
                <div key={index} className="flex flex-col px-2 w-full">
                    <div className="flex flex-col bg-gray-200 rounded-xl p-1 w-full">
                        <div className="flex flex-row  w-full">
                            <div className="flex flex-col">
                                <Image
                                    src={comment.user.pictureUrl}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                    style={{ width: '40px', height: '40px' }}
                                />
                            </div>

                            <div className="flex flex-col w-full text-left ml-2 px-1">
                                <div className="flex flex-row justify-between w-full ">
                                    <span className="text-sm font-bold text-[#0056FF]">{comment.user.fullname}</span>
                                    <div className="flex flex-row gap-1">
                                        <span className="text-xs">{moment(comment.createdAt).locale("th").format("LL")}</span>
                                        <BsThreeDotsVertical 
                                            className="text-gay-300 cursor-pointer"
                                            onClick={(e) => handleMenuClick(e, comment._id)}
                                        />
                                    </div>

                                    {/* Dropdown menu */}
                                    <Menu
                                        anchorEl={menuAnchorEl}
                                        open={Boolean(menuAnchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => handleDeleteComment(seletedComment)}>
                                            ลบความคิดเห็น
                                        </MenuItem>
                                    </Menu>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-sm">{comment.comment}</p>
                                    <div className="flex flex-col jestify-center items-center w-full">
                                        {comment?.sticker && (
                                            <div className="flex flex-row gap-1">
                                                <Image
                                                    src={comment.sticker.url}
                                                    alt="Profile"
                                                    width={80}
                                                    height={80}
                                                    className="rounded-full"
                                                    style={{ width: 'auto', height: '80px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider className="w-full my-1" />

                        <div className="flex flex-row justify-end items-center gap-2 mx-2">
                            <div className="flex flex-row items-center jestify-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-xl shadow-sm"
                                onClick={() => handleClickOpen(comment._id)}
                            >
                                <FaRegCommentDots className="text-gray-500 text-sm"/>
                                <span>ตอบกลับ</span>
                            </div>
                        </div>
                    </div>

                    {Array.isArray(comment?.reply) && comment?.reply.map((reply, index) => (
                        <div key={index} className="flex flex-col w-full mt-1">
                            <div className="flex flex-col bg-gray-100 rounded-xl p-1 w-full">
                                <div className="flex flex-row  w-full">
                                    <div className="flex flex-col w-[50px]">
                                        <Image
                                            src={reply?.user?.pictureUrl}
                                            alt="sticker"
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                            style={{ width: '40px', height: '40px' }}
                                        />
                                    </div>

                                    <div className="flex flex-col w-full text-left ml-2 px-1">
                                        <div className="flex flex-row justify-between w-full ">
                                            <span className="text-sm font-bold text-[#0056FF]">{reply?.user?.fullname}</span>
                                            <div className="flex flex-row gap-1">
                                                <span className="text-xs">{moment(reply?.createdAt).locale("th").format("LL")}</span>
                                                <BsThreeDotsVertical 
                                                    className="text-gay-300"
                                                    onClick={(e) => handleMenuClick(e, reply?._id)}
                                                />
                                            </div>

                                            {/* Dropdown menu */}
                                            <Menu
                                                anchorEl={menuAnchorEl}
                                                open={Boolean(menuAnchorEl)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={() => handleDeleteComment(seletedComment)}>
                                                    ลบความคิดเห็น
                                                </MenuItem>
                                            </Menu>
                                        </div>

                                        <div className="flex flex-col">
                                            <p className="text-sm">{reply?.reply}</p>
                                            <div className="flex flex-col w-full">
                                                {reply?.sticker && (
                                                    <div className="flex flex-row gap-1">
                                                        <Image
                                                            src={reply?.sticker?.url}
                                                            alt="sticker"
                                                            width={80}
                                                            height={80}
                                                            className="rounded-full"
                                                            style={{ width: 'auto', height: '80px' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="w-full my-1" />

                                <div className="flex flex-row justify-end items-center gap-2 mx-2">
                                    <div className="flex flex-row items-center jestify-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-xl shadow-sm">
                                        <FaRegCommentDots className="text-gray-500 text-sm"/>
                                        <span>ตอบกลับ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

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
                    {isLoading && <CircularProgress />}
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
                            {sticker && (
                                <div className="flex flex-col jestify-center items-center gap-1">
                                    <Image
                                        src={sticker.url}
                                        alt="sticker"
                                        width={80}
                                        height={80}
                                        style={{ width: 'auto', height: '80px' }}
                                    />
                                </div>
                            )}
                            <div className="flex flex-row justify-end items-center gap-2 px-1">
                                <RiEmojiStickerLine 
                                    className="text-xl inline text-gray-500"
                                    size={20}
                                    onClick={handleOpenSticker}
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
                            onClick={handleSend}
                        >
                            ส่ง
                        </button>
                    </div>
                </div>
            </Dialog>

            {openSticker && (
                <Dialog
                    open={openSticker}
                    onClose={handleCloseSticker}
                    TransitionComponent={Transition}
                >
                    <StickerPanel
                        setSticker={setSticker}
                        onClose={handleCloseSticker}
                    />
                </Dialog>
            )}

        </div>
    );
}

export default SurveyPanel;

SurveyPanel.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyPanel.auth = true;

