// CommentInput.js
import React, { useState, useEffect } from "react";
import { ImFilePicture } from "react-icons/im";
import { FaUserPlus } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { LuFileSpreadsheet } from "react-icons/lu";
import Image from "next/image";
import Divider from '@mui/material/Divider';
import TagUsers from "./TagUsers";
import expandUrl from '@/utils/expandUrl';
import fetchLinkPreview from '@/utils/fetchLinkPreview';
import axios from 'axios';
import Link from "next/link";

const PostInput = ({ handleSubmit, userId }) => {
    const [post, setPost] = useState("");
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [files, setFiles] = useState(null); // สำหรับการอัพโหลดเอกสารครั้งละ 1 ไฟล์
    const [link, setLink] = useState("");
    const [linkPreview, setLinkPreview] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now());
    const [selectedUsers, setSelectedUser] = useState([]);
    const [isOpen, setIsOpen] = useState(false);


    const generateUniqueKey = (file) => {
        return `${file.name}-${file.lastModified}`;
    };

    const handleMediaUpdate = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        const newImages = uploadedFiles.filter(file => file.type.startsWith('image/'));
        const newVideos = uploadedFiles.filter(file => file.type.startsWith('video/'));
        setImages(prevImages => [...prevImages, ...newImages]);
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setInputKey(Date.now());
    };

    const handleFileUpdate = (event) => {
        const uploadedFile = event.target.files[0];
        setFiles(uploadedFile);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const handleRemoveVideo = (index) => {
        const updatedVideos = videos.filter((_, i) => i !== index);
        setVideos(updatedVideos);
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
    }, [images, videos, files]);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const uploadToCloudinary = async (file, type) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

        try {
            const resp = await axios.post("https://api.cloudinary.com/v1_1/dxshvbc9c/image/upload", data);
            await axios.post('/api/media/add', {
                url: resp.data.secure_url,
                publicId: resp.data.public_id,
                name: file.name,
                userId: userId,
                type: type,
                path: 'Experience/Post',
                isTemplate: false,
            });
            return { url: resp.data.secure_url, public_id: resp.data.public_id };
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleSubmitComment = async () => {
        const uploadedImages = await Promise.all(images.map(image => uploadToCloudinary(image, 'image')));
        const uploadedVideos = await Promise.all(videos.map(video => uploadToCloudinary(video, 'video')));
        const uploadedFile = files ? await uploadToCloudinary(files, 'file') : null;

        const newPost = {
            post: post.replace(link, "").trim(),
            images: uploadedImages,
            videos: uploadedVideos,
            files: uploadedFile,
            link,
            selectedUsers,
        };

        setPost("");
        setLink("");
        setImages([]);
        setVideos([]);
        setFiles(null);
        setSelectedUser([]);
        handleSubmit(newPost);
    };

    const handlePostChange = async (event) => {
        const inputValue = event.target.value;
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
            <div>
                <div className="flex flex-row gap-2">
                    {selectedUsers.length > 0 ? (
                        <span className="text-xs font-bold">แท็กผู้คน</span>
                    ): null}

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
                    placeholder="แสดงความคิดเห็น"
                    onChange={handlePostChange}
                />
                {/* Previews */}
                <div className="flex flex-col gap-2 mt-2 mb-2">
                    <div className="flex flex-row items-center w-full">
                    {images.length > 0 && images.map((image, index) => (
                        <div key={generateUniqueKey(image)} className="flex gap-2 ml-2">
                            <div className="relative flex flex-col p-2 border-2 rounded-xl">
                                <IoIosCloseCircle
                                    className="absolute top-0 right-0 text-xl cursor-pointer"
                                    onClick={() => handleRemoveImage(index)}
                                />
                                <Image
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    width={40}
                                    height={40}
                                    className="rounded-lg object-cover"
                                    style={{ width: 'auto', height: '50px' }}
                                />
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className="flex flex-row w-full">
                    {videos.length > 0 && videos.map((video, index) => (
                        <div key={generateUniqueKey(video)} className="flex">
                            <div className="relative flex-col p-2 border-2 rounded-xl">
                                <IoIosCloseCircle
                                    className="absolute top-0 right-0 text-xl cursor-pointer"
                                    onClick={() => handleRemoveVideo(index)}
                                />
                                <video width="50" height="50" controls>
                                    <source src={URL.createObjectURL(video)} type={video.type} />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className="flex flex-row w-full">
                    {files && (
                        <div key={generateUniqueKey(files)} className="relative flex-col p-2 border-2 rounded-xl">
                            <IoIosCloseCircle
                                className="absolute top-0 right-0 text-xl cursor-pointer"
                                onClick={handleRemoveFile}
                            />
                            <span>{files.name}</span>
                        </div>
                    )}
                    </div>
                    <div className="flex w-full">
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
            </div>
            <div className="flex flex-col w-full mb-5">
                <Divider />
                <input
                    type="file"
                    name="medias"
                    id="medias"
                    onChange={handleMediaUpdate}
                    className="hidden"
                    multiple
                    key={inputKey}
                />
                <label htmlFor="medias">
                    <div className="flex flex-row items-center gap-2 p-2 cursor-pointer">
                        <ImFilePicture className="text-xl text-[#0056FF]" />
                        <span>อัพโหลดรูปภาพ/วิดีโอ</span>
                    </div>
                </label>
                <Divider />
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleFileUpdate}
                    className="hidden"
                    key={inputKey}
                />
                <label htmlFor="file">
                    <div className="flex flex-row items-center gap-2 p-2 cursor-pointer">
                        <LuFileSpreadsheet className="text-xl text-[#0056FF]" />
                        <span>อัพโหลดเอกสาร</span>
                    </div>
                </label>
                <Divider />
                <div className="flex flex-row items-center gap-2 p-2 cursor-pointer"
                    onClick={handleOpenModal}
                >
                    <FaUserPlus className="text-xl text-[#0056FF]" />
                    <span>แท็กผู้คน</span>
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
