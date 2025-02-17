import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Divider } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegFile } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import { firebaseUploadFile } from "@/lib/firebaseUploadFile";
import { useDropzone } from 'react-dropzone';
import { LinearProgress } from "@mui/material";

export default function MediaForm({ onClose, userId, mutate }) {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [totalProgress, setTotalProgress] = useState(0);

    const fileInputRef = useRef(null);

    const onDrop = async (acceptedFiles) => {
        handleFileUpload(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // รีเซ็ตค่า input ก่อนเปิด file browser
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (fileArray) => {
        setUploadProgress(true);
        let totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
        let totalUploaded = 0;

        const uploadPromises = fileArray.map(async (file) => {
            const uploadedFile = await firebaseUploadFile(file, 'files', (progress) => {
                totalUploaded += (file.size * progress / 100);
                setTotalProgress((totalUploaded / totalSize) * 100);
            });

            if (uploadedFile) {
                const fileType = uploadedFile.file_name.split('.').pop();
                const type = ['xlsx', 'xls'].includes(fileType) ? 'excel' :
                             ['docx', 'doc'].includes(fileType) ? 'word' :
                             ['pptx', 'ppt'].includes(fileType) ? 'powerpoint' :
                             fileType === 'pdf' ? 'pdf' : 'files';

                const uploadData = {
                    public_id: uploadedFile.file_id,
                    url: uploadedFile.url,
                    file_name: uploadedFile.file_name,
                    mime_type: uploadedFile.mime_type,
                    file_size: uploadedFile.file_size,
                    type,
                    folder: 'files',
                    userId,
                };

                await axios.post('/api/upload/save', uploadData);
            }

            return uploadedFile;
        });

        const uploadedMedia = await Promise.all(uploadPromises);
        setFiles(uploadedMedia);
        setUploadProgress(false);
        mutate();
    };

    const handleClose = () => {
        setFiles([]);
        setTotalProgress(0);
        onClose();
    };

    return (
        <div className="flex flex-col w-[500px]">
           <div className="flex flex-row items-center justify-between w-full">
               <span className="text-xl font-bold text-[#0056FF]">อัพโหลดไฟล์</span>
               <IoClose size={25} onClick={handleClose} />
           </div>
           <div {...getRootProps()} 
            className={`flex flex-col justify-center p-2 w-full h-[300px]
            ${isDragActive ? 'border-2 border-dashed border-gray-200 bg-[#F5F5F5]' : 'bg-white'}
            `}>
                <span>ลากและวางไฟล์ หรือ เลือกไฟล์</span>
                <div className="flex flex-row items-center justify-center border-2 border-dashed mt-2 gap-2 w-full h-20">
                    <input {...getInputProps()} />
                    <HiUpload size={40} />
                    {isDragActive ? (
                        <span>วางไฟล์ที่นี่</span>
                    ) : (
                        <>
                        <span>วางไฟล์ที่นี่ หรือ</span>
                        <span className="text-[#0056FF] font-bold cursor-pointer" onClick={handleUploadClick}>เลือกไฟล์</span>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(Array.from(e.target.files))} multiple style={{ display: "none" }} />
                        </>
                    )}
                </div>
           </div>
           <LinearProgress variant="determinate" value={totalProgress} />
           <Divider className="my-2"/>
           <div className="flex flex-row items-center justify-end gap-4 w-full">
                <button
                    className="bg-[#0056FF] text-white font-bold p-2 rounded-xl"
                    onClick={handleClose}
                    disabled={uploadProgress? true : false}
                >
                    {uploadProgress ? 'กําลังอัปโหลด...' : 'ตกลง'}
                </button>
           </div>
        </div>
    );
}