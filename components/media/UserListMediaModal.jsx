import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Modal from 'react-modal';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { ImFilePicture } from "react-icons/im";
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

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
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null); // สร้าง ref สำหรับ input file

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data, error } = useSWR(`/api/libraries/avatar?userId=${userId}`, fetcher);

    if (error) return <div>Error loading data</div>

    const handleUploadClick = () => {
        fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
    };

    const handleFileChange = async (e) => {
        setIsUploading(true); // เริ่มการอัปโหลด
        const fileArray = Array.from(e.target.files); // แปลง FileList เป็น array

        const uploadPromises = fileArray.map(async (file) => {
            const newBlob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/blob/upload',
            });
      
            const mediaEntry = {
              url: newBlob.url,
              public_id: nanoid(10),
              file_name: file.name,
              mime_type: file.type,
              file_size: file.size,
              type: file.type.startsWith('image') ? 'image' : 'video',
              userId, // เชื่อมโยงกับ userId ของผู้ใช้
              folder: 'avatar', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
              subfolder: 'comments', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน subfolder
            };
      
            // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
            await axios.post('/api/upload/save', mediaEntry);
      
            return mediaEntry;
          });
      
          // รอการอัปโหลดทั้งหมดเสร็จสิ้น
          const uploadedMedia = await Promise.all(uploadPromises);
      
          // เพิ่มไฟล์ที่อัปโหลดทั้งหมดใน state media
          setSelectedImageUrl(uploadedMedia[0].url);
      
          setIsUploading(false);
      
          // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการอัปโหลดเสร็จ
          fileInputRef.current.value = '';
        
    };

    const selectedImage = (url) => {
        setSelectedImageUrl(url);
        setImageSrc(url);
    };

    const handleSubmit = () => {
        setPictureUrl(selectedImageUrl);
        onRequestClose();
    };

    const handleClose = () => {
        setImageSrc(null);
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
            <div className="flex flex-col justify-center items-center text-sm w-full">
                {isUploading ? (
                    <div>
                        <CircularProgress />
                    </div>
                ): (
                    imageSrc && (
                        <div className='flex w-full justify-center items-center relative'>
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
                    )
                )}

                <div className='flex justify-center w-full items-center py-2'>
                    <button
                        onClick={handleUploadClick}
                        className="flex flex-row items-center gap-2 p-2 cursor-pointer bg-gray-200 rounded-md"
                    >
                        <ImFilePicture className="text-xl text-[#0056FF]" />
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold">อัพโหลดรูปภาพ</span>
                            <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                        </div>
                    </button>
                    {/* ซ่อน input file แต่ใช้ ref เพื่อให้มันทำงานเมื่อกดปุ่ม */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple // สามารถเลือกหลายไฟล์ได้
                        accept="image/*" // จำกัดชนิดของไฟล์
                        onChange={handleFileChange} // ดักการเปลี่ยนแปลงของไฟล์ที่เลือก
                        style={{ display: 'none' }} // ซ่อน input file
                    />
                </div>
            </div>
            <Divider className='w-full mt-2' />
            <div>
                {/* MediaList */}
                <div className="grid grid-cols-3 gap-4 p-4">
                    {!data ? (
                        <div className="flex justify-center items-center">
                            <CircularProgress />
                        </div>
                    ): (
                        data?.data && data.data.length > 0 && data.data.map((media, index) => (
                            <Image
                                key={index}
                                src={media.url}
                                alt={media.public_id}
                                width={100}
                                height={100}
                                style={{
                                    width: '100px',
                                    height: 'auto',
                                }}
                                className="object-cover"
                                onClick={() => selectedImage(media.url)}
                            />
                        ))
                    )}
                </div>
                {selectedImageUrl && (
                    <div className="flex justify-center">
                        <button
                            className='bg-[#0056FF] px-2 py-1 rounded-md text-white'
                            onClick={handleSubmit}
                        >
                            เลือกรูปภาพ
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default UserListMediaModal;
