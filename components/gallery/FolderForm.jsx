import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { Divider } from "@mui/material";

export default function FolderForm({  mutate, onClose, isSubFolder, folder }) {
    const [folderForm, setFolderForm] = useState({ title: "", description: "", googleDriveUrl: "", keywords: [] });

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
    }, [status]);

    const handleKeywordChange = (e) => {
        if (e.key === " " && e.target.value.trim()) {
            e.preventDefault();
            const keyword = e.target.value.trim();
            if (!folderForm.keywords.includes(keyword)) {
                setFolderForm((prev) => ({ ...prev, keywords: [...prev.keywords, keyword] }));
            }
            e.target.value = "";
        }
    };

    const handleRemoveKeyword = (keyword) => {
        setFolderForm((prev) => ({
            ...prev,
            keywords: prev.keywords.filter((k) => k !== keyword),
        }));
    };

    const handleSubmitFolder = async () => {
        if ( folderForm.title === "" ) {
            toast.error("กรุณากรอกชื่อโฟลเดอร์");
            return
        }

        if (isSubFolder) {
            try {
                await axios.put(`/api/gallery/${folder._id}`, { 
                    subfolder: folderForm
                });
                toast.success("เพิ่มซับโฟลเดอร์สําเร็จ");
                mutate();
                setFolderForm({ title: "", description: "", googleDriveUrl: "", keywords: [] });
                handleClose();
            } catch (error) {
                toast.error("เพิ่มซับโฟลเดอร์ไม่สำเร็จ");
                console.error(error);
            }
        } else {
            const data = {
                ...folderForm,
                creator: session.user.id,
            }

            try {
                await axios.post("/api/gallery", data);
                toast.success("เพิ่มโฟลเดอร์สําเร็จ");
                mutate();
                setFolderForm({ title: "", description: "", googleDriveUrl: "", keywords: [] });
                handleClose();
            } catch (error) {
                toast.error("เพิ่มโฟลเดอร์ไม่สำเร็จ");
                console.error(error);
            }
        }
    };

    const handleClose = () => {
        setFolderForm({ title: "", description: "", googleDriveUrl: "", keywords: [] });
        onClose();
    }

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl font-bold">{isSubFolder ? 'เพิ่มซับโฟลเดอร์' : 'เพิ่มโฟลเดอร์'}</h1>
            <Divider className="my-2"/>
            <div className="flex flex-col gap-2 text-sm w-full">
                <div className="w-full">
                    <label className="font-bold">{isSubFolder ? 'ชื่อซับโฟลเดอร์' : 'ชื่อโฟลเดอร์'}</label>
                    <input 
                        type="text"
                        name="title"
                        className="w-full border border-gray-200 rounded-md p-2"
                        placeholder="ชื่อโฟลเดอร์"
                        onChange={(e) => setFolderForm({...folderForm, title: e.target.value})}
                        value={folderForm?.title}
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="font-bold">รายละเอียด</label>
                    <textarea 
                        type="text"
                        name="description"
                        className="w-full border border-gray-200 rounded-md p-2"
                        rows={3}
                        placeholder="รายละเอียด"
                        onChange={(e) => setFolderForm({...folderForm, description: e.target.value})}
                        value={folderForm?.description}
                    />
                </div>
                <div className="w-full">
                    <label className="font-bold">GoogleDriveUrl</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-md p-2"
                        onChange={(e) => setFolderForm({...folderForm, googleDriveUrl: e.target.value})}
                        value={folderForm?.googleDriveUrl}
                    />
                </div>
                <div className="w-full">
                    <label className="font-bold">Keyword</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-md p-2"
                        onKeyDown={handleKeywordChange}
                    />
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                    {folderForm.keywords.map((tag, index) => (
                        <div 
                            key={index} 
                            className="flex flex-row items-center gap-2 bg-[#0056FF] text-white px-2 py-0.5 rounded-full"
                        >
                            <span>#{tag}</span>
                            <IoClose 
                                className="text-[#F2871F] cursor-pointer"
                                onClick={() => handleRemoveKeyword(tag)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-4 mt-4 w-full">
                <button
                    className="bg-[#0056FF] text-white py-2 px-4 rounded-md"
                    onClick={handleSubmitFolder}
                >
                    บันทึก
                </button>
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                    onClick={handleClose}
                >
                    ยกเลิก
                </button>
            </div>
        </div>
    );
}