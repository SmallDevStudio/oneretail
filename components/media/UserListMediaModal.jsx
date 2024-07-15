import React, { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then((res) => res.data);

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
        width: '350px',
        border: '2px solid #F68B1F',
        overflow: 'hidden',
    }
};

const UserListMediaModal = ({ isOpen, onRequestClose, setPictureUrl }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [selectImg, setSelectImg] = useState(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { data: session } = useSession();

    const { data: media } = useSWR(() => session?.user?.id ? `/api/media/list?userId=${session?.user?.id}` : null, fetcher);

    const updateImg = (e) => {
        setSelectImg(e.target.files[0]);
        setImageSrc(URL.createObjectURL(e.target.files[0]));
    };

    const uploadImg = async (e) => {
        e.preventDefault();
        if (selectImg) {
            const data = new FormData();
            data.append('file', selectImg);
            data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
            data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

            try {
                setLoading(true);
                const resp = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, data, {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                });

                const res = await axios.post('/api/media', {
                    url: resp.data.secure_url,
                    publicId: resp.data.public_id,
                    name: session.user.id,
                    userId: session.user.id,
                    type: 'image',
                    path: 'avatars',
                    isTemplate: false
                });

                setPictureUrl(resp.data.secure_url);
                setImageSrc(null);
                setLoading(false);
                onRequestClose();
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        setImageSrc(null);
        onRequestClose();
    };

    const handleImageSelect = (url) => {
        setSelectedImageUrl(url);
        setImageSrc(url);
    };

    const handleConfirmSelection = () => {
        setPictureUrl(selectedImageUrl);
        setSelectedImageUrl(null);
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="UserListMediaModal"
        >
            <div className="modal-header">
                <div className='flex justify-end w-full'>
                    <button onClick={handleClose} className='text-black text-xl'>
                        <svg className='w-6 h-6 text-[#F68B1F]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                            <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21,4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center text-sm">
                {imageSrc && (
                    <div className='w-full relative'>
                        <Image
                            src={imageSrc}
                            width={200}
                            height={200}
                            alt="imageSrc"
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                marginTop: '10px',
                            }}
                        />
                    </div>
                )}
                <div className='flex flex-row w-full p-2 items-center'>
                    <input 
                        type="file"
                        onChange={updateImg}
                    />
                    <button
                        className='w-35 h-8 bg-[#F68B1F] text-white text-sm rounded-full p-2 align-middle'
                        onClick={uploadImg}
                        disabled={loading}
                    >
                        {loading ? 'กำลังอัปโหลด...' : 'อัพโหลด'}
                    </button>
                </div>
                {loading && (
                    <div className="w-full bg-gray-200 rounded-full mt-4">
                        <div className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full" style={{ width: `${progress}%` }}>
                            {progress}%
                        </div>
                    </div>
                )}
            </div>
            <div>
                {/* MediaList */}
                <div className="grid grid-cols-3 gap-4 p-4">
                    {media && media.map((item) => (
                        <div 
                            key={item._id} 
                            className={`relative cursor-pointer ${selectedImageUrl === item.url ? 'border-4 border-blue-500' : ''}`}
                            onClick={() => handleImageSelect(item.url)}
                        >
                            <Image 
                                src={item.url} 
                                alt={item.name} 
                                layout="responsive" 
                                width={100} 
                                height={100} 
                                style={{ borderRadius: '10px', objectFit: 'cover' }} 
                            />
                        </div>
                    ))}
                </div>
                {selectedImageUrl && (
                    <div className="flex justify-center mt-4">
                        <button
                            className='w-24 h-8 bg-[#F68B1F] text-white rounded-full'
                            onClick={handleConfirmSelection}
                        >
                            เลือกรูปภาพนี้
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default UserListMediaModal;
