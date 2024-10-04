import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress'; 

const StickerView = ({ selectedData, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState(null);

    if (!selectedData) { setLoading(true); };

    return (
        <div>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
                    <CircularProgress />
                </div>
            )}
           
            {/* Form */}
            <div>
                {/* Header */}
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <RiEmojiStickerLine className="text-2xl inline text-gray-700" />
                        <span className="text-xl font-bold text-[#0056FF]">ดูสติกเกอร์</span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 mt-4">
                   {selectedData && (
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2">
                                <span className='font-bold'>ชื่อ:</span>
                                <span>{selectedData.name}</span>
                            </div>

                            <div className="flex flex-row gap-2">
                                <span className='font-bold'>รายละเอียด:</span>
                                <span>{selectedData.description ? selectedData.description : "-"}</span>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <span className='font-bold'>ไอคอน:</span>
                                <div>
                                    <Image
                                        src={selectedData.icon.url}
                                        alt="Sticker"
                                        width={50}
                                        height={50}
                                        objectFit="contain"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mt-5 gap-2">
                                <div className="flex flex-row flex-wrap gap-2 w-full">
                                    {selectedData.sticker.map((sticker, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex flex-col items-center gap-2 cursor-pointer
                                                ${selectedSticker?.public_id === sticker?.public_id ? "scale-150" : ""}`}
                                            onClick={() => setSelectedSticker(sticker)}
                                        >
                                            <Image
                                                src={sticker.url}
                                                alt="Sticker"
                                                width={100}
                                                height={100}
                                                loading="lazy"
                                                style={{ width: "100px", height: "auto" }}
                                            />
                                            <span className='text-xs font-bold'>{index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                   )}

                   <div className="flex flex-row justify-center items-center gap-2 mt-5 w-full">
                        <button
                            onClick={() => handleClose()}
                            className="bg-[#0056FF] text-white font-bold px-8 py-2 rounded-lg shadow-md"
                        >
                            ปิด
                        </button>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default StickerView;