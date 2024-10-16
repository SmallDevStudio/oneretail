import { useState, useEffect, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { nanoid } from "nanoid";
import axios from "axios";
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

const Ads = () => {
    const [name, setName] = useState("");
    const [media, setMedia] = useState([]);
    const [url, setUrl] = useState("");
    const [position, setPosition] = useState("");
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด
    const [open, setOpen] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;


    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
    };

    const handleFileChange = async (e) => {
        setIsUploading(true); // เริ่มการอัปโหลด
        const fileArray = Array.from(e.target.files); // แปลง FileList เป็น array

        console.log(fileArray);

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
              folder: 'ads', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
            };
      
            // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
            await axios.post('/api/upload/save', mediaEntry);
      
            return mediaEntry;
          });
      
          // รอการอัปโหลดทั้งหมดเสร็จสิ้น
          const uploadedMedia = await Promise.all(uploadPromises);
      
          // เพิ่มไฟล์ที่อัปโหลดทั้งหมดใน state media
          setMedia((prevMedia) => [...prevMedia, ...uploadedMedia]);
      
          setIsUploading(false);    
          // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการอัปโหลดเสร็จ
          fileInputRef.current.value = '';
        
        
    };

    const handleRemoveMedia = async (index) => {
        const url = media[index].url;
        const publicId = media[index].public_id;

        try {
          // ส่งคำขอ DELETE ไปยัง API
          await axios.delete(`/api/blob/delete?url=${url}`);

          await axios.post(`/api/libraries?publicId=${publicId}`);
      
          // ลบรายการใน state หลังจากที่ลบสำเร็จ
          const updatedMedia = media.filter((_, i) => i !== index);
          setMedia(updatedMedia);
        } catch (error) {
          console.error('Error removing media:', error);
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAds = {
            name,
            media,
            url,
            position,
            userId
        };

        console.log(newAds);

        try {
            const response = await axios.post("/api/ads", newAds);
            if (response.status === 201) {
                setName("");
                setMedia([]);
                setUrl("");
                setPosition("");
                setOpen(false);
            } else {
                console.error("Error adding ads:", response.data.message);
                Swal.fire("Error", "เพิ่ม ADS ไม่สำเร็จ", "error");
            }
            
        } catch (error) {
            console.error("Error adding ads:", error);
        }
    }

    const handleCancel = async (e) => {
        e.preventDefault();
        setName("");
        setMedia([]);
        setUrl("");
        setPosition("");
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Header
                title="ADS"
                subtitle="จัดการ ADS"
            />
            
            {/* AdsTable */}
            <div>
                <div>
                    <button
                        onClick={handleOpen}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        เพิ่ม ADS
                    </button>
                </div>
            </div>

            {/* AdsForm */}
            {open && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    title="เพิ่ม ADS"
                >
                    <div>
                        <div className="flex flex-row items-center gap-2 mb-2">
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
                                    {Array.isArray(media) && media.length > 0 && media.map((item, index) => (
                                        <div key={index} className="flex gap-2 ml-2">
                                            <div className="relative flex flex-col p-2 border-2 rounded-xl">
                                                {isUploading ? (
                                                    <div className="flex justify-center">
                                                        <CircularProgress />
                                                    </div>
                                                    ) : (
                                                        <>
                                                        <IoIosCloseCircle
                                                            className="absolute top-0 right-0 text-xl cursor-pointer"
                                                            onClick={() => handleRemoveMedia(index)}
                                                        />
                                                        {item.type === 'image' ? (
                                                            <Image
                                                                src={item.url}
                                                                alt="Thumbnail"
                                                                width={200}
                                                                height={200}
                                                                className="rounded-lg object-cover"
                                                                style={{ width: '150px', height: 'auto' }}
                                                            />
                                                        ) : (
                                                            <video
                                                                src={item.url}
                                                                className="rounded-lg object-cover"
                                                                style={{ width: '150px', height: 'auto' }}
                                                            />
                                                        )}
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
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
                                    multiple // สามารถเลือกหลายไฟล์ได้
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
                                บันทึก
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