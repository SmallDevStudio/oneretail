import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Modal from "@/components/Modal";
import Qrcode from "@/components/forms/Qrcode";
import Header from "@/components/admin/global/Header";
import { useRouter } from "next/router";
import { AdminLayout } from "@/themes";
import Forms from "@/components/forms/Forms";
import View from "@/components/forms/View";
import Swal from "sweetalert2";
import { IoQrCodeOutline } from "react-icons/io5";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const FormsAdmin = () => {
    const [openForms, setOpenForms] = useState(false);
    const [openQr, setOpenQr] = useState(false);
    const [urlQr, setUrlQr] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [openView, setOpenView] = useState(false);

    const router = useRouter();

    const { data, error, mutate } = useSWR('/api/forms', fetcher);

    const handleEditForm = (form) => {
        setSelectedForm(form);
        setIsEdit(true);
        setOpenForms(!openForms);
    };

    const handleOpenForms = () => {
        setOpenForms(!openForms);
    };

    const handleCloseForms = () => {
        mutate();
        setIsEdit(false);
        setSelectedForm(null);
        setOpenForms(!openForms);
    };

    const onAddForm = () => {
        setIsEdit(false);
        setSelectedForm(null);
        setOpenForms(!openForms);
    }

    const onEditForm = () => {
        mutate();
        setIsEdit(false);
        setSelectedForm(null);
    };

    const handleStatus = async (id, status) => {

        const newStatus = status === true ? false : true;

        try {
            await axios.put('/api/forms/status', { formId: id, status: newStatus });
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenView = (form) => {
        setSelectedForm(form);
        setOpenView(!openView);
    }

    const handleCloseView = () => {
        setOpenView(!openView);
        setSelectedForm(null);
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this form? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/forms/${id}`);
                mutate();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleClickOpen = (id) => {
        return router.push(`/admin/forms/answer/${id}`);
    };

    const handleClickQr = (id) => {
        const url = `${window.location.origin}/forms/${id}`;
        setUrlQr(url);
        setOpenQr(!openQr);
    };
    const handleCloseQr = () => {
        setOpenQr(!openQr);
    };

    
    return (
        <div>
            <div>
                <Header title="Forms" subtitle="จัดการแบบฟอร์ม" />
            </div>
            <div className="flex flex-col p-5">
                <div>
                    <button
                        className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded"
                        onClick={onAddForm}
                    >
                        Add New Form
                    </button>
                </div>

                <table className="table-auto w-full text-sm mt-5">
                    <thead>
                        <tr className="bg-[#FF9800]/50">
                            <th className="px-4 py-2 w-20">ลำดับ</th>
                            <th className="px-4 py-2 w-1/6">ชื่อ</th>
                            <th className="px-4 py-2 w-2/6">รายละเอียด</th>
                            <th className="px-4 py-2 w-[80px]">ผู้สร้าง</th>
                            <th className="px-4 py-2 w-[80px]">สถานะ</th>
                            <th className="px-4 py-2 w-[150px]">วันที่สร้าง</th>
                            <th className="px-4 py-2 w-[150px]">วันที่แก้ไขล่าสุด</th>
                            <th className="px-4 py-2 w-28">QR</th>
                            <th className="px-4 py-2 w-1/6">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.data.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">{index + 1}</td>
                                <td className="border px-4 py-2">{item.title}</td>
                                <td className="border px-4 py-2  leading-2">{item.description}</td>
                                <td className="border px-4 py-2 ">
                                    <Image
                                        src={item.user.pictureUrl}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        className={`text-white font-bold py-1 px-2 rounded-full ${
                                            item.status
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                        onClick={() => handleStatus(item._id, item.status)}
                                    >
                                        {item.status ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {moment(item.createdAt).format("lll")}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {moment(item.updatedAt).format("lll")}
                                </td>
                                <td className="border px-4 py-2 text-center items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <IoQrCodeOutline 
                                            size={30}
                                            onClick={() => handleClickQr(item._id)}
                                        />
                                    </div>
                                </td>
                                <td className="border px-4 py-2 items-center justify-center text-center gap-2">
                                    <button
                                        className="bg-[#F2871F] text-white font-bold py-1 px-2 rounded-full mr-1"
                                        onClick={() => handleOpenView(item)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="bg-[#0056FF] text-white font-bold py-1 px-2 rounded-full mr-1"
                                        onClick={() => handleEditForm(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white font-bold py-1 px-2 rounded-full mr-1"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="bg-green-500 text-white font-bold py-1 px-2 rounded-full"
                                        onClick={() => handleClickOpen(item._id)}
                                    >
                                        Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openForms && 
                <Modal
                    open={openForms}
                    onClose={handleCloseForms}
                >
                    <Forms 
                        onclose={handleCloseForms}
                        form={selectedForm}
                        isEdit={isEdit}
                        onEditForm={onEditForm}
                    />
                </Modal>
            }
            {openView && 
                <Modal
                    open={openView}
                    onClose={handleCloseView}
                >
                    <View 
                        data={selectedForm} 
                        onClose={handleCloseView}
                    />
                </Modal>
            }
            {openQr && (
                <Qrcode
                    url={urlQr}
                    open={openQr}
                    onClose={handleCloseQr}
                />
            )}
           
        </div>
    );
};

export default FormsAdmin;

FormsAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
FormsAdmin.auth = true;