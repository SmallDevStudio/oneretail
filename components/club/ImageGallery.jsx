import React, { useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Modal, Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegPlayCircle } from "react-icons/fa";

const ImageGallery = ({ medias }) => {
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

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
                    <div className="flex w-full relative">
                        <ReactPlayer
                            url={medias[0].url}
                            width="100%"
                            height="250px"
                            controls
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
                            <ReactPlayer
                                url={media.url}
                                width="100%"
                                height="400px"
                                controls
                                light={
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl" />
                                    </div>
                                }
                                playIcon={<FaRegPlayCircle className="text-white text-5xl" />}
                            />
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
                            <Image
                                src={currentImage.url}
                                alt="image"
                                width={600}
                                height={400}
                                className="rounded-xl mt-2 object-cover cursor-pointer"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default ImageGallery;
