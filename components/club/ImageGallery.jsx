import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Modal, Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegPlayCircle } from "react-icons/fa";

const ImageGallery = ({ medias }) => {
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [showPlayIcon, setShowPlayIcon] = useState(true);
    const timeoutRef = useRef(null);

    const handleOpen = (media) => {
        if (media.type === 'image') {
            setCurrentImage(media);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentImage(null);
    };

    const handleVideoClick = () => {
        setPlaying(!playing);
        setShowPlayIcon(false);
        setControlsVisible(true);
        clearTimeout(timeoutRef.current);
        if (!playing) {
            timeoutRef.current = setTimeout(() => {
                setControlsVisible(false);
            }, 3000);
        }
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
        <div className="flex flex-wrap gap-2">
            {medias.length === 1 ? (
                medias[0].type === "image" ? (
                    <div className="flex w-full" onClick={() => handleOpen(medias[0])}>
                        <Image
                            src={medias[0].url}
                            alt="image"
                            width={600}
                            height={400}
                            className="rounded-xl mt-2 object-cover cursor-pointer"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                ) : (
                    <div className="flex w-full relative" onClick={handleVideoClick}>
                        <video
                            src={medias[0].url}
                            controls
                            className="rounded-xl mt-2 object-cover cursor-pointer"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                )
            ) : (
                medias.map((media, index) => (
                    <div key={index} className="flex w-1/2 relative">
                        {media.type === "image" ? (
                            <div className="flex w-full" onClick={() => handleOpen(media)}>
                                <Image
                                    src={media.url}
                                    alt="image"
                                    width={600}
                                    height={400}
                                    className="rounded-xl object-cover cursor-pointer"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        ) : (
                            <div className="flex w-full relative" onClick={() => handleOpen(media)}>
                                <Image
                                    src={media.url}
                                    alt="video thumbnail"
                                    width={600}
                                    height={400}
                                    className="rounded-xl object-cover cursor-pointer"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl" />
                            </div>
                        )}
                    </div>
                ))
            )}
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
                    {currentImage && (
                        <div>
                            <div>
                                <IoIosCloseCircleOutline
                                    size={20}
                                    className="absolute top-0 right-0 cursor-pointer text-[#F2871F]"
                                    onClick={handleClose}
                                />
                            </div>
                            {currentImage.type === "image" ? (
                                <Image
                                    src={currentImage.url}
                                    alt="image"
                                    width={600}
                                    height={400}
                                    className="rounded-xl mt-2 object-cover cursor-pointer"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            ) : (
                                <div className="relative w-full" onClick={handleVideoClick}>
                                    {showPlayIcon && (
                                        <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-5xl" />
                                    )}
                                    <video
                                        src={currentImage.url}
                                        controls
                                        className="rounded-xl mt-2 object-cover cursor-pointer"
                                        style={{ width: '100%', height: 'auto' }}
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
