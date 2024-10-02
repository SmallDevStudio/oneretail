import React,{ useState, useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImFilePicture } from "react-icons/im";
import { IoIosCloseCircle } from "react-icons/io";
import useMedia from "@/lib/hook/useMedia";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CarouselForm = ({ selected, mutate, setLoading , setSelected, setOpen}) => {
    const [url, setUrl] = useState(selected?.url || '');
    const [media, setMedia] = useState({url: selected?.media?.url, public_id: selected?.media?.public_id, type: selected?.media?.type} || null);
    const [youtube, setYoutube] = useState(null);
    const [youtubeUrl, setYoutubeUrl] = useState(selected?.youtube.url || '');
    const [error, setError] = useState(null);
    const [Preview, setPreview] = useState(false);
    const { add } = useMedia();

    console.log('media', media);

    const fileUploadRef = useRef(null);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const result = await add(file, userId, 'carousel');
        setMedia(result);
        setPreview(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Validation: Ensure that at least one of `media` or `youtube` is provided
        if (!media?.url && !youtubeUrl) {
            setError('Please upload an image or video, or provide a YouTube URL.');
            setLoading(false);
            return;
        }
    
        // Construct `newData` according to your schema
        const newData = {
            url: url || '', // Fallback to empty string if URL is not set
            image: media && media.url ? { ...media } : null, // Ensure media has a valid URL
            youtube: youtube ? {
                url: youtubeUrl,
                thumbnailUrl: youtube?.thumbnailUrl || null,
            } : null,
            userId
        };
    
        console.log('Submitting data:', newData); // Log the data being sent
    
        try {
            if (selected) {
                await axios.put(`/api/main/carousel/${selected._id}`, newData);
            } else {
                await axios.post('/api/main/carousel', newData);
            }
    
            mutate(); // Refresh the data after the update or creation
    
            // Reset form state
            setUrl('');
            setMedia(null);
            setSelected(null);
            setOpen(false);
            setYoutubeUrl('');
            setYoutube(null);
            setError(null); // Clear error if successful
            setPreview(false);
        } catch (error) {
            console.error('Submission error:', error);
            setError('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelected(null);
        setUrl('');
        setMedia(null);
        setOpen(false);  // Make sure this actually closes the form
    }

    const handleYoutube = async (e) => {
        try {
            const response = await axios.post('/api/getyoutube', { youtubeUrl: youtubeUrl });
            const video = response.data;
            setYoutube(video);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMedia = async (url) => {
        try {
            await axios.delete(`/api/blob/delete?url=${url}`);
            setMedia(null);
        } catch (error) {
            console.error(error);
        }
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
                    {Preview && media && media?.type === 'image'? (
                            
                            <Image
                                src={media?.url}
                                alt="Preview"
                                width={200}
                                height={200}
                                loading="lazy"
                                style={{ width: '200px', height: 'auto' }}
                            />
                        
                        ): media?.type === 'video'? (
                            
                                <video
                                    src={media?.url}
                                    controls
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                    style={{ width: '200px', height: 'auto' }}
                                />
                            
                        ): null}

                        {youtube && (
                           
                                <Image
                                    src={youtube.thumbnailUrl}
                                    alt="Preview"
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                    style={{ width: '200px', height: 'auto' }}
                                />
                           
                        )}
                        {Preview && media && (
                            <div
                                className="relative top-[-120px] right-[-200px] cursor-pointer"
                                onClick={() => handleDeleteMedia(media?.url)}
                            >
                                <IoIosCloseCircle />
                            </div>
                        )}
                    </div>
                    {/* Form */}
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-2 w-full">
                            <button className="w-2/6" 
                                onClick={() => fileUploadRef.current.click()}
                            >
                                <div className="flex flex-row border rounded-xl p-2 items-center shadow-xl">
                                    <ImFilePicture className="text-3xl" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">อัพโหลดรูปภาพ/วิดีโอ</span>
                                        <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                                    </div>
                                </div>
                            </button>

                             {/* ซ่อน input file แต่ใช้ ref เพื่อให้มันทำงานเมื่อกดปุ่ม */}
                            <input
                                    ref={fileUploadRef}
                                    type="file"
                                    multiple // สามารถเลือกหลายไฟล์ได้
                                    accept="image/*,video/*" // จำกัดชนิดของไฟล์
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }} // ซ่อน input file
                                />
                            {error && <p className="text-red-500">{error}</p>}

                            <div className="flex flex-row gap-2 items-center mt-2">
                                <label className="text-sm font-bold">Youtube:</label>
                                <input 
                                    type="text"
                                    value={youtubeUrl}
                                    className="border text-xs rounded-xl p-2 shadow-md w-2/6"
                                    placeholder="youtube url"
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                />
                                <button
                                    className="w-1/6 bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full text-sm mt-4"
                                    onClick={handleYoutube}
                                >
                                    ดึง youtube
                                </button>
                            </div>

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
                                    <button
                                        className="w-1/6 bg-[#F68B1F] text-white font-bold py-2 px-4 rounded-full text-sm mt-4"
                                        onClick={() => handleClear()}
                                    >
                                        ยกเลิก
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarouselForm