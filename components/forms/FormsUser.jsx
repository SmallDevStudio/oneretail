import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { upload } from "@vercel/blob/client";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { ImFilePicture } from "react-icons/im";
import { FaCirclePlus } from "react-icons/fa6";
import { Divider } from "@mui/material";
import tagify from "@yaireo/tagify";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function FormsUser() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [youtube, setYoutube] = useState(null);
    const [image, setImage] = useState({});
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด
    const [fieldIndex, setFieldIndex] = useState(0);
    const [fields, setFields] = useState([{
        title: "",
        description: "",
        type: "",
        options: ["", "", "", ""],
    }]);
    const [showOptionField, setShowOptionField] = useState(false);
    const [teamGrop, setTeamGrop] = useState("");
    const [group, setGroup] = useState([]);
    const [openPermissions, setOpenPermissions] = useState(false);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const fileInputRef = useRef(null);
    
    const handleUploadClick = () => {
        fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
    };

    const handleFileChange = async (e) => {
        setIsUploading(true); // เริ่มการอัปโหลด
        const file = e.target.files;

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
            folder: 'ads', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
        };
      
            // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
        await axios.post('/api/upload/save', mediaEntry);
      
        const imageData = {
            public_id: mediaEntry.public_id,
            url: mediaEntry.url,
            type: mediaEntry.type,
        }
        setImage(imageData);
      
        setIsUploading(false);    
        // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการอัปโหลดเสร็จ
        fileInputRef.current.value = '';
    };

    const handleFieldChange = (e, fieldIndex) => {
        const { name, value } = e.target;
        const newFields = [...fields];
        newFields[fieldIndex][name] = value;
        setFields(newFields);

        if (name === "type" && value === "option") {
            setShowOptionField(true);
        } else {
            setShowOptionField(false);
        }
    };

    const handleAddField = () => {
        setFieldIndex((prevIndex) => prevIndex + 1);
        setFields([...fields, { title: "", description: "", type: "", options: ["", "", "", ""] }]);
    };

    const handleOptionChange = (index, value, fieldIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].options[index] = value;
        setFields(newFields);
    };

    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
        setFieldIndex((prevIndex) => prevIndex - 1);
    };

    const handleSubmit = async () => {
        const data = {
            title,
            description,
            youtubeLink,
            image,
            fields,
            userId,
        };
        try {
            const response = await axios.post('/api/forms', data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }

        handleCancel();
    }

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setYoutubeLink("");
        setYoutube(null);
        setImage(null);
        setFields([{ title: "", description: "", type: "", options: ["", "", "", ""] }]);
        setShowOptionField(false);
        setFieldIndex(0);
    };

    const handleGroupChange = (e) => {
        const newGroup = [...group, e.target.value];
        setGroup(newGroup);
    };

    return (
        <div className="flex flex-col overflow-y-auto">
            <div className="flex flex-col gap-2"> 
                <div className="flex flex-col gap-2 p-2 mt-2">
                    <input
                        type="text"
                        placeholder="ชื่อฟอร์ม"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-bold text-gray-700 w-1/2 px-2 py-1"
                    />

                    <textarea
                        placeholder="รายละเอียดฟอร์ม"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-sm font-light text-gray-600 w-1/2 px-2 py-1"
                        rows={2}
                    />

                    <div>
                        {/* Youtube Link */}
                        <div className="flex flex-row gap-2">
                            <input
                                type="text"
                                placeholder="ลิงค์ Youtube"
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                className="border border-gray-300 rounded-md text-sm font-light text-gray-600 w-1/5 px-2 py-1"
                            />
                            <button
                                className="bg-red-600 text-white font-bold rounded-md px-2 py-1"
                            >
                               Get
                            </button>
                        </div>
                        {/* Image */}
                        <div className="flex flex-row gap-2 mt-2">
                            {/* Upload Image */}
                            <div>
                                <button
                                onClick={handleUploadClick}
                                className="flex flex-row items-center gap-2 p-2 cursor-pointer border-2 rounded-xl"
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
                                    accept="image/*" // จำกัดชนิดของไฟล์
                                    onChange={handleFileChange} // ดักการเปลี่ยนแปลงของไฟล์ที่เลือก
                                    style={{ display: 'none' }} // ซ่อน input file
                                />
                            </div>
                        </div>

                        {openPermissions && (
                            <div className="flex flex-row gap-2 mt-2">
                                <div className="flex flex-row items-center gap-2 mt-2">
                                    <label htmlFor="teamGrop" className="text-sm font-bold">TeamGrop:</label>
                                    <input
                                        type="text"
                                        id="teamGrop"
                                        value={teamGrop}
                                        onChange={(e) => setTeamGrop(e)}
                                        className="border border-gray-300 rounded-md text-sm font-light text-gray-600 px-2 py-1"
                                    />
                                </div>

                                <div className="flex flex-row items-center gap-2 mt-2">
                                    <label htmlFor="group" className="text-sm font-bold">Group:</label>
                                    <input
                                        type="text"
                                        id="group"
                                        value={group}
                                        onChange={(e) => handleGroupChange(e)}
                                        className="border border-gray-300 rounded-md text-sm font-light text-gray-600 px-2 py-1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Divider 
                    className="my-2"
                    textAlign="left"
                >
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-xl font-bold text-[#0056FF]">
                            Field
                        </span>
                        <FaCirclePlus 
                            onClick={() => handleAddField()}
                        />
                    </div>
                </Divider>
            </div>

            {/* Fields */}
            {fields.map((field, index) => (
                <div key={index} className="flex flex-col border border-gray-200 gap-2 mt-1 p-2 rounded-lg">
                <div className="flex flex-row items-center gap-2">
                    <label className="text-sm font-bold">ชื่อ Field:<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        placeholder="ชื่อ Field"
                        value={fields[index]?.title}
                        onChange={(e) => handleFieldChange(e, index)}
                        className="text-sm font-light text-gray-600 w-1/2 px-2 py-1 border-2 rounded-xl"
                        />
                    </div>

                <div className="flex flex-row gap-2">
                    <label className="text-sm font-bold">รายละเอียด Field:</label>
                    <textarea
                        name="description"
                        placeholder="รายละเอียด Field"
                        value={fields[index]?.description}
                        onChange={(e) => handleFieldChange(e, index)}
                        className="text-sm font-light text-gray-600 w-1/2 px-2 py-1 border-2 rounded-xl"
                        rows={2}
                    />
                </div>

                <div className="flex flex-row items-center gap-2">
                    <label className="text-sm font-bold">ประเภท Field:</label>
                    <select
                        name="type"
                        className="text-sm font-light text-gray-600 w-36 px-2 py-1 border-2 rounded-xl"
                        value={fields[index]?.type}
                        onChange={(e) => handleFieldChange(e, index)}
                    >
                        <option value="">กรุณาเลือก</option>
                        <option value="text">Text</option>
                        <option value="option">Option</option>
                    </select>
                </div>

                {showOptionField && (
                    <div className="flex flex-row gap-2">
                        {fields[index].options?.map((option, Optionindex) => (
                            <input
                                key={Optionindex}
                                type="text"
                                name="option"
                                placeholder={`ตัวเลือก ${Optionindex + 1}`}
                                className="text-sm font-light text-gray-600 w-1/2 px-2 py-1 border-2 rounded-xl"
                                value={option}
                                onChange={(e) => handleOptionChange(Optionindex, e.target.value, index)}
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleRemoveField(index)}
                        className="text-sm font-bold bg-red-500 text-white px-2 py-1 rounded-xl"
                    >
                        ลบ Field
                    </button>
                </div>
            </div>
            ))}
            <div className="flex justify-center gap-2 mt-2">
                <button
                    onClick={handleSubmit}
                    className="text-sm font-bold bg-[#0056FF] text-white px-2 py-1 rounded-xl"
                >
                    บันทึก
                </button>
                <button
                    onClick={handleCancel}
                    className="text-sm font-bold bg-red-500 text-white px-2 py-1 rounded-xl"
                >
                    ยกเลิก
                </button>
            </div>
        </div>
    );
};