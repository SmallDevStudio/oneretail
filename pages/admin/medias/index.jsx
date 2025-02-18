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
import { firebaseDeleteFile } from "@/lib/firebaseUploadFile";
import { IoCopyOutline } from "react-icons/io5";
import { QRCodeCanvas } from 'qrcode.react';

moment.locale("th");

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = url => axios.get(url).then(res => res.data);

const Medias = () => {
    const [media, setMedia] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [startSelectedIndex, setStartSelectedIndex] = useState(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
    const [openInfo, setOpenInfo] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data, error, isLoading, mutate } = useSWR(`/api/library`, fetcher,{
        onSuccess: (data) => {
            setMedia(data.data);
        },
    });

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
        setSelectedFiles([]);
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

    const handleDownload = (media) => {
        const url = `/share/${media._id}`;
        window.open(url, "_blank");
    }

    const handleShare = (media) => {
        const url = media.url;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("URL คัดลอกไปยัง clipboard!");
        }).catch(err => {
            console.error('Error copying URL:', err);
            toast.error("ไม่สามารถคัดลอก URL!");
        });
    }

    const handleMultiSelect = (e, media, index) => {
        if (e.ctrlKey || e.metaKey) {
            setSelectedFiles((prev) => prev.includes(media) ? prev.filter(item => item !== media) : [...prev, media]);
            setStartSelectedIndex(index);
        } else if (e.shiftKey && startSelectedIndex !== null) {
            setLastSelectedIndex(index);
            const selectedRange = Array.from(media).slice(startSelectedIndex, lastSelectedIndex + 1);
            setSelectedFiles([...selectedRange]);
        } else {
            setSelectedFiles([media]);
            setStartSelectedIndex(index);
            setLastSelectedIndex(null);
        }
    };

    const handleDeleteMultiple = async () => {
        if (!selectedFiles.length) {
            alert("กรุณาเลือกไฟล์ที่ต้องการลบ");
            return;
        };

        await Swal.fire({
            title: 'คุณแน่ใจ?',
            text: "คุณต้องการลบไฟล์ที่เลือกใช่หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบ!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(selectedFiles.map(async (file) => {
                        await firebaseDeleteFile(file.file_id, "files", file.file_name);
                        await axios.delete(`/api/library/${file._id}`);
                    }));
                    mutate();
                    toast.success("ไฟล์ที่เลือกถูกลบเรียบร้อย!");
                    setSelectedFiles([]);
                    setStartSelectedIndex(null);
                    setLastSelectedIndex(null);
                } catch (error) {
                    console.error("Error deleting files:", error);
                }
            }
        });
    };

    const genereteUrl = (fileId) => {
        console.log('genereteUrl', fileId);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/share/${fileId}`;
        return url;
    }

    const handleDownloadQrCode = (fileName) => {
        const canvas = document.getElementById("qr-code-download");
          if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl
            downloadLink.download = `${fileName}-QR.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    console.log('selectedFiles', selectedFiles);

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
                        {selectedFiles.length > 0 && (
                            <>
                            <Tooltip title="ลบไฟล์" arrow>
                                <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-red-500" 
                                    onClick={() => handleDeleteMultiple()}                              
                                >
                                    <BsFileEarmarkMinusFill size={20} />
                                </div>
                            </Tooltip>
                            <Tooltip title="รายละเอียดไฟล์" arrow>
                                <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-blue-500" 
                                    onClick={() => handleOpenInfo()}                            
                                >
                                    <FaInfoCircle size={20} />
                                </div>
                            </Tooltip>
                            </>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="px-4">
                    {isLoading && <Loading />}
                    <div className="flex flex-row flex-wrap gap-2 text-sm w-full">
                        {media.map((media, index) => (
                            <div 
                                key={index}
                                className={`flex flex-col gap-1 max-w-[100px] p-2 cursor-pointer hover:bg-gray-100 rounded-md
                                    ${selectedFiles.includes(media) ? "bg-blue-100" : ""}
                                    `}
                                onClick={(e) => handleMultiSelect(e, media, index)}
                                
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
                        mutate={mutate}
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
                    <div className="flex flex-col gap-2 px-4 py-2">
                        <div className="flex flex-col gap-2 items-center">
                            <Image 
                                src={getFileIcon(selectedFiles[0]?.type)}
                                alt={selectedFiles[0]?.file_name}
                                width={100}
                                height={100}
                                className="rounded-md"
                            />
                            <span className="text-lg font-bold">{selectedFiles[0]?.file_name}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-sm">ขนาดไฟล์:</span>
                            <span className="text-sm">{formatFileSize(selectedFiles[0]?.file_size)}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-sm">วันที่อัพโหลด:</span>
                            <span className="text-sm">{moment(selectedFiles[0]?.createdAt).format("lll")}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-sm">ผู้อัพโหลด:</span>
                            <span className="text-sm">{selectedFiles[0]?.user?.fullname}</span>
                        </div>
                    </div>
                    <Tooltip title="คลิกเพื่อดาวน์โหลด" onClick={() => handleDownloadQrCode(selectedFiles[0].file_name)} arrow>
                        <div className="flex flex-col items-center">
                            <QRCodeCanvas 
                                id="qr-code-download"
                                value={genereteUrl(selectedFiles[0]?._id)}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    </Tooltip>
                    <Divider className="my-2"/>
                    <div className="flex flex-row justify-center text-sm gap-6 p-4">
                        <button
                            className="flex flex-col items-center gap-1 border bg-yellow-500 text-white font-bold border-gray-200 rounded-md p-2 hover:bg-yellow-700"
                            onClick={() => handleDownload(selectedFiles[0])}
                        >
                            <GoDownload size={30}/>
                            <span>ดาวน์โหลดไฟล์</span>
                            
                        </button>
                        <button
                            className="flex flex-col items-center gap-1 border bg-blue-600 text-white font-bold border-gray-200 rounded-md p-2 hover:bg-blue-800"
                            onClick={() => handleShare(selectedFiles[0])}
                        >
                            <IoCopyOutline size={30}/>
                            <span>คัดลอก URL</span>
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Medias;