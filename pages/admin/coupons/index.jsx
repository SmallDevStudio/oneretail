import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CouponForm from "@/components/coupons/CouponForm";
import { Divider, Slide, Dialog } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import Header from "@/components/admin/global/Header";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { IoIosCloseCircle } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { RiCoupon3Line } from "react-icons/ri";
import CouponPanal from "@/components/coupons/CouponPanal";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CouponAdmin() {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);

  const { data: session } = useSession();

  const { data, error, mutate } = useSWR(`/api/coupons`, fetcher, {
    onSuccess: (data) => {
      // แปลง coupons ให้ทุกตัวมี `id` เป็น `_id`
      const formattedCoupons = data.data.map((coupon) => ({
        ...coupon,
        id: coupon._id, // ใช้ _id เป็น id
        createdAt: moment(coupon.createdAt).format("ll"), // แปลงวันที่
        updatedAt: moment(coupon.updatedAt).format("ll"),
      }));
      setCoupons(formattedCoupons);
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
    setSelectedCoupon(null);
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loading />;

  const handleActiveToggle = async (code, active) => {
    try {
      await axios.put(`/api/coupons/${code}`, { active: !active });
      toast.success("เปลี่ยนสถานะสําเร็จ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      mutate();
    } catch (error) {
      console.error(error);
      toast.error("เปลี่ยนสถานะไม่สําเร็จ");
    }
  };

  const handleEdit = (row) => {
    setSelectedCoupon(row);
    handleClickOpen();
  };

  const handleDelete = async (code) => {
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
        await axios.delete(`/api/coupons/${code}`);
        toast.success("ลบสําเร็จ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        mutate();
      } catch (error) {
        console.error(error);
        toast.error("ลบไม่สําเร็จ");
      }
    }
  };

  const columns = [
    { field: "code", headerName: "รหัส", width: 200 },
    { field: "description", headerName: "รายละเอียด", width: 500 },
    { field: "stock", headerName: "จำนวน", width: 100 },
    { field: "amount", headerName: "คงเหลือ", width: 100 },
    {
      field: "active",
      headerName: "Active",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-12">
          <button
            onClick={() => handleActiveToggle(params.row.code, params.value)}
            className={`px-2 py-1 rounded-full text-sm ${
              params.value ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {params.value ? "Active" : "Inactive"}
          </button>
        </div>
      ),
    },
    { field: "createdAt", headerName: "วันที่สร้าง", width: 200 },
    {
      field: "Tools",
      headerName: "เครื่องมือ",
      width: 300,
      renderCell: (params) => (
        <div className="flex flex-row items-center justify-center gap-4 h-full w-full">
          <FaRegEdit
            size={25}
            className="text-[#0056FF] cursor-pointer"
            onClick={() => handleEdit(params.row)}
          />

          <RiDeleteBinLine
            size={25}
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(params.row.code)}
          />
        </div>
      ),
    },
  ];

  const handleOpenCoupon = () => {
    setOpenCoupon(true);
  };

  const handleCloseCoupon = () => {
    setOpenCoupon(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div>
        <Header
          title="คูปอง"
          subtitle="จัดการคูปอง"
          handleClickOpen={handleClickOpen}
        />
      </div>
      <div className="flex flex-col px-5">
        <div className="flex flex-row items-center justify-between w-full mb-2">
          <button
            onClick={handleClickOpen}
            className="px-4 py-2 bg-[#0056FF] text-white rounded-full"
          >
            สร้างคูปอง
          </button>
          <RiCoupon3Line
            size={25}
            className="text-[#0056FF]"
            onClick={handleOpenCoupon}
          />
        </div>

        {/* Table */}
        <DataGrid
          rows={coupons}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
        />
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClickClose}
        fullWidth={true}
        maxWidth="md"
      >
        <CouponForm
          onClose={handleClickClose}
          mutate={mutate}
          data={selectedCoupon}
          newCoupon={!selectedCoupon}
        />
      </Dialog>

      <Dialog
        open={openCoupon}
        TransitionComponent={Transition}
        onClose={handleCloseCoupon}
        fullWidth={true}
        maxWidth="md"
      >
        <CouponPanal onClose={handleCloseCoupon} mutate={mutate} />
      </Dialog>
    </div>
  );
}
