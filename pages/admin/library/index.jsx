import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import { AdminLayout } from "@/themes";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Library = () => {
    const [selectedData, setSelectedData] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log(selectedData); // Debugging selected data

    const { data, error, mutate } = useSWR("/api/libraries", fetcher);
    if (error) return <div>Failed to load</div>;
    if (!data) return <CircularProgress />;

    const onDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            setLoading(true);
            try {
                // Use Promise.all to delete all selected items concurrently
                await Promise.all(
                    selectedData.map(async (item) => {
                        // First, delete the media file
                        await axios.delete(`/api/blob/delete`, {
                            params: { url: item.url },
                        });
        
                        // Then, delete the item from the library
                        await axios.delete(`/api/libraries/${item._id}`);
                    })
                );
        
                // Clear the selected data
                setSelectedData([]);
        
                // Refresh the data using mutate (from SWR)
                mutate();
            } catch (error) {
                console.error('Error deleting items:', error);
            } finally {
                setLoading(false);
            }
        };
    };
    
    const handleSelected = (library) => {
        setSelectedData((prevSelected) => {
            // Check if the item is already selected
            const isSelected = prevSelected.some(item => item._id === library._id);

            if (isSelected) {
                // Remove the item if it is already selected
                return prevSelected.filter(item => item._id !== library._id);
            } else {
                // Add the item if it's not selected
                return [...prevSelected, { _id: library._id, public_id: library.public_id, url: library.url }];
            }
        });
    };

    return (
        <div className="flex flex-col p-5 w-[100%]">
            <div className="flex text-2xl font-bold text-[#0056FF] mb-4">
                Library Management
            </div>

            {/* Tools */}
            {selectedData.length > 0 && (
                <div className="flex flex-row justify-end gap-4 mb-5">
                    <button
                        className="text-xl bg-red-500 font-bold px-6 py-1 rounded-lg text-white"
                        onClick={onDelete}
                    >
                        <RiDeleteBinLine className="text-xl inline " />
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="flex flex-col px-5">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ): (
                    <table className="w-full text-sm text-left text-gray-500 table-auto">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-bold">
                        <tr>
                            <th scope="col" className="px-2 py-3 font-bold text-center"></th>
                            <th scope="col" className="px-2 py-3 font-bold text-center">ลำดับ</th>
                            <th scope="col" className="px-2 py-3 font-bold text-center">Public_id</th>
                            <th scope="col" className="px-2 py-3 font-bold text-center">Image</th>
                            <th scope="col" className="px-2 py-3 font-bold text-center">CreatedAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((library, index) => (
                            <tr
                                key={library._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="px-2 py-2 font-bold text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedData.some(item => item._id === library._id)}
                                        onChange={() => handleSelected(library)}
                                    />
                                </td>
                                <td className="px-2 py-2 font-bold text-center">
                                    {index + 1}
                                </td>
                                <td className="px-2 py-2 font-bold text-center">
                                    {library.public_id}
                                </td>
                                <td className="px-2 py-2 font-bold text-center">
                                    <div className="flex justify-center">
                                        <Image
                                            src={library.url}
                                            alt={library.public_id}
                                            width={100}
                                            height={100}
                                            className="object-cover"
                                            priority
                                            style={{ width: "100px", height: "100px" }}
                                        />
                                    </div>
                                </td>
                                <td className="px-2 py-2 font-bold text-center">
                                    {moment(library.createdAt).format("DD/MM/YYYY")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
};

export default Library;

Library.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Library.auth = true;
