import React, { useState, useEffect } from "react";
import { ImFilePicture } from "react-icons/im";
import { FaUserPlus } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { LuFileSpreadsheet } from "react-icons/lu";
import Image from "next/image";
import Divider from '@mui/material/Divider';
import TagUsers from "./TagUsers";

const CommentInput = ({ handleSubmit }) => {
    const [post, setPost] = useState("");
    const [link, setLink] = useState("");
    const [files, setFiles] = useState();
    const [medias, setMedias] = useState([]);
    const [inputKey, setInputKey] = useState(Date.now());
    const [selectedUsers, setSelectedUser] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    console.log('files', files);

    const handleMediaUpdate = (event) => {
        setMedias([...event.target.files]);
    };

    const handleFileUpdate = (event) => {
        setsetFiles([...event.target.files]);
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setMedias(updatedFiles);
    };

    useEffect(() => {
        setInputKey(Date.now()); // เปลี่ยน key ของ input file เมื่อ files เปลี่ยน
    }, [files]);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleSubmitComment = () => {
        const newPost = {
            post,
            files,
            selectedUsers,
        };

        setPost("");
        setFiles([]);
        setSelectedUser([]);
        handleSubmit(newPost);
    
    };

    return (
        <div>
            <div>
                <div className="flex flex-row gap-2">
                {selectedUsers.length > 0 && selectedUsers.map((user, index) => (
                    <div key={index} className="flex flex-row gap-2">
                        <span className="text-xs text-[#0056FF]">{user.fullname}</span>
                    </div>
                ))}
                </div>
                <textarea
                    className="w-full min-h-32 border-gray-300 rounded-lg outline-none"
                    value={post}
                    name="post"
                    placeholder="แสดงความคิดเห็น"
                    onChange={(e) => setPost(e.target.value)}
                />
                {/* Previews */}
                <div className="flex flex-row gap-2 mt-2 mb-2">
                    {files.length > 0 && Array.from(files).map((file, index) => (
                        <div key={index} className="relative">
                            <div className="relative flex-col p-2 border-2 rounded-xl">
                                <IoIosCloseCircle
                                    className="absolute top-0 right-0 text-xl cursor-pointer"
                                    onClick={() => handleRemoveFile(index)}
                                />
                                <Image
                                    src={URL.createObjectURL(file)}
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
            </div>
            <div className="flex flex-col w-full mb-5">
                <Divider />
                <input
                    type="file"
                    name="media"
                    id="media"
                    onChange={handleMediaUpdate}
                    className="hidden"
                    multiple
                    key={inputKey} // ใช้ key เพื่อรีเซ็ต input
                />
                <label htmlFor="file">
                    <div className="flex flex-row items-center gap-2 p-2 cursor-pointer">
                        <ImFilePicture className="text-xl text-[#0056FF]" />
                        <span>อัพโหลดรูปภาพ</span>
                    </div>
                </label>
                <Divider />
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleFileUpdate}
                    className="hidden"
                    multiple
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

export default CommentInput;
