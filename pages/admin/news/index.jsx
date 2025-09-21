import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { DataGrid } from "@mui/x-data-grid";
import { Divider, Slide, Dialog } from "@mui/material";
import Loading from "@/components/Loading";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import NewsForm from "@/components/news/NewsForm";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function News() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const { data, error, mutate } = useSWR("/api/news/list", fetcher, {
    onSuccess: (data) => {
      setNews(data.data);
    },
  });

  if (!news) return <Loading />;

  const handleChangeActive = async (id, currentActive) => {
    try {
      const updated = { active: currentActive }; // toggle value ถูกส่งมาแล้ว
      await axios.put(`/api/news/${id}`, updated);
      toast.success("อัพเดทสถานะการใช้งานสำเร็จ");
      mutate();
    } catch (error) {
      toast.error("อัพเดทสถานะการใช้งานไม่สำเร็จ");
    }
  };

  const handleEdit = (news) => {
    setSelectedNews(news);
    setOpen(true);
  };

  const handleDelete = async (data) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการลบ!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const updateData = {
          ...data,
          deleted: true,
          delete_user: {
            userId: session.user.id,
            deletedAt: new Date().toISOString(),
          },
        };
        const res = await axios.put(`/api/news/${data._id}`, updateData);
        if (res.data.success) {
          toast.success("ลบข่าวสารเรียบร้อย");
          mutate();
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการลบข่าวสาร");
        console.log(error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedNews(null);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedNews(null);
    setOpen(false);
  };

  const columns = [
    {
      field: "cover",
      headerName: "รูปปก",
      width: 150,
      renderCell: (params) =>
        params.row.cover && params.row.cover.url ? (
          <div className="flex items-center justify-center h-full">
            <Image
              src={params.row.cover.url}
              alt="Cover"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <span>ไม่มีรูป</span>
        ),
    },
    { field: "title", headerName: "หัวข้อ", width: 300 },
    { field: "tab", headerName: "แท็บ", width: 150 },
    { field: "group", headerName: "กลุ่ม", width: 150 },
    {
      field: "start_date",
      headerName: "วันเริ่มต้น",
      width: 150,
      valueFormatter: (params) => {
        return moment(params.value).format("ll");
      },
    },
    {
      field: "end_date",
      headerName: "วันสิ้นสุด",
      width: 150,
      valueFormatter: (params) => {
        return moment(params.value).format("ll");
      },
    },
    {
      field: "active",
      headerName: "สถานะ",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              params.value ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
            onClick={() => handleChangeActive(params.row._id, params.value)}
          >
            {params.value ? "Active" : "Inactive"}
          </button>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "จัดการ",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full">
          <button
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2 h-10"
            onClick={() => handleEdit(params.row)}
          >
            แก้ไข
          </button>
          <button
            className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-10"
            onClick={() => handleDelete(params.row)}
          >
            ลบ
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold mb-4">ข่าวสาร</h1>
      </div>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-50"
          onClick={handleAdd}
        >
          เพิ่มข่าวสาร
        </button>
      </div>
      <DataGrid
        rows={news}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        getRowId={(row) => row._id}
      />

      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <NewsForm data={selectedNews} mutate={mutate} onClose={handleClose} />
      </Dialog>
    </div>
  );
}
