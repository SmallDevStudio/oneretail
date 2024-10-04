import { useState } from "react";
import axios from "axios";
import useSWR from 'swr';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import moment from 'moment';
import "moment/locale/th";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from 'sweetalert2'; // Ensure this is imported
import CircularProgress from '@mui/material/CircularProgress';
import StickerForm from "@/components/stickers/StickerForm";
import StickerView from "@/components/stickers/StickerView";
import Header from "@/components/admin/global/Header";
import Modal from "@/components/Modal"; // Import the new Modal component
import { AdminLayout } from "@/themes";

moment.locale('th');

const fetcher = (url) => axios.get(url).then(res => res.data);

const StickerAdmin = () => {
    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    const userId = session?.user?.id;

    const { data: stickers, error: stickerError, isLoading: stickerLoading, mutate: mutateStickers } = useSWR(`/api/stickers`, fetcher);
    if (stickerError) return <div>{stickerError}</div>;
    if (!stickers) return <div><CircularProgress /></div>;

    const handleSelected = (sticker) => {
        setSelectedSticker((prevSelected) => {
            // Check if the item is already selected
            const isSelected = prevSelected.some(item => item._id === sticker._id);
    
            if (isSelected) {
                // Remove the item if it is already selected
                return prevSelected.filter(item => item._id !== sticker._id);
            } else {
                // Add the item if it's not selected
                return [...prevSelected, sticker];
            }
        });
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });
    
        if (result.isConfirmed) {
            setLoading(true);
            try {
                // Loop through each selected sticker
                for (const sticker of selectedSticker) {
                    // 1. Delete the icon from blob storage
                    if (sticker.icon && sticker.icon.url) {
                        await axios.delete(`/api/blob/delete?url=${sticker.icon.url}`);
                        await axios.delete(`/api/libraries/delete?public_id=${sticker.icon.public_id}`);
                    }
    
                    // 2. Delete each sticker image from blob storage and libraries
                    if (sticker.sticker && sticker.sticker.length > 0) {
                        for (const singleSticker of sticker.sticker) {
                            // Delete sticker image from blob storage
                            await axios.delete(`/api/blob/delete?url=${singleSticker.url}`);
                            
                            // Delete sticker image from libraries
                            await axios.delete(`/api/libraries/delete?public_id=${singleSticker.public_id}`);
                        }
                    }
    
                    // 3. Delete the sticker entry from the database
                    await axios.delete(`/api/stickers/${sticker._id}`);
                }
    
                // Clear selection after deletion
                setSelectedSticker([]);
                mutateStickers(); // Refresh the data after deletion
    
                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your stickers have been deleted.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } catch (error) {
                console.error('Error deleting stickers:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error deleting the stickers.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } finally {
                setLoading(false);
            }
        }
    };
    

    const handleActive = async (sticker) => {

        const newActive = !sticker.active;

        try {
            const response = await axios.put(`/api/stickers/active?id=${sticker._id}`, { active: newActive });
            console.log(response.data);
            mutateStickers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (sticker) => {
        setIsEditing(true);
        setSelectedData(sticker);
        setOpenForm(true);
    };

    const handleOpen = () => {
        setOpenForm(true);
    };

    const handleClose = () => {
        setIsEditing(false);
        setSelectedData(null);
        setOpenForm(false);
    };

    const handleView = (sticker) => {
        setSelectedData(sticker);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedData(null);
        setOpenModal(false);
    };

    
    return (
        <div>
            <div>
                <Header title="Stickers" subtitle="จัดการ Stickers" />
            </div>
            <div className="flex flex-col p-5">
                <div className="flex flex-row items-center mb-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={openForm ? handleClose : handleOpen}
                    >
                        สร้าง Sticker
                    </button>
                </div>
                {/* Sticker Table */}
                <div>
                    {loading ? (
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                    ) : (
                        <div>
                            {/* Conditionally render the delete button */}
                            {selectedSticker.length > 0 && (
                                <div className="flex justify-end mb-5">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={handleDelete}
                                    >
                                        <RiDeleteBinLine />
                                    </button>
                                </div>
                            )}

                            <table className="w-full text-sm text-left text-gray-500 table-auto">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-bold">
                                    <tr>
                                        <th scope="col" className="font-bold text-center w-10"></th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center w-10">
                                            ลำดับ
                                        </th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center">
                                            ไอคอน
                                        </th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center">
                                            ชื่อ
                                        </th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center">
                                            รายละเอียด
                                        </th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center">
                                            สถานะ
                                        </th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center">
                                            วันที่สร้าง
                                        </th>
                                        <th scope="col" className="px-2 py-3 font-bold text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stickers?.data && stickers.data.map((sticker, index) => (
                                        <tr key={sticker._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedSticker.some(item => item._id === sticker._id)}
                                                    onChange={() => handleSelected(sticker)}
                                                />
                                            </td>
                                            <td className="py-1 text-center">
                                                {index + 1}
                                            </td>
                                            <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap text-center justify-center items-center w-64">
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
                                            <td className="px-2 py-1 text-center">
                                                {sticker.description}
                                            </td>
                                            <td className="px-2 py-1 text-center w-40">
                                                <div>
                                                    <button
                                                        onClick={(e) => handleActive(sticker)}
                                                    >
                                                        <div
                                                            className={`${sticker.active ? "bg-green-500" : "bg-red-500"} text-white font-bold py-2 px-4 rounded-full`}
                                                        >
                                                            {sticker.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                                        </div>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 text-center w-52">
                                                {moment(sticker.createdAt).format("lll")}
                                            </td>
                                            <td className="px-2 py-1 text-center w-36">
                                                <div className="flex justify-center items-center gap-4">
                                                    <button
                                                        onClick={(e) => handleView(sticker)}
                                                    >
                                                        view
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleEdit(sticker)}
                                                    >
                                                        edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal for StickerForm */}
                {openForm && (
                    <Modal
                        open={openForm}
                        onClose={handleClose}
                        title="สร้าง Sticker"
                    >
                        <StickerForm 
                            handleClose={handleClose} 
                            mutateStickers={mutateStickers}
                            selectedData={selectedData}
                            isEditing={isEditing}
                        />
                    </Modal>
                )}

                {/* Modal for StickerView */}
                {openModal && (
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        title="ดู Sticker"
                    >
                        <StickerView 
                            handleClose={handleCloseModal} 
                            selectedData={selectedData}
                        />
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default StickerAdmin;

StickerAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
StickerAdmin.auth = true;
