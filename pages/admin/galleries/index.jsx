import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import Header from "@/components/admin/global/Header";
import Loading from "@/components/Loading";
import { FaPlusCircle, FaEdit } from "react-icons/fa"
import { MdOutlinePageview } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaFolderPlus, FaFolderTree } from "react-icons/fa6";
import { Tooltip, Slide, Dialog } from "@mui/material";

moment.locale("th");

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = url => axios.get(url).then(res => res.data);

const Galleries = () => {
    const [gallery, setGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, error, mutate, isValidating, isLoading } = useSWR("/api/gallery", fetcher,{
        onSuccess: (data) => {
            setGallery(data.data);
        },
    });

    if (error) return <div>failed to load</div>;
    if (isLoading || !data) return <Loading />;

    console.log('gallery:', gallery);

    const handleClose = () => setOpenForm(false);

    return (
        <div className="flex flex-col p-4 w-full">
            <Header title={"จัดการคลังรูปภาพ"} subtitle="จัดการข้อมูลคลังรูปภาพ" />

            <div className="flex flex-col border border-gray-200 rounded-xl mb-4">
                {/* HEADER */}
                <div className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-t-xl h-12">
                    <div className="flex flex-row gap-2">
                        <Tooltip title="เพิ่มคลังรูปภาพ" arrow>
                            <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md" onClick={() => setOpenForm(true)}>
                                <FaFolderPlus size={20} />
                            </div>
                        </Tooltip>
                        <Tooltip title="ดูแบบ Tree" arrow>
                            <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md">
                                <FaFolderTree size={20} />
                            </div>
                        </Tooltip>
                    </div>
                    {/* Search */}
                    <div className="flex flex-row gap-2">
                        <Tooltip title="ค้นหา" placement="top-start" arrow>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        </Tooltip>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col p-4">
                    {gallery.map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center max-w-[100px]">
                            <div className="relative">
                                <Image
                                    src="/images/folder.png"
                                    alt={item.title}
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <span className="block text-xs">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="flex flex-col p-4">
                    <h1 className="text-xl font-bold">เพิ่มคลังรูปภาพ</h1>
                </div>
            </Dialog>
        </div>
    );
};

export default Galleries;
