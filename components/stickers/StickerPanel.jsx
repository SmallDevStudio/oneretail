import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from 'swr';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { Divider } from "@mui/material";
import Swal from "sweetalert2";

const fetcher = url => axios.get(url).then(res => res.data);

const StickerPanel = () => {
    const [tab, setTab] = useState(0);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [selected, setSelected] = useState(null);

    const { data, error } = useSWR('/api/stickers/list', fetcher);

    useEffect(() => {
        if (data) {
            setSelectedSticker(data?.data[tab]?.sticker);
        }
    }, [data, tab]);

    const handleSelected = (sticker, index) => {
        setTab(index);
        setSelectedSticker(sticker.sticker);
    };

    const handleCancel = () => {
        setSelected(null);
    };

    const handleSubmit = () => {
        if (!selected) {
            Swal.fire({
                icon: 'error',
                title: 'เลือกสติกเกอร์',
                text: 'กรุณาเลือกสติกเกอร์',
            });
            return;
        }

        console.log(selected);
        setSelected(null);
    };

    return (
        <div className="flex flex-col gap-2 p-4">
            {!data && <CircularProgress />}
            {/* Panel Header */}
            <div></div>

            {/* Panel Body */}
            <div className="flex flex-col gap-2 mt-2 w-full max-w-[70%]">
                {selectedSticker && selectedSticker.length > 0 && (
                    <div 
                        className="flex flex-row flex-wrap gap-2"
                    >
                        {selectedSticker.map((sticker, index) => (
                            <Image
                                key={index}
                                src={sticker.url}
                                alt="Sticker"
                                width={80}
                                height={80}
                                priority
                                className={`cursor-pointer
                                    ${selected === sticker ? 'scale-125' : ''}
                                `}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                }}
                                onClick={() => setSelected(sticker)}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <Divider className="mt-2"/>
            {/* Panel Footer */}
            <div className="flex flex-row gap-2 mt-2">
                {data && (
                    <div className="flex flex-row flex-wrap gap-2">
                        {data.data.map((sticker, index) => (
                            <li 
                                key={index} 
                                className={`w-10 h-10 list-none cursor-pointer items-center justify-center
                                ${tab === index ? 'scale-150' : ''}
                                `}
                            >
                                <Image
                                    src={sticker.icon.url}
                                    alt="Sticker"
                                    width={30}
                                    height={30}
                                    priority
                                    className="cursor-pointer"
                                    onClick={() => handleSelected(sticker, index)}
                                />
                            </li>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview */}
            <div>
                {selected && (
                    <div className="flex flex-row justify-center gap-2 mt-2">
                        <Image
                            src={selected.url}
                            alt="Sticker"
                            width={80}
                            height={80}
                            priority
                            className="cursor-pointer"
                        />
                    </div>
                )}
            </div>

            <div>
                {selected && (
                    <div className="flex flex-row justify-center gap-2 mt-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            เลือก
                        </button>

                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleCancel}
                        >
                            ยกเลิก
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StickerPanel;