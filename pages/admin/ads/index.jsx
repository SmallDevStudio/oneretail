import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "@/components/admin/global/Header";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/themes";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosCloseCircle } from "react-icons/io";
import { ImFilePicture } from "react-icons/im";

const Ads = () => {
    const [name, setName] = useState("");
    const [media, setMedia] = useState("");
    const [url, setUrl] = useState("");
    const [position, setPosition] = useState("");
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click(); // เมื่อกดปุ่ม ให้เปิด input file
    };

    const handleFileChange = async (e) => {
        setIsUploading(true); // เริ่มการอัปโหลด
        const fileArray = Array.from(e.target.files); // แปลง FileList เป็น array

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
    }

    const handleCancel = async (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <Header
                title="ADS"
                subtitle="จัดการ ADS"
            />
            
            {/* AdsTable */}
            <div></div>

            {/* AdsForm */}
            <div>
                <div>
                    <label htmlFor="name">ชื่อ:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                    />
                </div>

                <div>
                    {/* Preview Media */}
                    <div>
                        <div className="flex flex-row items-center w-full">
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
                                                        width={50}
                                                        height={50}
                                                        className="rounded-lg object-cover"
                                                        style={{ width: '150px', height: '50px' }}
                                                    />
                                                ) : (
                                                    <video
                                                        src={item.url}
                                                        className="rounded-lg object-cover"
                                                        style={{ width: '150px', height: '50px' }}
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
                    </div>
                </div>

                <div>
                    <label htmlFor="url">link:</label>
                    <input
                        type="text"
                        name="url"
                        id="url"
                    />
                </div>
                
                <div>
                    <label htmlFor="position">ตำแหน่ง:</label>
                    <select
                        id="position"
                        name="position"
                    >
                        <option value="">กรุณาเลือก</option>
                        <option value="main">Main</option>
                        <option value="external">Externel</option>
                    </select>
                </div>
                
                <div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                    >
                        บันทึก
                    </button>

                    <button
                        type="submit"
                        onClick={handleCancel}
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ads;

Ads.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Ads.auth = true;