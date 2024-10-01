import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
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
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SurveyPanel = () => {
    const [open, setOpen] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [seletedComment, setSelectedComment] = useState(null);

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const surveyId = router.query.surveyId;

    const { data: survey, error: surveyError } = useSWR(() => userId ? `/api/survey/board/comments/${surveyId}` : null, fetcher);

    if (surveyError) return <div>Error loading Survey</div>;
    if (!survey) return <CircularProgress />;

    const handleClickOpen = (id) => {
        setSelectedComment(id);
        setOpen(true);
    };
    
    const handleClose = () => {
        setSelectedComment(null);
        setTextareaValue('');
        setOpen(false);
    };


    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => router.back()}
                    size={25}
                />
                <h2 className="text-3xl font-bold text-[#0056FF]">
                    แสดงความคิดเห็น
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
            {Array.isArray(survey?.data?.comments) && survey?.data?.comments.map((comment, index) => (
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
                                        <BsThreeDotsVertical className="text-gay-300"/>
                                    </div>
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
                        <div key={index} className="flex flex-col px-2 w-full">
                            <div className="flex flex-col bg-gray-100 rounded-xl p-1 w-full">
                                <div className="flex flex-row  w-full">
                                    <div className="flex flex-col">
                                        <Image
                                            src={reply.user.pictureUrl}
                                            alt="sticker"
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                            style={{ width: '40px', height: '40px' }}
                                        />
                                    </div>

                                    <div className="flex flex-col w-full text-left ml-2 px-1">
                                        <div className="flex flex-row justify-between w-full ">
                                            <span className="text-sm font-bold text-[#0056FF]">{reply.user.fullname}</span>
                                            <div className="flex flex-row gap-1">
                                                <span className="text-xs">{moment(reply.createdAt).locale("th").format("LL")}</span>
                                                <BsThreeDotsVertical className="text-gay-300"/>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <p className="text-sm">{reply.reply}</p>
                                            <div className="flex flex-col jestify-center items-center w-full">
                                                {reply?.sticker && (
                                                    <div className="flex flex-row gap-1">
                                                        <Image
                                                            src={reply.sticker.url}
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
                        >
                            ส่ง
                        </button>
                    </div>
                </div>
            </Dialog>

        </div>
    );
}

export default SurveyPanel;

SurveyPanel.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyPanel.auth = true;

