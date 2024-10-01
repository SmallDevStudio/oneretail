import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { IoIosCloseCircle } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import sha1 from "crypto-js/sha1";

const CarouselTable = ({data, mutate, setLoading, setSelected, handleOpen}) => {

    const generateSHA1 = (data) => {
        const hash = sha1(data);
        return hash.toString();
    };

    const generateSignature = (publicId, apiSecret) => {
        const timestamp = new Date().getTime();
        const signature = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        return generateSHA1(signature);
    };

    const handleDelete = async (id, image) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this post? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
        if (result.isConfirmed) {
            setLoading(true);
            try {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const publicId = image;
                const timestemp = new Date().getTime();
                const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
                const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
                const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

                await axios.post(url, {
                    public_id: publicId,
                    signature: generateSignature(publicId, apiSecret),
                    api_key: apiKey,
                    timestamp: timestemp,
                });

                await axios.delete(`/api/main/carousel/${id}`);
                mutate();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSelected = (data) => {
        setSelected(data);
        handleOpen();
    }


    return (
        <div>
            <div className="flex flex-col gap-2">
                <div>
                    <span className="text-lg font-bold">Carousel Table</span>
                </div>
                <div>
                    <button className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full"
                        onClick={handleOpen}
                    >
                        เพิ่มเนื้อหา
                    </button>
                </div>
                <div>
                    <table className="table-auto collapse-separate">
                        <thead className="bg-yellow-500 text-white">
                        <tr className="text-center font-bold">
                            <th className="">Image</th>
                            <th className="">Link</th>
                            <th className="">Active</th>
                            <th className="">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="flex w-[200px]">
                                    {item.media && item.media.type === 'image' ? (
                                       <Image 
                                       src={item.media.url}
                                       alt='image' 
                                       width="200" 
                                       height="200"
                                       style={{width: '200px', height: 'auto'}}

                                        />
                                    ): item.media && item.media.type === 'video' ? (
                                        <video 
                                        src={item.media.url}
                                        alt='image' 
                                        width="200" 
                                        height="200"
                                        style={{width: '200px', height: 'auto'}}
                                        />
                                    ): null}

                                    {item.youtube && (
                                        <Image
                                            src={item.youtube.thumbnailUrl}
                                            alt='image'
                                            width="200"
                                            height="200"
                                            style={{width: '200px', height: 'auto'}}
                                        />
                                    )}
                                </td>
                                <td className="text-left text-xs w-[400px]">{item.url}</td>
                                <td className="text-xs w-[100px]">
                                    <div>
                                        {item.status ? 'Yes' : 'No'}    
                                    </div>
                                </td>
                                <td className="text-center text-xs">
                                    <div className="flex flex-row gap-4">
                                        <button
                                            onClick={() => handleSelected(item)}
                                        >
                                            <FiEdit size={20}/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id, item.image.public_id)}
                                            className="text-red-500"
                                        >
                                            <IoIosCloseCircle size={20}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CarouselTable;