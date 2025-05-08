import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import { Dialog, Slide, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import BudgetForm from "./BudgetForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function BudgetAdmin() {
  const [budget, setBudget] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const { data, error, mutate } = useSWR("/api/gift/budget", fetcher, {
    onSuccess: (data) => {
      const indexed = data.data.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      setBudget(indexed);
    },
  });

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
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
      await axios.delete(`/api/gift/budget/${id}`);
      await mutate();
      toast.success("ลบขวัญสําเร็จ");
    }
  };

  const columes = [
    {
      field: "No",
      headerName: "ลำดับ",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
            {params.row.index}
          </div>
        );
      },
    },
    { field: "branch", headerName: "สาขา", width: 300 },
    { field: "rh", headerName: "RH", width: 100 },
    { field: "zone", headerName: "Zone", width: 300 },
    { field: "br", headerName: "BR", width: 100 },
    {
      field: "budget",
      headerName: "งบประมาณ",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
            {params.row.budget.toFixed(2)}
          </div>
        );
      },
    },
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
      <h2 className="text-xl text-[#0056FF] font-bold">จัดการงบประมาณ</h2>
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full mt-2">
        <button
          className="bg-[#0056FF] text-white px-2 py-2 rounded-lg"
          onClick={() => setOpenForm(true)}
        >
          เพิ่มสาขา
        </button>
        <div>
          <input
            type="text"
            placeholder="ค้นหาสาขา"
            className="border border-gray-300 rounded-lg px-2 py-1"
          />
        </div>
      </div>

      <div className="w-full mt-4">
        <DataGrid
          rows={budget}
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
          <BudgetForm
            onClose={() => setOpenForm(false)}
            budget={selectedBudget}
            mutate={mutate}
          />
        </div>
      </Dialog>
    </div>
  );
}
