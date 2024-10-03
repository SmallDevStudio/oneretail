import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import CircularProgress from '@mui/material/CircularProgress';
import { RiDeleteBinLine } from "react-icons/ri";

const fetcher = (url) => axios.get(url).then(res => res.data);

const StickerTable = () => {
    const [selectedSticker, setSelectedSticker] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const { data: stickers, error: stickerError, isLoading: stickerLoading, mutate: mutateStickers } = useSWR(`/api/stickers`, fetcher);
    if (stickerError) return <div>{stickerError}</div>;
    if (!stickers) return <div><CircularProgress /></div>;

    console.log(stickers);

    const handleSelected = (sticker) => {
        setSelectedSticker((prevSelected) => {
            // Check if the item is already selected
            const isSelected = prevSelected.some(item => item._id === sticker._id);

            if (isSelected) {
                // Remove the item if it is already selected
                return prevSelected.filter(item => item._id !== sticker._id);
            } else {
                // Add the item if it's not selected
                return [...prevSelected, ...[sticker]];
            }
        });
    };

    const handleDelete = async() => {
        const result = Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });
        
        if (result.isConfirmed) {
            console.log('selectedSticker:', selectedSticker);
        }
    };

    return (
        <div>
            {stickerLoading || loading ? (
                <div className="flex justify-center items-center">
                <CircularProgress />
                </div>
            ) : (
                <div>
                    <div className="flex justify-end mb-5">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleDelete}
                        >
                            <RiDeleteBinLine />
                        </button>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-bold">
                            <tr>
                                <th></th>
                                <th scope="col" className="px-2 py-3 font-bold text-center">
                                    ลำดับ
                                </th>
                                <th scope="col" className="px-2 py-3 font-bold text-center">
                                    ไอคอน
                                </th>
                                <th scope="col" className="px-2 py-3 font-bold text-center">
                                    ชื่อ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stickers?.data && stickers?.data?.map((sticker, index) => (
                                <tr key={index} className="bg-white border-b  hover:bg-gray-50">
                                    <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedSticker.some(item => item._id === sticker._id)}
                                        onChange={() => handleSelected(sticker)}
                                    />
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        {index + 1}
                                    </td>
                                
                                    <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap text-center justify-center items-center">
                                        <div className="flex justify-center items-center">
                                            <Image
                                                src={sticker.icon.url}
                                                alt={sticker.name}
                                                width={50}
                                                height={50}
                                                style={{ width: "50px", height: "50px" }}
                                            />
                                        </div>
                                    </th>

                                    <td className="px-2 py-1 text-center">
                                        {sticker.name}
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
        </div>
    );
}

export default StickerTable;