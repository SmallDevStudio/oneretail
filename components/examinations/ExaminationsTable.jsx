import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaEdit } from "react-icons/fa";
import { IoQrCodeOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import moment from "moment";
import "moment/locale/th";
import Qrcode from "@/components/forms/Qrcode";
import Swal from "sweetalert2";

moment.locale('th');

export default function ExaminationsTable({ examinations, handleEditExamination, mutate }) {
    const [openQrCode, setOpenQrCode] = useState(false);
    const [url, setUrl] = useState(null);

    const { data: session } = useSession();

    const handleClickQr = (id) => {
        const url = `${window.location.origin}/examinations/form/${id}`;
        setUrl(url);
        setOpenQrCode(!openQrCode);
    };

    const handleCloseQr = () => {
        setOpenQrCode(!openQrCode);
        setUrl(null);
    };

    const handleDeleteExamination = async (id) => {
        const result = await Swal.fire({
            title: "คุณแน่ใจ?",
            text: "คุณต้องการลบข้อมูลนี้หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ใช่, ลบข้อมูลนี้!",
            cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`/api/examinations2/delete?id=${id}?userId=${session?.user?.id}`);
                mutate();
                await Swal.fire({
                    icon: "success",
                    title: "สําเร็จ",
                    text: "ลบข้อมูลสําเร็จ",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleActiveExamination = async (id, active) => {
        try {
            await axios.put(`/api/examinations2/active?id=${id}&active=${active}`);
            mutate();
            await Swal.fire({
                icon: "success",
                title: "สําเร็จ",
                text: "เปลี่ยนสถานะสําเร็จ",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full mt-2 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">ลําดับ</th>
                        <th className="px-4 py-2">ชื่อข้อสอบ</th>
                        <th className="px-4 py-2">รายละเอียด</th>
                        <th className="px-4 py-2">คำถาม</th>
                        <th className="px-4 py-2">กลุ่ม</th>
                        <th className="px-4 py-2">ตำแหน่ง</th>
                        <th className="px-4 py-2">วันที่สร้าง</th>
                        <th className="px-4 py-2">Active</th>
                        <th className="px-4 py-2">เครื่องมือ</th>
                    </tr>
                </thead>
                <tbody>
                    {examinations.map((examination, index) => (
                        <tr key={index} className="border-b text-center">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{examination?.title}</td>
                            <td className="px-4 py-2 text-left">{examination?.description}</td>
                            <td className="px-4 py-2">{Array.isArray(examination?.questions) ? examination?.questions?.length : 0}</td>
                            <td className="px-4 py-2">{examination?.group}</td>
                            <td className="px-4 py-2">{examination?.position}</td>
                            <td className="px-4 py-2">{moment(examination?.createdAt).format("DD/MM/YYYY")}</td>
                            <td className="px-4 py-2">{
                                examination?.active ? 
                                <div 
                                    onClick={() => handleActiveExamination(examination._id, !examination?.active)} 
                                    className="bg-green-500 text-white px-2 py-1 rounded-full cursor-pointer">
                                    ใช้งาน
                                </div>
                                : 
                                <div 
                                    className="bg-red-500 text-white px-2 py-1 rounded-full cursor-pointer"
                                    onClick={() => handleActiveExamination(examination._id, !examination?.active)}
                                >
                                    ไม่ใช้งาน
                                </div>
                            }</td>
                            <td className="px-4 py-2">
                                <div className="flex space-x-2 items-center justify-center">
                                    <FaEdit size={20} 
                                        className="text-blue-500 cursor-pointer" 
                                        onClick={() => handleEditExamination(examination)}  
                                    />
                                    <IoQrCodeOutline size={20} 
                                        className="text-black cursor-pointer"
                                        onClick={() => handleClickQr(examination._id)} 
                                    />
                                    <RiDeleteBin5Line 
                                        onClick={() => handleDeleteExamination(examination._id)} 
                                        size={20} 
                                        className="text-red-500 cursor-pointer" 
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
            {openQrCode && (
                <Qrcode
                    url={url}
                    open={openQrCode}
                    onClose={handleCloseQr}
                    text="OneRetail Examinations"
                    />
                )}
        </div>
    );
}