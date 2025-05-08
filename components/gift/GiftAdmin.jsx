import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import { Dialog, Slide, Divider } from "@mui/material";
import GiftForm from "./GiftForm";
import { DataGrid } from "@mui/x-data-grid";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function GiftAdmin() {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const { data, error, mutate } = useSWR("/api/gift", fetcher, {
    onSuccess: (data) => {
      setGifts(data.data);
    },
  });

  const handleEdit = (row) => {
    setSelectedGift(row);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการลบ!",
    });

    if (result.isConfirmed) {
      await axios.delete(`/api/gift/${id}`);
      await mutate();
      toast.success("ลบขวัญสําเร็จ");
    }
  };

  const columes = [
    {
      field: "image",
      headerName: "รูปภาพ",
      width: 200,
      renderCell: (params) => {
        return (
          <Image
            src={params.row.image.url}
            alt={params.row.name}
            width={100}
            height={100}
            className="object-contain w-full h-full p-2"
          />
        );
      },
    },
    { field: "code", headerName: "โค้ด", width: 100 },
    { field: "name", headerName: "ชื่อ", width: 300 },
    { field: "description", headerName: "รายละเอียด", width: 300 },
    { field: "price", headerName: "ราคา", width: 100 },
    {
      field: "tools",
      headerName: "เครื่องมือ",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
            <FaEdit
              size={25}
              className="text-[#0056FF]"
              onClick={() => handleEdit(params.row)}
            />
            <FaRegTrashAlt
              size={25}
              className="text-red-500"
              onClick={() => handleDelete(params.row._id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl text-[#0056FF] font-bold">
        จัดการของขวัญปีใหม่ 2567
      </h2>
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full mt-2">
        <button
          className="bg-[#0056FF] text-white px-2 py-2 rounded-lg"
          onClick={() => setOpenForm(true)}
        >
          เพิ่มของขวัญ
        </button>
        <div>
          <input
            type="text"
            placeholder="ค้นหาของขวัญ"
            className="border border-gray-300 rounded-lg px-2 py-1"
          />
        </div>
      </div>

      <div className="w-full mt-4">
        <DataGrid
          rows={gifts}
          columns={columes}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
        />
      </div>

      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenForm(false)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "unset",
          },
        }}
      >
        <div className="flex flex-col w-full">
          <GiftForm
            onClose={() => setOpenForm(false)}
            gift={selectedGift}
            mutate={mutate}
          />
        </div>
      </Dialog>
    </div>
  );
}
