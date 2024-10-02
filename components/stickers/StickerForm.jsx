import { useState, useRef } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import useMedia from '@/lib/hook/useMedia';
import axios from 'axios';
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress'; 

const StickerForm = (seletedData, handleClose) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState(null);
    const [sticker, setSticker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { add } = useMedia();

    const fileIconRef = useRef(null);
    const fileStickerRef = useRef(null);

    const handleIconChange = async(e) => {
        const file = e.target.files[0];
        try {
            const result = await add(file, userId, 'stickers');
            setIcon(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStickerChange = async(e) => {
        const fileArray = Array.from(e.target.files); // Convert FileList to an array

    try {
        // Use Promise.all to upload all files concurrently
        const uploadResults = await Promise.all(
            fileArray.map(file => add(file, userId, "stickers"))
        );

        // Update media state with the uploaded results
        setSticker((prevMedia) => [...prevMedia, ...uploadResults]);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }

    const handleIconRemove = async (url) => {
        try {
            await axios.delete(`/api/blob/delete?url=${url}`);
            setIcon(null);
        } catch (error) {
            console.error(error);
        }
    }

    const handleStickerRemove = async (url, public_id) => {
        try {
            await axios.delete(`/api/blob/delete`, {
                params: { url },
            });
            setSticker((prevMedia) => prevMedia.filter((m) => m.public_id !== public_id));
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!name) {
            setError('กรุณากรอกชื่อ');
            setLoading(false);
            return;
        }

        if (!icon || icon.length === 0) {
            setError('กรุณาเลือกไอคอน');
            setLoading(false);
            return;
        }

        if (!sticker || sticker.length === 0) {
            setError('กรุณาเลือกสติกเกอร์');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('/api/stickers', {
                name,
                description,
                icon,
                sticker,
                userId
            });
            setName('');
            setDescription('');
            setIcon(null);
            setSticker(null);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setName('');
        setDescription('');
        setIcon(null);
        setSticker(null);
        handleClose();
    }


    return (
        <div>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
                    <CircularProgress />
                </div>
            )}
            {/* Header */}
            <div className='flex flex-row items-center mb-5'>
                <span className='text-lg font-bold'>
                    สร้าง Sticker
                </span>
            </div>
            {/* Form */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="name" className='font-bold'>
                        ชื่อ
                        <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className='border border-gray-300 rounded-xl px-2 py-1'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="description" className='font-bold'>รายละเอียด</label>
                    <textarea
                        type="text"
                        name="description"
                        id="description"
                        className='border border-gray-300 rounded-xl px-2 py-1'
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {icon && (
                    <div className="relative flex flex-col p-2 border-2 rounded-xl">
                        <IoIosCloseCircle
                        className="absolute top-0 right-0 text-xl cursor-pointer"
                        onClick={() => handleIconRemove(icon.url)}
                    />
                        <Image
                            src={icon.url}
                            alt="Icon"
                            width={50}
                            height={50}
                            className='object-cover'
                            style={{ width: 'auto', height: '50px' }}
                        />
                    </div>
                )}
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="icon" className='font-bold'>
                        ไอคอน
                        <span className='text-red-500'>*</span>
                    </label>
                    <div 
                        className='flex flex-row items-center gap-1 bg-blue-500 px-2 py-1 rounded-xl text-white font-bold shadow-lg cursor-pointer'
                        onClick={() => fileIconRef.current.click()}
                    >
                        <MdOutlineInsertEmoticon />
                        <span>อัพโหลดไอคอน</span>
                    </div>
                    <input
                        type="file"
                        name="icon"
                        id="icon"
                        ref={fileIconRef}
                        accept="image/*"
                        onChange={handleIconChange}
                        className='hidden'
                        required
                    />
                </div>
                {sticker && sticker.length > 0 && sticker.map((sticker, index) => (
                    <div key={index} className="relative flex flex-col p-2 border-2 rounded-xl">
                    <IoIosCloseCircle
                      className="absolute top-0 right-0 text-xl cursor-pointer"
                      onClick={() => handleStickerRemove(sticker.url, sticker.public_id)}
                    />
                            <Image
                                src={sticker.url}
                                alt="Sticker"
                                width={80}
                                height={80}
                                className='object-cover'
                                style={{ width: '80px', height: 'auto' }}
                            />
                        
                    </div>
                ))}
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="sticker" className='font-bold'>
                        สติ๊กเกอร์
                        <span className='text-red-500'>*</span>
                    </label>
                    <div
                        className='flex flex-row items-center gap-1 bg-blue-500 px-2 py-1 rounded-xl text-white font-bold shadow-lg cursor-pointer'
                        onClick={() => fileStickerRef.current.click()}
                    >
                        <RiEmojiStickerLine />
                        <span>อัพโหลดสติ๊กเกอร์</span>
                    </div>
                    <input
                        type="file"
                        name="sticker"
                        id="sticker"
                        ref={fileStickerRef}
                        accept="image/*"
                        multiple
                        onChange={handleStickerChange}
                        className='hidden'
                        required
                    />
                </div>
                <div className='flex flex-row gap-2'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => handleSubmit}
                    >
                        บันทึก
                    </button>
                    <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => handleCancel}
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickerForm;