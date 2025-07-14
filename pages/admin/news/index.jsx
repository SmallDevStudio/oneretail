import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
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

  const { data, error, mutate } = useSWR("/api/news/list", fetcher, {
    onSuccess: (data) => {
      setNews(data.data);
    },
  });

  if (!news) return <Loading />;

  const columns = [
    { field: "title", headerName: "หัวข้อ", width: 300 },
    { field: "group", headerName: "กลุ่ม", width: 150 },
    { field: "start_date", headerName: "วันเริ่มต้น", width: 150 },
    { field: "end_date", headerName: "วันสิ้นสุด", width: 150 },
    { field: "active", headerName: "สถานะ", width: 150 },
    {
      field: "actions",
      headerName: "จัดการ",
      width: 150,
      renderCell: (params) => (
        <div className="flex">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => handleEdit(params.row)}
          >
            แก้ไข
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleDelete(params.row._id)}
          >
            ลบ
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (news) => {
    setSelectedNews(news);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/news/${id}`);
      if (res.data.success) {
        toast.success("ลบข่าวสารเรียบร้อย");
        mutate();
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการลบข่าวสาร");
      console.log(error);
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
        checkboxSelection
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
