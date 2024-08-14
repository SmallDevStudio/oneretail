import React,{ useState } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { ImFilePicture } from "react-icons/im";
import { IoIosCloseCircle } from "react-icons/io";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CarouselForm = ({ selected, mutate, setLoading , setSelected, setOpen}) => {
    const [url, setUrl] = useState(selected?.url || '');
    const [images, setImages] = useState({url: selected?.image?.url, public_id: selected?.image?.public_id} || null);
    const [error, setError] = useState(null);

    console.log(images);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const handleUploadClick = () => {
        setError(null);
        setLoading(true);
        window.cloudinary.openUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                sources: ['local', 'url', 'camera', 'image_search'],
                multiple: true,
                resourceType: 'auto', // Automatically determines if it's image or video
            },
            (error, result) => {
                if (result.event === 'success') {
                    setImages({ url: result.info.secure_url, public_id: result.info.public_id });
                }
            }
        );
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newData = {
            url: url,
            image: images,
            userId
        }
    
        try {
            if (selected) {
                await axios.put(`/api/main/carousel/${selected._id}`, newData);
            } else {
                await axios.post('/api/main/carousel', newData);
            }
    
            mutate(); // Refresh the data after the update or creation
    
            // Reset form state
            setUrl('');
            setImages(null);
            setSelected(null);
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelected(null);
        setUrl('');
        setImages(null);
        setOpen(false);  // Make sure this actually closes the form
    }


    return (
        <div>
            <div className="flex flex-col">
                {/* Header */}
                <div>
                    <span className="text-xl font-bold">
                        {selected ? 'แก้ไขเนื้อหา' : 'เพิ่มเนื้อหา'}
                    </span>
                </div>

                {/* Body */}
                <div className="flex flex-col mt-4 border rounded-xl p-4">
                    {/* Previews */}
                    <div className="flex flex-col mb-4">
                    {images && (
                        <div className="flex">
                            <Image
                                src={images?.url}
                                alt="Preview"
                                width={200}
                                height={200}
                                loading="lazy"
                                style={{ width: '200px', height: 'auto' }}
                            />
                        </div>
                        )}
                    </div>
                    {/* Form */}
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-2 w-full">
                            <button className="w-2/6" 
                                onClick={handleUploadClick}
                            >
                                <div className="flex flex-row border rounded-xl p-2 items-center shadow-xl">
                                    <ImFilePicture className="text-3xl" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">อัพโหลดรูปภาพ/วิดีโอ</span>
                                        <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                                    </div>
                                </div>
                            </button>
                            {error && <p className="text-red-500">{error}</p>}

                            <div className="flex flex-row gap-2 items-center mt-2">
                                <label className="text-sm font-bold">URL:</label>
                                <input 
                                    type="text"
                                    value={url}
                                    className="border text-xs rounded-xl p-2 shadow-md w-2/6"
                                    placeholder="https://example.com"
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>

                            <div>
                                <button
                                    className="w-1/6 bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full text-sm mt-4"
                                    onClick={handleSubmit}
                                >
                                    {selected ? 'อัพเดท' : 'เพิ่ม'}
                                </button>
                                {selected && (
                                    <button
                                        className="w-1/6 bg-[#F68B1F] text-white font-bold py-2 px-4 rounded-full text-sm mt-4"
                                        onClick={() => handleClear()}
                                    >
                                        ยกเลิก
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarouselForm