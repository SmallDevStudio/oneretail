import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import Header from "@/components/admin/global/Header";
import Loading from "@/components/Loading";
import { FaFolderPlus, FaFolderTree, FaFolderMinus, FaFolderClosed } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { Tooltip, Slide, Dialog, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { TiArrowBack } from "react-icons/ti";
import FolderForm from "@/components/gallery/FolderForm";
import { useGoogleDrive } from "@/lib/hook/useGoogleDrive";

moment.locale("th");

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = url => axios.get(url).then(res => res.data);

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const Galleries = () => {
    const [gallery, setGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [subfolderIndex, setSubfolderIndex] = useState(null);
    const [folderName, setFolderName] = useState("");
    const [loading, setLoading] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editTools, setEditTools] = useState(false);
    const [folder, setFolder] = useState(null);
    const [subFolder, setSubFolder] = useState(null);
    const [isSubFolder, setIsSubFolder] = useState(false);
    const { fetchDriveFolderContent } = useGoogleDrive();
    const [driveFolderContent, setDriveFolderContent] = useState([]);
    
    const { data: session, status } = useSession();


    const { data, error, mutate, isValidating, isLoading } = useSWR("/api/gallery", fetcher,{
        onSuccess: (data) => {
            setGallery(data.data);
        },
    });

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
    }, [status]);


    useEffect(() => {
        if (selectedFolder && selectedFolder.googleDriveUrl) {
            const loadDriveFolderContent = async () => {
                const driveFolderContent = await fetchDriveFolderContent(selectedFolder.googleDriveUrl);
                setDriveFolderContent(driveFolderContent);
            }
            loadDriveFolderContent();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFolder, selectedFolder.googleDriveUrl]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "F2" && selectedFolder) {
                setEditName(true);
                setFolderName(selectedFolder.title);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedFolder]);

    if (error) return <div>failed to load</div>;
    if (isLoading || !data) return <Loading />;

    const handleClose = () => {
        setOpenForm(false);
    }

    const handleSelectFolder = (folder) => {
        setSelectedFolder(folder);
        setEditTools(true);
    }

    const handleSelectSubfolder = (subfolder, index) => {
        setSelectedFolder(subfolder);
        setSubfolderIndex(index);
        setEditTools(true);
    };

    const handleDoubleClickFolder = (folder) => {
        setFolder(folder);
        setEditTools(false);
    };

    const handleDoubleClickSubFolder = (folder, subfolder) => {
        setFolder(folder);
        setSubFolder(subfolder);
        setEditTools(false);
    };

    const handleEditName = async (e) => {
        if (e.key === "Enter" && folderName.trim() && selectedFolder) {
            try {
                if (folder && subfolderIndex !== null) {
                    const updatedSubfolders = [...folder.subfolders];
                    updatedSubfolders[subfolderIndex] = { ...updatedSubfolders[subfolderIndex], title: folderName.trim() };
                    await axios.put(`/api/gallery/${folder._id}`, { subfolders: updatedSubfolders });
                } else {
                    await axios.put(`/api/gallery/${selectedFolder._id}`, { title: folderName.trim() });
                }
                toast.success("แก้ไขชื่อสำเร็จ");
                setEditName(false);
                mutate();
            } catch (error) {
                toast.error("แก้ไขชื่อไม่สำเร็จ");
                console.error(error);
            }
        }
    };

    const handleEditFolderName = (name) => {
        setEditName(true);
        setFolderName(name);
    };

    const handleDeleteFolder = async () => {
        const result = await Swal.fire({
            title: "คุณแน่ใจที่จะลบใช่ไหม!",
            text: "คุณต้องการลบโฟลเดอร์ใช่ไหม",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ไม่ลบ"
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/gallery/${selectedFolder._id}`);
                toast.success("ลบโฟลเดอร์สำเร็จ");
                setSelectedFolder(null);
                mutate();
            } catch (error) {
                toast.error("ลบโฟลเดอร์ไม่สำเร็จ");
                console.error(error);
            }
        }
    };

    const handleClear = () => {
        setSelectedFolder(null);
        setFolder(null);
        setSubFolder(null);
        setDriveFolderContent([]);
    };

    const handleFolderClear = () => {
        setSelectedFolder(null);
        setSubFolder(null);
        setDriveFolderContent([]);
    };

    const handleCreatSubFolder = () => {
        setIsSubFolder(true);
        setOpenForm(true);
    };

    return (
        <div className="flex flex-col p-4 w-full">
            <Header title={"จัดการคลังรูปภาพ"} subtitle="จัดการข้อมูลคลังรูปภาพ" />

            <div className="flex flex-col border border-gray-200 rounded-xl mb-4">
                {/* HEADER */}
                <div className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-t-xl h-12">
                    <div className="flex flex-row gap-2">
                        {folder && subFolder ? (
                            <Tooltip title="ย้อนกลับ" arrow>
                                <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-[#F2871F]" 
                                    onClick={handleFolderClear}
                                >
                                    <TiArrowBack size={20} />
                                </div>
                            </Tooltip>
                        ) : folder ? (
                            <Tooltip title="ย้อนกลับ" arrow>
                                <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-[#F2871F]" 
                                    onClick={handleClear}
                                >
                                    <TiArrowBack size={20} />
                                </div>
                            </Tooltip>
                        ): null}

                        {!subFolder && (
                            <Tooltip title="เพิ่มโฟลเดอร์" arrow>
                                <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-[#F2871F]" 
                                    onClick={folder ? () => handleCreatSubFolder() : () => setOpenForm(true)}
                                >
                                    <FaFolderPlus size={20} />
                                </div>
                            </Tooltip>
                        )}
                       
                        {editTools && selectedFolder && (
                            <>
                                <Tooltip title="เปลี่ยนชื่อโฟลเดอร์" arrow>
                                    <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-green-500" 
                                        onClick={() => handleEditFolderName(selectedFolder.title)}
                                    >
                                        <FaFolderClosed size={20} />
                                    </div>
                                </Tooltip>

                                <Tooltip title="ลบโฟลเดอร์" arrow>
                                    <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-red-500" 
                                        onClick={handleDeleteFolder}
                                    >
                                        <FaFolderMinus size={20} />
                                    </div>
                                </Tooltip>

                                <Tooltip title="รายละเอียดโฟลเดอร์" arrow>
                                    <div className="flex p-1 bg-gray-400 text-gray-100 rounded-md hover:bg-blue-500" 
                                    
                                    >
                                        <FaInfoCircle size={20} />
                                    </div>
                                </Tooltip>
                            </>
                        )}

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

                {/* breadcrumbs */}
                <div className="flex flex-row items-center justify-between py-2 px-4 w-full">
                    {folder && (
                        <div className="flex flex-row text-gray-500 text-sm items-center gap-2">
                            <IoHomeSharp onClick={handleClear} className="cursor-pointer hover:text-gray-400"/>
                            <span>/</span>
                            <span
                                className={`cursor-pointer ${folder && !subFolder ? "font-bold text-[#0056FF]" : ""}`}
                                onClick={handleFolderClear}
                            >
                                {folder.title}
                            </span>
                            {subFolder && (
                                <>
                                    <span>/</span>
                                    <span
                                        className={`cursor-pointer ${folder && subFolder ? "font-bold text-[#0056FF]" : ""}`}
                                    >
                                        {subFolder.title}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    {driveFolderContent && driveFolderContent.length > 0 && (
                        <span className="text-gray-500 font-bold text-sm">จํานวน <span className="font-bold text-[#0056FF] text-lg">{driveFolderContent.length}</span> รูป</span>
                    )}
                </div>

                {/* CONTENT */}
                <div className="px-4">
                    <div className="flex flex-wrap gap-4">
                        {subFolder ? (
                            driveFolderContent && driveFolderContent.length > 0 && (
                                driveFolderContent.map((file, index) => (
                                    <div 
                                        key={index}
                                        className="cursor-pointer"
                                    >
                                        {file.mimeType.startsWith("image/") && (
                                            <Image
                                                src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                                                alt={file.name}
                                                width={200}
                                                height={200}
                                                style={{ objectFit: "cover", width: "100%", height: "auto" }}
                                                loading="lazy"

                                            />
                                        )}
                                        {file.mimeType.startsWith("video/") && (
                                            <video
                                                style={{ width: "100%", height: "auto" }}
                                                src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                                            />
                                        )}
                                    </div>
                                ))
                            )
                        ): 
                        folder ? (
                            <>
                            {folder.subfolder?.map((sub, index) => (
                                <div key={index} onClick={() => handleSelectSubfolder(sub, index)} onDoubleClick={() => handleDoubleClickSubFolder(folder, sub)}
                                    className={`max-w-[100px] p-2 cursor-pointer ${selectedFolder?._id === sub._id ? "bg-[#0056FF]/50 text-white" : "bg-white"}`}>
                                    <Image src="/images/folder.png" alt={sub.title} width={100} height={100} />
                                    {editName && selectedFolder?._id === sub._id ? (
                                        <textarea
                                            type="text"
                                            className="block text-xs text-black bg-white border-b border-blue-500 bg-transparent focus:outline-none w-[90px]"
                                            value={folderName}
                                            onChange={(e) => setFolderName(e.target.value)}
                                            onKeyDown={handleEditName}
                                            onBlur={() => setEditName(false)}
                                            rows={2}
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="text-center text-xs line-clamp-2 overflow-hidden text-ellipsis break-words">{sub.title}</p>
                                    )}
                                </div>
                            ))}
                            {driveFolderContent && driveFolderContent.length > 0 && (
                                driveFolderContent.map((file, index) => (
                                    <div 
                                        key={index}
                                        className="cursor-pointer"
                                    >
                                        {file.mimeType.startsWith("image/") && (
                                            <Image
                                                src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                                                alt={file.name}
                                                width={200}
                                                height={200}
                                                style={{ objectFit: "cover" }}
                                            />
                                        )}
                                        {file.mimeType.startsWith("video/") && (
                                            <video
                                                style={{ width: "100%", height: "auto" }}
                                                src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                            </>
                        ) : (
                            gallery.map((item, index) => (
                                <div key={index} onClick={() => handleSelectFolder(item)} onDoubleClick={() => handleDoubleClickFolder(item)}
                                    className={`max-w-[100px] p-2 cursor-pointer ${selectedFolder?._id === item._id ? "bg-[#0056FF]/50 text-white" : "bg-white"}`}>
                                    <Image src="/images/folder.png" alt={item.title} width={100} height={100} />
                                    {editName && selectedFolder?._id === item._id ? (
                                        <textarea
                                            type="text"
                                            className="text-xs bg-white text-black border-b border-blue-500 bg-transparent focus:outline-none w-[90px]"
                                            value={folderName}
                                            onChange={(e) => setFolderName(e.target.value)}
                                            onKeyDown={handleEditName}
                                            onBlur={() => setEditName(false)}
                                            rows={2}
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="text-center text-xs line-clamp-2 overflow-hidden text-ellipsis break-words">{item.title}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <FolderForm
                    mutate={mutate}
                    onClose={handleClose}
                    isSubFolder={isSubFolder}
                    folder={folder}
                />
            </Dialog>
        </div>
    );
};

export default Galleries;
