import { useState, useEffect, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { nanoid } from "nanoid";
import axios from "axios";
import useSWR from "swr";
import Header from "@/components/admin/global/Header";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/themes";
import Modal from "@/components/Modal";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosCloseCircle } from "react-icons/io";
import { ImFilePicture } from "react-icons/im";
import Swal from "sweetalert2";
import { Divider } from "@mui/material";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Ads = () => {
    const [name, setName] = useState("");
    const [media, setMedia] = useState(null);
    const [url, setUrl] = useState("");
    const [position, setPosition] = useState("");
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด
    const [open, setOpen] = useState(false);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selected, setSelected] = useState(null);

    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data, error, mutate } = useSWR(`/api/ads`, fetcher);

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
            folder: 'ads', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
        };
      
            // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
        await axios.post('/api/upload/save', mediaEntry);
      
        const imageData = {
            public_id: mediaEntry.public_id,
            url: mediaEntry.url,
            type: mediaEntry.type,
        }
        setMedia(imageData);
      
        setIsUploading(false);    
        // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการอัปโหลดเสร็จ
        fileInputRef.current.value = '';
    };

    const handleRemoveMedia = async (media) => {
        const url = media.url;
        const publicId = media.public_id;

        try {
          // ส่งคำขอ DELETE ไปยัง API
          await axios.delete(`/api/blob/delete?url=${url}`);

          await axios.post(`/api/libraries?publicId=${publicId}`);
    
          setMedia(null);
        } catch (error) {
          console.error('Error removing media:', error);
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            await axios.put(`/api/ads/${selected._id}`, {
                name,
                media,
                url,
                position
            });
        } else {
            const newAds = {
                name,
                media,
                url,
                position,
                userId
            };
    
            try {
                const response = await axios.post("/api/ads", newAds);
                if (response.status === 201) {
                    setName("");
                    setMedia(null);
                    setUrl("");
                    setPosition("");
                    setOpen(false);
                    mutate();
                } else {
                    console.error("Error adding ads:", response.data.message);
                    Swal.fire("Error", "เพิ่ม ADS ไม่สำเร็จ", "error");
                }
                
            } catch (error) {
                console.error("Error adding ads:", error);
            }
        }
        mutate();
        handleCancel(e);
    }

    const handleActive = async (ads) => {
        const newActive = !ads.status;
        await axios.put(`/api/ads/${ads._id}`, { status: newActive });
        mutate();
    }

    const handleCancel = async (e) => {
        e.preventDefault();
        setIsEdit(false);
        setSelected(null);
        setName("");
        setMedia(null);
        setUrl("");
        setPosition("");
        setOpen(false);
    }

    const handleEdit = (ads) => {
        setIsEdit(true);
        setSelected(ads);
        setName(ads.name);
        setMedia(ads.media);
        setUrl(ads.url);
        setPosition(ads.position);
        setOpen(true);
    }

    const handleDelete = async (ads) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this post? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        })

        if (result.isConfirmed) {
            const url = ads.media.url;
            const publicId = ads.media.public_id;
            try {
                await axios.delete(`/api/blob/delete?url=${url}`);
                await axios.delete(`/api/libraries/delete?public_id=${publicId}`);
                const response = await axios.delete(`/api/ads/${ads._id}`);
                console.log(response.data);
                mutate();
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }


    const handleOpenPreview = (image) => {
        setSelectedPreview(image);
        setOpenPreview(true);
    }

    const handleClosePreview = () => {
        setOpenPreview(false);
    }

    return (
        <div>
            <Header
                title="ADS"
                subtitle="จัดการ ADS"
            />
            
            {/* AdsTable */}
            <div className="flex flex-col px-5 mt-4">
                <div>
                    <button
                        onClick={handleOpen}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        เพิ่ม ADS
                    </button>
                </div>
                <table className="table-auto w-full mt-5">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border-y px-4 py-2 w-20">ลําดับ</th>
                            <th className="border-y px-4 py-2 w-[30%]">ชื่อ</th>
                            <th className="border-y px-4 py-2 w-[100px]">รูป</th>
                            <th className="border-y px-4 py-2 w-[20%]">URL</th>
                            <th className="border-y px-4 py-2 w-32">ตําแหน่ง</th>
                            <th className="border-y px-4 py-2 w-32">Active</th>
                            <th className="border-y px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((item, index) => (
                            <tr key={index}>
                                <td className="border-y px-4 py-2 text-center">{index + 1}</td>
                                <td className="border-y px-4 py-2 text-center">{item.name}</td>
                                <td className="border-y px-4 py-2">
                                    <div className="flex justify-center items-center"
                                        onClick={() => handleOpenPreview(item.media.url)}
                                    >
                                        <Image
                                            src={item.media.url}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                </td>
                                <td className="border-y px-4 py-2 text-center">{item.url}</td>
                                <td className="border-y px-4 py-2 text-center">{item.position}</td>
                                <td className="border-y px-4 py-2 text-center">
                                    <button className={`font-bold text-white px-2 py-1 rounded-xl 
                                        ${item.status ? 'bg-green-500' : 'bg-red-500'}`}
                                        onClick={() => handleActive(item)}
                                    >
                                        {item.status ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="border-y px-4 py-2">
                                    <div className="flex justify-center items-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {openPreview && (
                    <Modal
                        open={openPreview}
                        onClose={handleClosePreview}
                        title="ดู Preview"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Image
                                src={selectedPreview}
                                alt={selectedPreview}
                                width={500}
                                height={500}
                                style={{
                                    width: "auto",
                                    height: "100%",
                                }}

                            />
                        </div>
                    </Modal>
                )}
            </div>

            {/* AdsForm */}
            {open && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    title="เพิ่ม ADS"
                >
                    <div>
                        <div>
                            <h1 className="text-xl text-[#0056FF] font-bold">
                                {isEdit ? "แก้ไข ADS" : "เพิ่ม ADS"}
                            </h1>
                        </div>
                        <Divider className="w-full mt-2"/>
                        <div className="flex flex-row items-center gap-2 mb-2 mt-4">
                            <label htmlFor="name" className="block font-bold text-gray-700">ชื่อ:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded-md px-2 py-1"
                                required
                            />
                        </div>

                        <div className="gap-2 mb-2">
                            {/* Preview Media */}
                            <div>
                                <div className="flex flex-row items-center w-full mb-2">
                                    {media && (
                                        <div className="flex gap-2 ml-2">
                                            <div className="relative flex flex-col p-2 border-2 rounded-xl">
                                                {isUploading ? (
                                                    <div className="flex justify-center">
                                                        <CircularProgress />
                                                    </div>
                                                    ) : (
                                                        <>
                                                        <IoIosCloseCircle
                                                            className="absolute top-0 right-0 text-xl cursor-pointer"
                                                            onClick={() => handleRemoveMedia(media)}
                                                        />
                                                        {media.type === 'image' ? (
                                                            <Image
                                                                src={media.url}
                                                                alt="Thumbnail"
                                                                width={200}
                                                                height={200}
                                                                className="rounded-lg object-cover"
                                                                style={{ width: '150px', height: 'auto' }}
                                                            />
                                                        ) : (
                                                            <video
                                                                src={media.url}
                                                                className="rounded-lg object-cover"
                                                                style={{ width: '150px', height: 'auto' }}
                                                            />
                                                        )}
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upload Media */}
                            <div>
                                <button
                                onClick={handleUploadClick}
                                className="flex flex-row items-center gap-2 p-2 cursor-pointer border-2 rounded-xl"
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
                                    accept="image/*,video/*" // จำกัดชนิดของไฟล์
                                    onChange={handleFileChange} // ดักการเปลี่ยนแปลงของไฟล์ที่เลือก
                                    style={{ display: 'none' }} // ซ่อน input file
                                />
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 mb-2">
                            <label htmlFor="url" className="block font-bold text-gray-700">link:</label>
                            <input
                                type="text"
                                name="url"
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="border rounded-md px-2 py-1"
                            />
                        </div>
                        
                        <div className="flex flex-row items-center gap-2 mb-2">
                            <label htmlFor="position" className="block font-bold text-gray-700">ตำแหน่ง:</label>
                            <select
                                id="position"
                                name="position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="border rounded-md px-2 py-1"
                            >
                                <option value="">กรุณาเลือก</option>
                                <option value="main">Main</option>
                                <option value="external">Externel</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-row items-center gap-2 mb-2">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="bg-[#0056FF] text-white px-4 py-2 rounded-md"
                            >
                                {isEdit ? 'แก้ไข' : 'เพิ่ม'}
                            </button>

                            <button
                                type="submit"
                                onClick={handleCancel}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </Modal>
                )}
        </div>
    );
};

export default Ads;

Ads.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Ads.auth = true;