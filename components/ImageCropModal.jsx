import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { CldUploadWidget } from 'next-cloudinary';

Modal.setAppElement('#__next');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '20px',
        height: 'auto',
        width: '400px',
        border: '5px solid #F68B1F',
        overflow: 'hidden',
    },
};

const ImageCropModal = ({ isOpen, onRequestClose, onUpload }) => {
    const [image, setImage] = useState(null);
    const cropperRef = useRef(null);

    const handleUpload = (result) => {
        if (result.event === 'success') {
            setImage(result.info.secure_url);
        }
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            const croppedImageUrl = croppedCanvas.toDataURL();
            onUpload(croppedImageUrl);
            onRequestClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className="modal-header">
                <h2 className="text-2xl font-bold">Upload and Crop Image</h2>
                <div className="flex justify-end">
                    <button onClick={onRequestClose} className="text-black text-xl">
                        <svg className="w-6 h-6 text-[#F68B1F]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                            <path fill="currentColor" d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <CldUploadWidget onUpload={handleUpload}>
                    {({ open }) => (
                        <button onClick={open} className="mt-2 bg-blue-500 text-white font-bold px-4 py-2 rounded-full">
                            Upload Image
                        </button>
                    )}
                </CldUploadWidget>
                {image && (
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        style={{ height: 200, width: '100%' }}
                        aspectRatio={1}
                        guides={false}
                    />
                )}
                {image && (
                    <button onClick={getCropData} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Crop Image
                    </button>
                )}
            </div>
        </Modal>
    );
};

export default ImageCropModal;
