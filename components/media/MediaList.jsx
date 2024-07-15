import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Slider from '@mui/material/Slider';
import { FaRegImage, FaRegSquare, FaPhotoVideo, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LiaCloudDownloadAltSolid, LiaCloudUploadAltSolid } from "react-icons/lia";

const fetcher = (url) => fetch(url).then((res) => res.json());

const MediaList = () => {
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data, error } = useSWR('/api/media', fetcher, {
        onSuccess: (data) => {
            setMedia(data);
        },
    });

    return (
        <div className="flex w-full min-h-[80%]">
            <div className="flex bg-[#0056FF] w-[10%] justify-end rounded-s-2xl">
                <div className="flex flex-col mt-[50px] p-2 text-right">
                    <p className="text-3xl font-bold text-white">2024</p>
                    <p className="text-lg font-bold text-white">มกราคม</p>
                    <p className="text-lg font-bold text-white">กุมภาพันธ์</p>
                    <p className="text-lg font-bold text-white">มีนาคม</p>
                    <p className="text-lg font-bold text-white">เมษายน</p>
                    <p className="text-lg font-bold text-white">พฤษภาคม</p>
                </div>
            </div>
            <div className="flex flex-col w-[90%] bg-gray-400 rounded-e-2xl">
                <div className="flex flex-row w-full h-[50px] items-center p-2 text-2xl font-bold text-gray-700 gap-4 justify-between">
                    {/* ToolBox */}
                    <div className="flex flex-row gap-4 items-center ml-5">
                    <FaRegImage />
                    <FaPhotoVideo />
                    <FaRegEdit />
                    <RiDeleteBin5Line />
                    </div>
                    <div className="flex flex-row w-[150px] gap-4 items-center">
                        <FaRegSquare className="text-[20px] font-bold"/>
                        <Slider
                            size="small"
                            defaultValue={50}
                            aria-label="Small"
                            valueLabelDisplay="auto"
                        />
                        <FaRegSquare className="text-3xl font-bold"/>
                    </div>
                    <div className="flex flex-row gap-4 items-center text-3xl">
                        <LiaCloudDownloadAltSolid />
                        <LiaCloudUploadAltSolid />
                    </div>
                    <div className="flex gap-4 items-center">
                        <input type="text" placeholder="ค้นหา" className=" rounded-2xl bg-gray-300 text-lg p-1" />
                    </div>
                    {/* End ToolBox */}
                </div>
                <div className="flex w-full bg-white h-[80%] pl-5 pr-5 pb-5 gap-4">
                    {/* Image Contents */}
                    <div className="relative bg-white p-2 shadow-xl rounded-xl">
                        <input type="checkbox" className="relative top-6 left-1 rounded-lg"/>
                        <Image
                            src="/images/Name.jpg"
                            alt="image"
                            width={200}
                            height={200}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="relative bg-white p-2 shadow-xl rounded-xl">
                        <input type="checkbox" className="relative top-6 left-1 rounded-lg"/>
                        <Image
                            src="/images/Name.jpg"
                            alt="image"
                            width={200}
                            height={200}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="relative bg-white p-2 shadow-xl rounded-xl">
                        <input type="checkbox" className="relative top-6 left-1 rounded-lg"/>
                        <Image
                            src="/images/Name.jpg"
                            alt="image"
                            width={200}
                            height={200}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="relative bg-white p-2 shadow-xl rounded-xl">
                        <input type="checkbox" className="relative top-6 left-1 rounded-lg"/>
                        <Image
                            src="/images/Name.jpg"
                            alt="image"
                            width={200}
                            height={200}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default MediaList;