import React, { useState, useEffect, useRef } from "react";
import { ImFilePicture } from "react-icons/im";
import { FaUserPlus, FaRegPlayCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Image from "next/image";
import Divider from '@mui/material/Divider';
import TagUsers from "./TagUsers";
import fetchLinkPreview from '@/utils/fetchLinkPreview';
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PostInput = ({ handleSubmit, userId, handleClose, checkError }) => {
    const [post, setPost] = useState("");
    const [media, setMedia] = useState([]);
    const [files, setFiles] = useState([]); // สำหรับการอัพโหลดเอกสารครั้งละ 1 ไฟล์
    const [folder, setFolder] = useState('');
    const [link, setLink] = useState("");
    const [linkPreview, setLinkPreview] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now());
    const [selectedUsers, setSelectedUser] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    console.log(media);

    const fileInputRef = useRef(null); // สร้าง ref สำหรับ input file

    const handleUploadClick = () => {
        fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
    };

    // ฟังก์ชัน handleFileChange ที่จะเริ่มอัปโหลดทันทีหลังจากเลือกไฟล์
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files); // แปลง FileList เป็น array
        setIsUploading(true); // เริ่มการอัปโหลด
        const uploadedUrls = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const formData = new FormData();
            formData.append('file', selectedFiles[i]);
            formData.append('folder', 'posts');
            formData.append('userId', userId);

            try {
                const res = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress((prevProgress) => ({
                            ...prevProgress,
                            [i]: percentCompleted, // อัปเดต progress ของไฟล์ปัจจุบัน
                        }));
                    },
                });

                setMedia((prevMedia) => [...prevMedia, ...res.data]); // อัปเดต media ด้วยข้อมูลจาก API
                uploadedUrls.push(...res.data); // เก็บ URL ที่อัปโหลดสำเร็จ

            } catch (error) {
                console.error(`Error uploading file ${i + 1}:`, error);
            }
        }

        setIsUploading(false); // หยุดการอัปโหลดเมื่อครบทุกไฟล์
        setFiles([]); // clear input files หลังการอัปโหลดเสร็จ
    };

    const handleRemoveMedia = async (index) => {
        const publicId = media[index].public_id;
        const url = media[index].url;
      
        try {
          // ส่งคำขอ DELETE ไปยัง API
          await axios.delete(`/api/upload?publicId=${publicId}&url=${encodeURIComponent(url)}`);
      
          // ลบรายการใน state หลังจากที่ลบสำเร็จ
          const updatedMedia = media.filter((_, i) => i !== index);
          setMedia(updatedMedia);
        } catch (error) {
          console.error('Error removing media:', error);
        }
      };

    const handleRemoveFile = () => {
        setFiles(null);
    };

    const handleRemoveLink = () => {
        setLink("");
        setLinkPreview(null);
    };

    useEffect(() => {
        setInputKey(Date.now());
    }, [media, files]);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleSubmitComment = async () => {
        if (!post || (!media || media.length === 0)) {
            setError('กรุณากรอกข้อความหรืออัพโหลดไฟล์');
            setIsLoading(false);
            return;
        }

        const newPost = {
            post: post.replace(link, "").trim(),
            media,
            files: files ? [{ url: files.url, public_id: files.public_id, type: 'file' }] : [],
            link,
            selectedUsers,
        };

        setPost("");
        setLink("");
        setMedia([]);
        setFiles(null);
        setSelectedUser([]);
        handleSubmit(newPost);
    };

    const handlePostChange = async (event) => {
        const inputValue = event.target.value;
        setError(null);
        setPost(inputValue);
        const extractedLink = await extractLink(inputValue);
        if (extractedLink) {
            setLink(extractedLink);
            const preview = await fetchLinkPreview(extractedLink);
            setLinkPreview(preview);
        } else {
            setLink("");
            setLinkPreview(null);
        }
    };

    const extractLink = async (text) => {
        const urlPattern = new RegExp(
            'https?://[a-zA-Z0-9-._~:/?#@!$&()*+,;=%]+', 'g'
        );

        const matches = text.match(urlPattern);

        if (matches) {
            return matches[0];
        }
        return null;
    };

    return (
        <div>
            <div className="flex flex-row items-center mb-4 gap-4">
                <IoIosArrowBack className="text-xl inline text-gray-700" onClick={handleClose} />
                <span>สร้างโพส</span>
            </div>
            <div>
                <div className="flex flex-row gap-2">
                    {selectedUsers.length > 0 ? (
                        <span className="text-xs font-bold">แท็กผู้คน</span>
                    ) : null}

                    {selectedUsers.length > 0 && selectedUsers.map((user, index) => (
                        <div key={index} className="flex flex-row gap-2">
                            <span className="text-xs text-[#0056FF]">{user.fullname}</span> {/* แสดง fullname */}
                        </div>
                    ))}
                </div>
                <textarea
                    className="w-full min-h-32 border-gray-300 rounded-lg outline-none"
                    value={post}
                    name="post"
                    placeholder="คุณคิดอะไรอยู่...?"
                    onChange={handlePostChange}
                />
                {error && (
                    <span className="text-red-500 text-sm">{error}</span>
                )}
                <div className="flex flex-col gap-2 mt-2 mb-2">
                    <div className="flex flex-row items-center w-full">
                        {Array.isArray(media) && media.length > 0 && media.map((item, index) => (
                            <div key={index} className="flex gap-2 ml-2">
                                <div className="relative flex flex-col p-2 border-2 rounded-xl">
                                {uploadProgress[index] === 100 && (
                                    <IoIosCloseCircle
                                        className="absolute top-0 right-0 text-xl cursor-pointer"
                                        onClick={() => handleRemoveMedia(index)}
                                    />
                                )}
                                    {uploadProgress[index] !== 100 ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <CircularProgressbar
                                            value={uploadProgress[index] || 0}
                                            text={`${uploadProgress[index] || 0}%`}
                                            styles={buildStyles({
                                                textSize: '24px',
                                                pathColor: '#4caf50',
                                                textColor: '#fff',
                                                trailColor: '#d6d6d6',
                                            })}
                                            />
                                        </div>
                                        ) : (
                                        // เมื่ออัปโหลดเสร็จแสดงรูปแทน
                                        item.type === 'image' ? (
                                            <Image
                                                src={item.url}
                                                alt="Preview"
                                                width={40}
                                                height={40}
                                                className="rounded-lg object-cover"
                                                style={{ width: 'auto', height: '50px' }}
                                            />
                                        ) : (
                                            <div className="relative">
                                                <video width="50" height="50" controls>
                                                    <source src={item.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-3xl" />
                                            </div>
                                        )
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {link && linkPreview && (
                        <div className="relative flex-col p-2 border-2 rounded-xl">
                            <div className="flex flex-row w-full">
                                <div className="relative flex-col">
                                    <Image
                                        src={linkPreview.hybridGraph.imageSecureUrl}
                                        alt="Thumbnail"
                                        width={50}
                                        height={50}
                                        className="rounded-lg object-cover"
                                        style={{ width: '150px', height: '50px' }}
                                    />
                                </div>
                                <div className="flex flex-col w-full ml-2">
                                    <Link href={linkPreview.hybridGraph.url} target="_blank" className="text-xs cursor-pointer">
                                        <span className="font-bold text-xs">{linkPreview.hybridGraph.title}</span>
                                    </Link>
                                    <span className="text-xs line-clamp-2">{linkPreview.hybridGraph.description}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col w-full mb-5">
                <Divider />
                <button
                    onClick={handleUploadClick}
                    className="flex flex-row items-center gap-2 p-2 cursor-pointer"
                >
                    <ImFilePicture className="text-xl text-[#0056FF]" />
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-bold">อัพโหลดรูปภาพ/วิดีโอ</span>
                        <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                    </div>
                </button>

                {/* ซ่อน input file แต่ใช้ ref เพื่อให้มันทำงานเมื่อกดปุ่ม */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple // สามารถเลือกหลายไฟล์ได้
                        accept="image/*,video/*" // จำกัดชนิดของไฟล์
                        onChange={handleFileChange} // ดักการเปลี่ยนแปลงของไฟล์ที่เลือก
                        style={{ display: 'none' }} // ซ่อน input file
                    />
                <Divider />
                <div className="flex flex-row items-center gap-2 p-2 cursor-pointer"
                    onClick={handleOpenModal}
                >
                    <FaUserPlus className="text-xl text-[#0056FF]" />
                    <span className="text-sm font-bold">แท็กผู้คน</span>
                </div>
                <Divider />
            </div>

            <div>
                <button
                    className="w-full py-2 bg-[#0056FF] text-white rounded-lg mt-2"
                    onClick={handleSubmitComment}
                >
                    ส่ง
                </button>
            </div>

            {/* Modal */}
            <TagUsers isOpen={isOpen} handleCloseModal={handleCloseModal} setSelectedUser={setSelectedUser} />
        </div>
    );
};

export default PostInput;
