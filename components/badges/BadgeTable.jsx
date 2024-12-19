import { useState, useEffect, useRef } from "react";
import { upload } from '@vercel/blob/client';
import { nanoid } from "nanoid";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosCloseCircle } from "react-icons/io";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const BadgeTable = () => {
    const [badges, setBadges] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);


    const { data: badgesData, mutate } = useSWR("/api/badges", fetcher, {
        onSuccess: (data) => {
            setBadges(data.data);
        },
    });

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const folder = "badges";

    const fileInputRef = useRef(null); // สร้าง ref สำหรับ input file

    const handleFileChange = async(e) => {
        setIsUploading(true); // เริ่มการอัปโหลด

        const file = e.target.files[0];
        setFile(file);

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
            folder: folder, // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
          };

          // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
          await axios.post('/api/upload/save', mediaEntry);

          setImage(mediaEntry);

          setIsUploading(false); // สิ้นสุดการอัปโหลด
          setFile(null);

          // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการอัปโหลดเสร็จ
          fileInputRef.current.value = '';
    };

    const handleFileDelete = async() => {
        const url = image.url;
        const publicId = image.public_id;

        try {
            // ส่งคำขอ DELETE ไปยัง API
          await axios.delete(`/api/blob/delete?url=${url}`);

          await axios.post(`/api/libraries?publicId=${publicId}`);

          // ลบรายการใน state หลังจากที่ลบสำเร็จ
          setImage(null);
        } catch (error) {
            console.error('Error removing media:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const badgeEntry = {
            name,
            description,
            image,
          };

          // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
          await axios.post('/api/badges', badgeEntry);

          // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการบันทึกเสร็จ
          setName("");
          setDescription("");
          setImage(null);

          // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการบันทึกเสร็จ
          fileInputRef.current.value = '';

          mutate();
    };

    const handleDelete = async(id) => {
        try {
            await axios.delete(`/api/badges/${id}`);
        } catch (error) {
            console.error('Error deleting badge:', error);
        }
    };

    const handleEdit = async(data) => {
        setEditMode(true);
        setShowForm(true);
        setName(data.name);
        setDescription(data.description);
        setImage(data.image);
    };

    const handleUpdate = async(id) => {
        try {
            const badgeEntry = {
                name,
                description,
                image,
            };
            await axios.put(`/api/badges?id=${id}`, badgeEntry);

            setEditMode(false);
            setShowForm(false);
            setName("");
            setDescription("");
            setImage(null);
            setFile(null);
        } catch (error) {
            console.error('Error updating badge:', error);
        }
    };

    const hamdleDelete = async(id) => {
        try {
            await axios.delete(`/api/badges?id=${id}`);
        } catch (error) {
            console.error('Error deleting badge:', error);
        }
    };

    const handleClear = () => {
        setName("");
        setDescription("");
        setImage(null);

        // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการบันทึกเสร็จ
        fileInputRef.current.value = '';
    };

    const handleopen = () => {
        setShowForm(true);
    };

    const handleclose = () => {
        setShowForm(false);
    };

    console.log(badges);

    return (
        <div className="flex flex-col p-2">
            {/* Tools */}
            <div className="flex flex-row justify-between mb-2">
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={showForm ? handleclose : handleopen}
                    >
                        เพิ่ม Badges
                    </button>
                </div>
            </div>

            {/* Table */}
            <div>
                <table className="table-auto w-full">
                    <thead className="bg-gray-200 border border-gray-300">
                        <tr>
                            <th className="border border-gray-300 px-2">ลำดับ</th>
                            <th className="border border-gray-300 px-2">ชื่อ</th>
                            <th className="border border-gray-300 px-2">รายละเอียด</th>
                            <th className="border border-gray-300 px-2">ไอคอน</th>
                            <th className="border border-gray-300 px-2">วันที่สร้าง</th>
                            <th className="border border-gray-300 px-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {badges.length > 0 ? (
                            badges.map((badge, index) => (
                                <tr key={badge.id}>
                                    <td>{index + 1}</td>
                                    <td>{badge.name}</td>
                                    <td>{badge.description}</td>
                                    <td>
                                        <Image
                                            src={badge.image[0].url}
                                            alt={badge.name}
                                            width={50}
                                            height={50}
                                        />
                                    </td>
                                    <td>{moment(badge.createdAt).locale('th').format('LLL')}</td>
                                    <td>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleEdit(badge)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleDelete(badge.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>No badges found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {badges.length > 0 && (
            <div className="flex flex-row justify-between mt-2">
                <div>
                    <span className="font-bold text-xs">
                        row data: {badges.length}
                    </span>
                </div>
                <div></div>
                <div></div>
            </div>
             )}

            {/* Form */}
            {showForm && (
                <div className="flex flex-col p-2 mt-2">
                <div className="flex flex-col gap-4 bg-gray-200 p-4 rounded-lg w-2/5">
                    <h1 className="text-2xl font-bold">
                        {editMode ? 'แก้ไข Badge' : 'เพิ่ม Badge'}
                    </h1>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="name" className="font-bold">
                            Name:<span className="text-red-500">*</span>    
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-400 p-1 rounded-lg"
                        />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="description" className="font-bold">Description:</label>
                        <textarea 
                            id="description"
                            name="description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-400 p-1 rounded-lg"
                        ></textarea>
                    </div>

                    <div className="flex flex-col items-center">
                        {isUploading && <CircularProgress />}

                        {image && (
                            <div className="flex flex-row items-center gap-2">
                                <Image
                                    src={image.url}
                                    alt={image.file_name}
                                    width={200}
                                    height={200}
                                    style={{
                                        width: '200px',
                                        height: 'auto',
                                    }}
                                />
                                <IoIosCloseCircle
                                    size={24}
                                    onClick={handleFileDelete}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="image" className="font-bold">
                            Icon:
                            <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="border border-gray-400 p-1 rounded-lg bg-white"
                        />
                    </div>

                    <div className="flex justify-start items-center gap-4">
                        <button 
                            className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full"
                            onClick={editMode ? handleUpdate : handleSubmit}
                        >
                            บันทึก
                        </button>

                        <button
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded-full"
                            onClick={handleClear}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default BadgeTable;