import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Header from "@/components/admin/global/Header";
import MediaForm from "@/components/MediaLibrary/MediaForm";
import { Tooltip, Slide, Dialog, Divider } from "@mui/material";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import { BsFillFileEarmarkPlusFill, BsFileEarmarkMinusFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { GoDownload } from "react-icons/go";

moment.locale("th");

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = url => axios.get(url).then(res => res.data);

const Medias = () => {
    const [media, setMedia] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [openInfo, setOpenInfo] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data, error, isLoading } = useSWR(`/api/library`, fetcher,{
        onSuccess: (data) => {
            setMedia(data.data);
        },
    });

    console.log('media:', media);

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
    }, [status]);

    const handleCloseForm = () => {
        setOpenForm(false);
    }

    const handleOpenInfo = () => {
        setOpenInfo(true);
    }

    const handleCloseInfo = () => {
        setSelectedMedia(null);
        setOpenInfo(false);
    }

    const getFileIcon = (type) => {
        const fileType = type
        if (!fileType) return "/images/iconfiles/other.png";
      
        if (fileType === "pdf") return "/images/iconfiles/pdf.png";
        if (fileType === "msword" || fileType.includes("doc")) return "/images/iconfiles/doc.png";
        if (fileType ==="excel" || fileType.includes("spreadsheet")) return "/images/iconfiles/xls.png";
        if (fileType === "presentation" || fileType.includes("powerpoint")) return "/images/iconfiles/ppt.png";
      
        return "/images/iconfiles/other.png";
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
          return `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
          return `${(bytes / 1024).toFixed(2)} KB`;
        } else {
          return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }
    }

    const handleSelectedMedia = (media) => {
        setSelectedMedia(media);
    }

    const handleDownload = (media) => {
        const url = media.url;
        const fileName = media.file_name;
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    }

    const handleShare = (media) => {
        const url = media.url;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("URL copied to clipboard!");
        }).catch(err => {
            console.error('Error copying URL:', err);
            toast.error("Failed to copy URL!");
        });
    }

    const handleDelete = (media) => {
        
    }


    return (
        <div className="flex flex-col p-4 w-full">
            <Header title={"จัดการไฟล์"} subtitle="จัดการข้อมูลไฟล์" />

            <div className="flex flex-col border border-gray-200 rounded-xl mb-4">
                {/* HEADER */}
                <div className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-t-xl h-12">
                    <div className="flex flex-row gap-2">
                        <Tooltip title="เพิ่มไฟล์" arrow>
                            <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-[#F2871F]" 
                                onClick={() => setOpenForm(true)}
                            >
                                <BsFillFileEarmarkPlusFill size={20} />
                            </div>
                        </Tooltip>
                        <Tooltip title="ลบไฟล์" arrow>
                            <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-red-500" 
                                                            
                            >
                                <BsFileEarmarkMinusFill size={20} />
                            </div>
                        </Tooltip>
                        <Tooltip title="รายละเอียดไฟล์" arrow>
                            <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-blue-500" 
                                onClick={() => handleOpenInfo(selectedMedia)}                            
                            >
                                <FaInfoCircle size={20} />
                            </div>
                        </Tooltip>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="px-4">
                    {isLoading && <Loading />}
                    <div className="flex flex-row gap-2 text-sm w-full">
                        {media.map((media, index) => (
                            <div 
                                key={index}
                                className={`flex flex-col gap-1 max-w-[100px] p-2 cursor-pointer hover:bg-gray-100 rounded-md
                                    ${selectedMedia?._id === media._id ? "bg-blue-100" : ""}
                                    `}
                                onClick={() => handleSelectedMedia(media)}
                            >
                                <Image 
                                    src={getFileIcon(media.type)}
                                    alt={media.file_name}
                                    width={100}
                                    height={100}
                                    className="rounded-md"
                                />
                                <p className="text-center text-xs line-clamp-2 overflow-hidden text-ellipsis break-words">{media.file_name}</p>
                                <span className="text-center text-xs text-gray-500">{formatFileSize(media.file_size)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            
            </div>
            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseForm}
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="flex flex-col p-4">
                    <MediaForm 
                        onClose={handleCloseForm}
                        userId={userId}
                    />
                </div>
            </Dialog>
            <Dialog
                open={openInfo}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseInfo}
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-t-xl h-12">
                        <span className="text-lg font-bold">รายละเอียดไฟล์</span>
                        <IoClose className="text-xl cursor-pointer" onClick={handleCloseInfo} />
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        <div className="flex flex-col gap-2 items-center">
                            <Image 
                                src={getFileIcon(selectedMedia?.type)}
                                alt={selectedMedia?.file_name}
                                width={100}
                                height={100}
                                className="rounded-md"
                            />
                            <span className="text-lg font-bold">{selectedMedia?.file_name}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-sm">ขนาดไฟล์:</span>
                            <span className="text-sm">{formatFileSize(selectedMedia?.file_size)}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-sm">วันที่อัพโหลด:</span>
                            <span className="text-sm">{moment(selectedMedia?.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-sm">ผู้อัพโหลด:</span>
                            <span className="text-sm">{selectedMedia?.user?.fullname}</span>
                        </div>
                    </div>
                    <Divider className="my-2"/>
                    <div className="flex flex-row justify-center text-sm gap-6 p-4">
                        <button
                            className="flex flex-col items-center gap-1 border border-gray-200 rounded-md p-2 hover:bg-gray-100"
                            onClick={() => handleDownload(selectedMedia)}
                        >
                            <GoDownload />
                            <span>ดาวน์โหลดไฟล์</span>
                            
                        </button>
                        <button
                            className="flex flex-col items-center gap-1 border border-gray-200 rounded-md p-2 hover:bg-gray-100"
                            onClick={() => handleShare(selectedMedia)}
                        >
                            <IoIosShareAlt />
                            <span>แชร์ไฟล์</span>
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Medias;