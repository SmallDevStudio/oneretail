import React, { useState, useEffect } from "react";
import { ImFilePicture } from "react-icons/im";
import { FaUserPlus, FaRegPlayCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Image from "next/image";
import Divider from '@mui/material/Divider';
import TagUsers from "./TagUsers";
import fetchLinkPreview from '@/utils/fetchLinkPreview';
import Link from "next/link";

const PostInput = ({ handleSubmit, userId }) => {
    const [post, setPost] = useState("");
    const [media, setMedia] = useState([]);
    const [files, setFiles] = useState(null); // สำหรับการอัพโหลดเอกสารครั้งละ 1 ไฟล์
    const [link, setLink] = useState("");
    const [linkPreview, setLinkPreview] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now());
    const [selectedUsers, setSelectedUser] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUploadClick = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                sources: ['local', 'url', 'camera', 'image_search'],
                multiple: true,
                resourceType: 'auto', // Automatically determines if it's image or video
            },
            (error, result) => {
                if (result.event === 'success') {
                    setMedia(prevMedia => [
                        ...prevMedia,
                        { url: result.info.secure_url, public_id: result.info.public_id, type: result.info.resource_type }
                    ]);
                }
            }
        );
    };

    const handleRemoveMedia = (index) => {
        const updatedMedia = media.filter((_, i) => i !== index);
        setMedia(updatedMedia);
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
        setIsLoading(true);
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
        setIsLoading(false);
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
                    placeholder="แสดงความคิดเห็น"
                    onChange={handlePostChange}
                />
                <div className="flex flex-col gap-2 mt-2 mb-2">
                    <div className="flex flex-row items-center w-full">
                        {media.map((item, index) => (
                            <div key={index} className="flex gap-2 ml-2">
                                <div className="relative flex flex-col p-2 border-2 rounded-xl">
                                    <IoIosCloseCircle
                                        className="absolute top-0 right-0 text-xl cursor-pointer"
                                        onClick={() => handleRemoveMedia(index)}
                                    />
                                    {item.type === 'image' ? (
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
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {files && (
                        <div key={files.name} className="relative flex-col p-2 border-2 rounded-xl">
                            <IoIosCloseCircle
                                className="absolute top-0 right-0 text-xl cursor-pointer"
                                onClick={handleRemoveFile}
                            />
                            <span>{files.name}</span>
                        </div>
                    )}
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
                    <span>อัพโหลดรูปภาพ/วิดีโอ</span>
                </button>
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
