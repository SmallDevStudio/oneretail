import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IoIosCloseCircle } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
import { Divider } from "@mui/material";
import Modal from "@/components/Modal";
import { IoIosClose } from "react-icons/io";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ContentForm = () => {
    const [personalized, setPersonalized] = useState([]);
    const [contents, setContents] = useState([]);
    const [allContents, setAllContents] = useState([]);
    const [name, setName] = useState("");
    const [selectedContent, setSelectedContent] = useState([]);
    const [active, setActive] = useState(true);
    const [selectedContentId, setSelectedContentId] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const category = "665c561146d171292cbda9eb";

    const { data: personalizedData, error: personalizedError, isLoading: personalizedLoading, mutate } = useSWR(`/api/personal/contents`, fetcher, {
        onSuccess: (data) => {
            setPersonalized(data.data);
        },
    });

    const { data: contentsData, error: contentsError, isLoading } = useSWR(`/api/content/category?categoryId=${category}`, fetcher, {
        onSuccess: (data) => {
            setContents(data?.data);
            setAllContents(data?.data); // เก็บข้อมูลทั้งหมดไว้ใน allContents
        },
    });


    const handleSubmitPersonalized = async () => {
        if (isEdit) {
            const update = {
                name,
                contents: selectedContent,
                active
            }

            try {
                setLoading(true);
                const response = await axios.put(`/api/personal/contents/${selectedContentId}`, update);

                if (response.status === 200) {
                    setLoading(false);
                    handleClearPersonalized();
                    mutate();
                    setOpen(false);
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถบันทึกข้อมูลได้',
                        text: response.data.message,
                    });
                }
            } catch (error) {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                });
            }
        } else {
            const newData = {
                name,
                contents: selectedContent,
                creator: userId,
            }
    
            try {
                setLoading(true);
                const response = await axios.post("/api/personal/contents", newData);
    
                if (response.status === 201) {
                    setLoading(false);
                    handleClearPersonalized();
                    mutate();
                    setOpen(false);
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถบันทึกข้อมูลได้',
                        text: response.data.message,
                    });
                }
    
            } catch (error) {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                });
            }
        }

        
    };

    const handleEditPersonalized = async (data, id) => {
        setIsEdit(true);
        setSelectedContentId(id);
        setSelectedContent(data.contents.map((content) => content._id));
        setName(data.name);
        setOpen(true);
    }

    const handleDeletePersonalized = async (id) => {
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
            try {
                const response = await axios.delete(`/api/personal/contents/${id}`);
                if (response.status === 200) {
                    mutate();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถลบข้อมูลได้',
                        text: response.data.message,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                });
            }
        }
    }

    const handleActivePersonalized = async (data, id) => {
        // Toggle the status as a Boolean
       let newStatus;

        if (data.active) {
            newStatus = false;
        } else {
            newStatus = true;
        }

        try {
            const response = await axios.put(`/api/personal/contents/active?id=${id}`, { active: newStatus });
            if (response.status === 200) {
                mutate();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถบันทึกข้อมูลได้',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.response.data.message,
            });
        }
    };

    const handleClearPersonalized = async () => {
        setSelectedContent([]);
        setName("");
        setSelected(null);
        setOpen(false);
        setLoading(false);
        setContents(allContents);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase(); // เปลี่ยนเป็นตัวพิมพ์เล็ก
        const newContents = allContents.filter((content) =>
            content.title?.toLowerCase().includes(value.toLowerCase())
        );
        setContents(newContents);
    };

    const handleSelectSubCategory = (subcategories) => {
        const id = subcategories._id;
        const newContents = allContents.filter((content) => content.subcategories?._id.includes(id));
        setContents(newContents);
        setSelected({
            ...selected,
            subcategories: subcategories.title,
        });
    }

    const handleRemoveSubCategory = () => {
        setSelected({
            ...selected,
            subcategories: null,
        });
        const newContents = allContents;
        setContents(newContents);
    }

    const handleSelectGroup = (groups) => {
        const id = groups._id;
        const newContents = allContents.filter((content) => content.groups?._id.includes(id));
        setContents(newContents);
        setSelected({
            ...selected,
            groups: groups.name,
        });
    }

    const handleRemoveGroup = () => {
        setSelected({
            ...selected,
            groups: null,
        });
        const newContents = allContents;
        setContents(newContents);
    }

    const handleSelectSubGroup = (subgroups) => {
        const id = subgroups._id;
        const newContents = allContents.filter((content) => content.subgroups?._id.includes(id));
        setContents(newContents);
        setSelected({
            ...selected,
            subgroups: subgroups.name,
        });
    }

    const handleRemoveSubGroup = () => {
        setSelected({
            ...selected,
            subgroups: null,
        });
        const newContents = allContents;
        setContents(newContents);
    }

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setSelected(null);
        setSelectedContent([]);
        setName("");
        setLoading(false);
        setContents(allContents);
        setIsEdit(false);
    };

    return (
        loading ? (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        ) : (
        <div>
            {/* Table */}
            <div className="p-5">
                <div>
                    <button
                        onClick={handleOpen}
                        className="bg-[#0056FF] text-white rounded-md px-4 py-1"
                    >
                        เพิ่มกลุ่มเนื้อหา
                    </button>
                </div>
                {personalizedLoading && !personalizedData ? (
                    <div className="flex justify-center items-center h-screen">
                        <CircularProgress />
                    </div>
                ): (
                    <div className="overflow-x-auto mt-2">
                        <table className="table-auto w-full">
                            <thead className="bg-gray-200 text-black">
                                <tr>
                                    <th>#</th>
                                    <th>ชื่อกลุ่ม</th>
                                    <th>เนื้อหา</th>
                                    <th>สร้างโดย</th>
                                    <th>สถานะ</th>
                                    <th>วันที่สร้าง</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personalized && personalized.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">{item.name}</td>
                                        <td className="border px-4 py-2">
                                            {item?.contents?.map((content, index) => (
                                                <div key={index}>
                                                    <li>{content.title}</li>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className="flex items-center text-center">
                                                <Image
                                                    src={item.creator.pictureUrl}
                                                    alt="creator"
                                                    width={50}
                                                    height={50}
                                                    style={{
                                                        width: "50px",
                                                        height: "auto",
                                                        objectFit: "cover",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                className={`inline-block ${item.active ? "bg-green-500" : "bg-red-500"} text-white rounded-md px-2 py-1`}
                                                onClick={() => handleActivePersonalized(item, item._id)}
                                            >
                                                <span className={`inline-block text-sm font-bold text-white`}>
                                                    {item.active? "ใช้งาน" : "ไม่ใช้งาน"}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2 text-center">{moment(item.createdAt).format("lll")}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex gap-2 text-center">
                                                <button
                                                    onClick={() => handleEditPersonalized(item, item._id)}
                                                    className="bg-green-500 text-white rounded-md px-2 py-1"
                                                >
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePersonalized(item._id)}
                                                    className="bg-red-500 text-white rounded-md px-2 py-1"
                                                >
                                                    ลบ
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

            {/* Form */}
           {open && (
                <Modal 
                open={open} 
                onClose={handleClose} 
                title="เพิ่มกลุ่มเนื้อหา"
            >
                <div className="flex flex-col gap-2 p-4">
                <div className="flex flex-col border-2 rounded-lg p-4 gap-4">
                    <span className="text-xl font-bold text-[#0056FF]">
                        {isEdit ? "แก้ไขกลุ่มเนื้อหา" : "เพิ่มกลุ่มเนื้อหา"}
                    </span>
                    <Divider />
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="name" className="font-bold">ชื่อกลุ่ม:<span className="text-red-500" >*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="ชื่อกลุ่ม"
                            className="bg-gray-100 rounded-md px-2 py-1 w-1/2"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-bold">เลือกเนื้อหา:</label>
                        <div className="grid grid-cols-2 w-full px-4">
                            <div className="col-span-1 w-full min-h-[500px] max-h-[500px] gap-2 border-2 overflow-auto px-2 py-1">
                                <div className="flex flex-row items-center gap-2">
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        className="w-full px-2 py-1 border-2 border-gray-300 rounded-md"
                                        placeholder="ค้นหา"
                                        onChange={handleSearch}
                                    />
                                </div>
                                {selected ? (
                                    <div className="flex flex-row items-center gap-2 mt-1 mb-1">
                                        {selected.subcategories ? (
                                            <div className="flex flex-row items-center text-xs bg-red-500 text-white rounded-md px-1">
                                            <IoIosClose 
                                                className="cursor-pointer" 
                                                onClick={handleRemoveSubCategory}
                                            />
                                            <span>{selected.subcategories}</span>
                                        </div>
                                        ): null}
                                        {selected.groups ? (
                                            <div className="flex flex-row items-center text-xs bg-blue-400 text-white rounded-md px-1">
                                            <IoIosClose 
                                                className="cursor-pointer" 
                                                onClick={handleRemoveGroup}
                                            />
                                            <span>{selected.groups}</span>
                                        </div>
                                        ): null}
                                        {selected.subgroups ? (
                                            <div className="flex flex-row items-center text-xs bg-yellow-500 text-white rounded-md px-1">
                                            <IoIosClose 
                                                className="cursor-pointer" 
                                                onClick={handleRemoveSubGroup}
                                            />
                                            <span>{selected.subgroups}</span>
                                        </div>
                                        ): null}
                                    </div>
                                ): null}
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <CircularProgress />
                                    </div>
                                ): (
                                    contents?.map((content, index) => (
                                        <>
                                        <div 
                                            key={index} 
                                            className={`flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`content-${index}`}
                                                name={`content-${index}`}
                                                value={content._id}
                                                checked={selectedContent.includes(content._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedContent([...selectedContent, content._id]);
                                                    } else {
                                                        setSelectedContent(selectedContent.filter((id) => id !== content._id));
                                                    }
                                                }}
                                            />
                                            <div>
                                                <Image
                                                    src={content.thumbnailUrl}
                                                    alt='thumbnail'
                                                    width={50}
                                                    height={50}
                                                    className="rounded-md"
                                                    style={{
                                                        width: 'auto',
                                                        height: 'auto',
                                                    }}
                                                />

                                            </div>
                                            <div className="flex flex-col text-sm">
                                                <span>{content.title}</span>
                                                <div className="flex flex-row items-center gap-1">
                                                <span 
                                                    className="text-xs bg-red-500 text-white rounded-md px-1"
                                                    onClick={() => handleSelectSubCategory(content.subcategories)}
                                                >
                                                    {content?.subcategories?.title}
                                                </span>
                                                <span 
                                                    className="text-xs bg-blue-400 text-white rounded-md px-1"
                                                    onClick={() => handleSelectGroup(content.groups)}    
                                                >
                                                    {content?.groups?.name}
                                                </span>
                                                <span 
                                                    className="text-xs bg-yellow-500 text-white rounded-md px-1"
                                                    onClick={() => handleSelectSubGroup(content.subgroups)}
                                                >
                                                    {content?.subgroups?.name}
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                        </>
                                    )))}
                            </div>
                            
                            <div className="flex flex-col w-full min-h-[500px] max-h-[500px] p-2.5 gap-2 border-2 overflow-auto">
                                {selectedContent?.map((contentId, index) => (
                                    <div 
                                        key={index} 
                                        className="flex flex-row items-center gap-2 hover:bg-gray-100 px-2 py-1"
                                        onClick={() => setSelectedContent(selectedContent.filter((id) => id !== contentId))}
                                    >
                                        <IoIosCloseCircle 
                                            size={20} 
                                            onClick={() => setSelectedContent(selectedContent.filter((id) => id !== contentId))}
                                        />

                                        <Image
                                            src={contents?.find((content) => content._id === contentId)?.thumbnailUrl}
                                            alt='thumbnail'
                                            width={50}
                                            height={50}
                                            className="rounded-md"
                                            style={{
                                                width: 'auto',
                                                height: 'auto',
                                            }}
                                        />

                                        <label 
                                            htmlFor={`content-${index}`}
                                            className="text-sm"
                                        >
                                            {contents?.find((content) => content._id === contentId)?.title}
                                        </label>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-row justify-center items-center gap-2">
                        <button
                            className="bg-[#0056FF] text-white font-bold px-4 py-2 rounded-md"
                            onClick={handleSubmitPersonalized}
                        >
                            {loading ? "กําลังบันทึก..." : isEdit ? "แก้ไข" : "บันทึก"}
                        </button>

                        <button
                            className="bg-[#F2871F] text-white font-bold px-4 py-2 rounded-md"
                            onClick={handleClearPersonalized}
                        >
                            ยกเลิก
                        </button>
                    </div>


                </div> 
            </div>
            </Modal>
           )}
        </div>
        )
    );
};

export default ContentForm;
