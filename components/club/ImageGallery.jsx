import React, { useState } from "react";
import Image from "next/image";
import { Modal, Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ImageGallery = ({ images }) => {
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    const handleOpen = (image) => {
        setCurrentImage(image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentImage(null);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {images.length === 1 ? (
                <div className="flex w-full" onClick={() => handleOpen(images[0])}>
                    <Image
                        src={images[0].url}
                        alt="image"
                        width={600}
                        height={400}
                        className="rounded-xl mt-2 object-cover cursor-pointer"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            ) : (
                images.map((image, index) => (
                    <div key={index} className="flex w-1/2" onClick={() => handleOpen(image)}>
                        <Image
                            src={image.url}
                            alt="image"
                            width={300}
                            height={200}
                            className="rounded-xl mt-2 object-cover cursor-pointer"
                            style={{ width: '100%', height: 'auto' }}
                        />
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
                                width={800}
                                height={600}
                                className="rounded-xl object-cover"
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