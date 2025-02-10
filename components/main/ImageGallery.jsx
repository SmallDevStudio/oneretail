import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Modal, Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegPlayCircle } from "react-icons/fa";
import { TbZoomScan } from "react-icons/tb";
import axios from 'axios';

const ImageGallery = ({ medias, userId }) => {
    const [open, setOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [hasSentView, setHasSentView] = useState({}); // state เพื่อเก็บสถานะการส่งข้อมูล views
    const videoRefs = useRef([]); // ใช้ ref เก็บ video element หลายตัว

    // รีเซ็ต hasSentView เมื่อ medias เปลี่ยน (เช่นเมื่อเปลี่ยนโพสต์)
    useEffect(() => {
        setHasSentView({}); // รีเซ็ตค่า hasSentView ทุกครั้งเมื่อโพสต์หรือ medias เปลี่ยน
    }, [medias]);

    const handleOpen = (media, index) => {
        setCurrentMedia(media);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentMedia(null);
    };

    // ฟังก์ชันสำหรับ handleTimeUpdate
    const handleTimeUpdate = async (index) => {
        const videoElement = videoRefs.current[index];
        if (!videoElement) return;

        const percentPlayed = (videoElement.currentTime / videoElement.duration) * 100;

        // ถ้าการเล่นถึง 80% และยังไม่ได้ส่งข้อมูล views ให้ส่งข้อมูล
        if (percentPlayed >= 80 && !hasSentView[index]) {
            try {
                await axios.post('/api/libraries/views', {
                    publicId: medias[index].public_id,
                    userId,
                });

                // อัปเดตสถานะว่าได้ส่งข้อมูลไปแล้วสำหรับวิดีโอนี้
                setHasSentView((prevState) => ({
                    ...prevState,
                    [index]: true,
                }));

            } catch (error) {
                console.error("Error posting video view:", error);
            }
        }
    };

    return (
        <div className="flex gap-2">
            <div className="flex flex-col justify-center items-center w-full">
            {medias.length > 1 ? (
                <div className="grid grid-cols-2">
                {medias.map((media, index) => (
                    <div key={index} className="flex relative">
                        {media.type === "image" ? (
                            <div className="flex flex-col w-full" 
                                onClick={() => handleOpen(media, index)}
                                style={{ width: '180px', height: '250px' }}
                            >
                                <div 
                                    className="flex w-full relative"
                                    style={{ width: '180px', height: '210px' }}
                                >
                                    <Image
                                        src={media.url}
                                        alt="image"
                                        width={600}
                                        height={400}
                                        className="object-cover cursor-pointer"
                                        style={{ width: '100%', height: 'auto' }}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex relative bottom-8 right-1 justify-end items-center">
                                    <div className="bg-white/50 flex justify-center items-center rounded-full p-2">
                                        <TbZoomScan />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full relative">
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)} // เก็บ video element แต่ละตัวใน ref
                                    src={media.url}
                                    controls
                                    className="object-cover cursor-pointer"
                                    style={{ width: '100%', height: 'auto' }}
                                    onTimeUpdate={() => handleTimeUpdate(index)} // ตรวจสอบเวลาเล่นของวิดีโอแต่ละตัว
                                />
                            </div>
                        )}
                    </div>
                ))}
                </div>
            ): 
                medias.map((media, index) => (
                    <div key={index} className="flex relative">
                        {media.type === "image" ? (
                            <div className="flex flex-col w-full">
                                <div className="flex relative w-full" onClick={() => handleOpen(media, index)}>
                                    <Image
                                        src={media.url}
                                        alt="image"
                                        width={600}
                                        height={400}
                                        className="object-cover cursor-pointer"
                                        style={{ width: '100%', height: 'auto' }}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex relative bottom-10 right-2 justify-end items-center">
                                    <div className="bg-white/50 flex justify-center items-center rounded-full p-2">
                                        <TbZoomScan />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full relative">
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)} // เก็บ video element แต่ละตัวใน ref
                                    src={media.url}
                                    controls
                                    className="mt-2 object-cover cursor-pointer"
                                    style={{ width: '100%', height: 'auto' }}
                                    onTimeUpdate={() => handleTimeUpdate(index)} // ตรวจสอบเวลาเล่นของวิดีโอแต่ละตัว
                                />
                            </div>
                        )}
                    </div>
                ))
            }
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                }}>
                    {currentMedia && (
                        <div>
                            <div>
                                <IoIosCloseCircleOutline
                                    size={20}
                                    className="absolute top-0 right-0 cursor-pointer text-[#F2871F]"
                                    onClick={handleClose}
                                />
                            </div>
                            {currentMedia.type === "image" ? (
                                <Image
                                    src={currentMedia.url}
                                    alt="image"
                                    width={600}
                                    height={400}
                                    className="rounded-xl mt-2 object-cover cursor-pointer"
                                    style={{ width: '100%', height: 'auto' }}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="relative w-full">
                                    <video
                                        ref={(el) => (videoRefs.current[medias.indexOf(currentMedia)] = el)} // เก็บ video element ที่แสดงใน modal
                                        src={currentMedia.url}
                                        controls
                                        className="rounded-xl mt-2 object-cover cursor-pointer"
                                        style={{ width: '100%', height: 'auto' }}
                                        onTimeUpdate={() => handleTimeUpdate(medias.indexOf(currentMedia))} // ตรวจสอบเวลาเล่นใน modal
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default ImageGallery;
