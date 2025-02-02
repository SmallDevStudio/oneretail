import React, { useState } from "react";
import Image from "next/image";
import { Dialog, Slide } from "@mui/material";
import { TbZoomScan } from "react-icons/tb";
import { IoCloseCircleOutline,IoDownload } from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoTab({ videoData }) {
    const [openVideo, setOpenVideo] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleOpenVideo = (video) => {
        setSelectedVideo(video);
        setOpenVideo(true);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
        setOpenVideo(false);
    }
    
    return (
        <div className="flex flex-col w-full bg-white mt-2 py-2 h-[100%]">
            <div className="grid grid-cols-3 justify-between w-full gap-2">
                {videoData?.map((video, index) => (
                    <div key={index} className="relative flex flex-col items-center w-full">
                        {/* Video */}
                        {video?.medias?.map((media, mediaIndex) => (
                            <div 
                                key={mediaIndex} 
                                className="relative"
                                onClick={() => handleOpenVideo(video)}
                            >
                                <video
                                    src={media.thumbnail || media.url} // URL ของวิดีโอ
                                    controls={false} // ไม่แสดงปุ่มควบคุม
                                    poster={media.thumbnail || undefined} // ใช้ thumbnail ถ้ามี
                                    width="120"
                                    height="120"
                                    className="rounded-md"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        height: "120px",
                                        width: "120px",
                                    }}
                                />
                                <div className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-50 rounded-tl-md">
                                    <TbZoomScan className="text-white cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Dialog
                open={openVideo}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseVideo}
                sx={{
                    "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                    "& .MuiDialog-paper": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        overflow: "hidden",
                        borderRadius: 0,
                        width: "100%",
                    },
                }}
            >
                <div className="relative">
                    <button
                        className="flex items-center justify-end text-white w-full"
                        onClick={handleCloseVideo}
                    >
                        <IoCloseCircleOutline size={30} />
                    </button>
                    <video
                        src={selectedVideo?.url}
                        controls={true}
                        width="100%"
                        height="100%"
                        className="rounded-md"
                    />
                </div>
            </Dialog>
        </div>
    )
}