import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import Loading from "@/components/Loading";
import { FaPlusCircle, FaEdit } from "react-icons/fa"
import { MdOutlinePageview } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

moment.locale("th");

const fetcher = url => axios.get(url).then(res => res.data);

const Galleries = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(false);

    const { data, error, mutate, isValidating, isLoading } = useSWR("/api/gallery", fetcher,{
        onSuccess: (data) => {
            setGallery(data.data);
        },
    });

    if (error) return <div>failed to load</div>;
    if (isLoading || !data) return <Loading />;

    console.log('gallery:', gallery);

    return (
        <div className="flex flex-col p-4 w-full">
            <Header title={"จัดการคลังรูปภาพ"} subtitle="จัดการข้อมูลคลังรูปภาพ" />

            <div className="flex mb-4">
                <button
                    className="p-2 bg-[#0056FF] text-white rounded-lg"
                >
                    <div className="flex flex-row text-sm items-center gap-2">
                        <FaPlusCircle size={20}/>
                        <span className="font-bold">เพิ่มโฟลเดอร์</span>
                    </div>
                </button>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-200 border text-center">
                        <th className="border px-2 py-1 w-10">ลำดับ</th>
                        <th className="border px-2 py-1">ชื่อ</th>
                        <th className="border px-2 py-1">รายละเอียด</th>
                        <th className="border px-2 py-1 w-25">ซับโฟลเดอร์</th>
                        <th className="border px-2 py-1">วันที่</th>
                        <th className="border px-2 py-1">Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {gallery.map((item, index) => (
                        <tr key={item.id} className="border text-center text-sm">
                            <td className="border px-2 py-1">{index + 1}</td>
                            <td className="border px-2 py-1">{item.title}</td>
                            <td className="border px-2 py-1">{item.description}</td>
                            <td className="border px-2 py-1">{item.folder}</td>
                            <td className="border px-2 py-1">
                                {moment(item.created_at).format("LL")}
                            </td>
                            <td className="border px-2 py-1">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <FaEdit size={20} className="text-blue-500"/>
                                    <MdOutlinePageview size={22} className="text-green-500"/>
                                    <RiDeleteBinLine size={20} className="text-red-500"/>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Galleries;

Galleries.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Galleries.auth = true;