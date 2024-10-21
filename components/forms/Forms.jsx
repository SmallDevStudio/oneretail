import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { upload } from "@vercel/blob/client";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image"; 
import { useSession } from "next-auth/react";
import { ImFilePicture } from "react-icons/im";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { Divider } from "@mui/material";
import tagify from "@yaireo/tagify";
import Loading from "../Loading";
import CircularProgress from "@mui/material";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Forms({ form, isEdit, onEditForm, onclose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [youtube, setYoutube] = useState(null);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด
    const [fieldIndex, setFieldIndex] = useState(0);
    const [fields, setFields] = useState([{
        title: "",
        description: "",
        image: null,
        type: "",
        options: ["", "", "", ""],
        vote: [],
    }]);
    const [showOptionField, setShowOptionField] = useState(false);
    const [teamGrop, setTeamGrop] = useState("");
    const [group, setGroup] = useState([]);
    const [openPermissions, setOpenPermissions] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    console.log('Image:', image);

    useEffect(() => {
        if (isEdit && form) {
            setTitle(form.title);
            setDescription(form.description? form.description : "");
            setYoutubeLink(form.youtube?.url? form.youtube?.url : "");
            setYoutube(form.youtube? form.youtube : null);
            setImage(form.image? form.image : null);
            setFields(form.fields);
            setTeamGrop(form.teamGrop? form.teamGrop : "");
            setGroup(form.group? form.group : []);
            setShowOptionField(true);
        } else {
            setTitle("");
            setDescription("");
            setYoutubeLink("");
            setYoutube(null);
            setImage(null);
            setFields([{ title: "", description: "", type: "", options: ["", "", "", ""] }]);
            setTeamGrop("");
            setGroup([]);
        }
    }, [isEdit, form]);

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
    };

    const handleFileChange = async (e) => {
        setIsUploading(true); // เริ่มการอัปโหลด
        const file = e.target.files;

        console.log('file:', file);

        const newBlob = await upload(file[0].name, file[0], {
            access: 'public',
            handleUploadUrl: '/api/blob/upload',
        });
      
        const mediaEntry = {
            url: newBlob.url,
            public_id: nanoid(10),
            file_name: file[0].name,
            mime_type: file[0].type,
            file_size: file[0].size,
            type: file[0].type.startsWith('image') ? 'image' : 'video',
            userId, // เชื่อมโยงกับ userId ของผู้ใช้
            folder: 'forms', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
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
        setFields([...fields, { title: "", description: "", image: null, type: "", options: ["", "", "", ""], vote: [] }]);
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
        setLoading(true);
        if (isEdit) {
            
            const data = {
                title,
                description: description? description : '',
                youtube: youtube? youtube : null,
                image: image? image : null,
                fields,
                teamGrop: teamGrop? teamGrop : '',
                group: group? group : [],
                status: form?.status,
                userId: form?.userId,
            };
            
            try {
                const response = await axios.put(`/api/forms/${form._id}`, data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }

            setLoading(false);
            onEditForm();
            handleCancel();

        }else{
            const data = {
                title,
                description,
                youtube,
                image,
                fields,
                teamGrop,
                group,
                userId,
            };
            console.log(data);
            try {
                const response = await axios.post('/api/forms', data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
            handleCancel();
        }
    }

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setYoutubeLink("");
        setYoutube(null);
        setImage(null);
        setFields([...fields, { title: "", description: "", image: null, type: "", options: ["", "", "", ""], vote: [] }]);
        setShowOptionField(false);
        setFieldIndex(0);
        setTeamGrop("");
        setGroup([]);
        setOpenPermissions(false);
        onclose();
    };

    const handleGroupChange = (e) => {
        const newGroup = [...group, e.target.value];
        setGroup(newGroup);
    };

    const handleYoutube = async (link) => {
        console.log('link:', link);
        setYoutubeLink(link);

        try {
            const response = await axios.post('/api/getyoutube', { youtubeUrl: link });
            const video = response.data;
            const youtubeData = {
                slug: video.videoId,
                title: video.title,
                description: video.description,
                thumbnailUrl: video.thumbnailUrl,
                url: video.videoUrl
            }
            setYoutube(youtubeData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveYoutube = () => {
        setYoutube(null);
        setYoutubeLink("");
    }

    const handleRemoveImage = async () => {
        try {
            // ส่งคำขอ DELETE ไปยัง API
          await axios.delete(`/api/blob/delete?url=${image?.url}`);
          await axios.delete(`/api/libraries/delete?public_id=${image?.public_id}`);

          // ลบรายการใน state หลังจากที่ลบสำเร็จ
          setImage(null);
        } catch (error) {
          console.error('Error removing image:', error);
        }
    }


    if (loading) return <Loading />;

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
                        <div className="flex flex-col gap-2">
                            {youtube && (
                                <div className="relative border-2 rounded-lg w-[120px] p-2.5">
                                    <IoIosCloseCircle 
                                        className="relative top-0 left-20 cursor-pointer text-red-500"
                                        onClick={handleRemoveYoutube}
                                    />
                                    <Image
                                        src={youtube.thumbnailUrl}
                                        alt="Youtube Thumbnail"
                                        width={100}
                                        height={100}
                                        className="rounded-md"
                                    />
                                </div>
                            )}
                        
                            <input
                                type="text"
                                placeholder="ลิงค์ Youtube"
                                value={youtubeLink}
                                onChange={(e) => handleYoutube(e.target.value)}
                                className="border border-gray-300 rounded-md text-sm font-light text-gray-600 w-1/5 px-2 py-1"
                            />
                           
                        </div>
                        {/* Image */}
                        <div className="flex flex-col gap-2 mt-2">
                            <div>
                                {image && (
                                    <div className="relative border-2 rounded-lg w-[120px] p-2.5">
                                        {isUploading ? (
                                            <div className="flex justify-center items-center">
                                                <CircularProgress />
                                            </div>
                                        ) : (
                                            <>
                                                <IoIosCloseCircle 
                                                    className="relative top-0 left-20 cursor-pointer text-red-500"
                                                    onClick={handleRemoveImage}
                                                />
                                                <Image
                                                    src={image.url}
                                                    alt="Image Thumbnail"
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md"
                                                    style={{
                                                    height: "auto",
                                                    width: "100px",   
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
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
                    <span className="text-sm text-[#0056FF] font-bold">Field {index + 1}</span>
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

                {fields[index]?.type === "option" && showOptionField && (
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
                    {loading? '...โหลด' : isEdit ? "แก้ไข" : "เพิ่ม" }
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