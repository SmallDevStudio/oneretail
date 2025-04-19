import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { Slide, Dialog } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { LuNotebookText } from "react-icons/lu";
import { FiUpload } from "react-icons/fi";
import EbookForm from "@/components/ebooks/EbookForm";
import { useSession } from "next-auth/react";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoQrCode } from "react-icons/io5";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Qrcode from "@/components/forms/Qrcode";
import UseEbookModal from "@/components/ebooks/UseEbookModal";
import { TbReportAnalytics } from "react-icons/tb";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Ebooks() {
  const [ebooks, setEbooks] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedUseEbook, setSelectedUseEbook] = useState([]);
  const [openUseEbook, setOpenUseEbook] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  const [urlQr, setUrlQr] = useState(null);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, error, mutate } = useSWR(`/api/ebook`, fetcher, {
    onSuccess: (data) => {
      setEbooks(data.data);
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [session, status]);

  const handleOpenUpload = () => {
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  const handleFileIcon = (type) => {
    if (type === "application/pdf") {
      return "/images/iconfiles/pdf.png";
    } else if (type === "application/msword") {
      return "/images/iconfiles/doc.png";
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "/images/iconfiles/doc.png";
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return "/images/iconfiles/xls.png";
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return "/images/iconfiles/ppt.png";
    }
  };

  const handleActiveToggle = async (id, active) => {
    try {
      await axios.put(`/api/ebook/${id}`, { active: !active });
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "คุณต้องการลบหนังสือนี้ใช่หรือไม่",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบให้ดี",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/ebook/${id}`);
        mutate();
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
      } catch (error) {
        console.error(error);
        toast.error("ลบไม่สําเร็จ");
      }
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Cover",
      width: 80,
      renderCell: (params) => {
        return params.value ? (
          <Image
            src={params.value}
            alt="Cover"
            width={50}
            height={50}
            className="rounded-md object-cover w-full h-full flex items-center justify-center"
          />
        ) : null;
      },
    },
    {
      field: "ebook",
      headerName: "Ebook",
      width: 80,
      renderCell: (params) => {
        const icon = handleFileIcon(params.row.type);
        return params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดไฟล์"
            className="w-full h-full flex items-center justify-center"
          >
            <Image src={icon} alt="file icon" width={30} height={30} />
          </a>
        ) : null;
      },
    },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "group", headerName: "Group", width: 150 },
    {
      field: "active",
      headerName: "Active",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-12">
          <button
            onClick={() => handleActiveToggle(params.row._id, params.value)}
            className={`px-2 py-1 rounded-full text-sm ${
              params.value ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {params.value ? "Active" : "Inactive"}
          </button>
        </div>
      ),
    },
    {
      field: "count",
      headerName: "Download Count",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            className="flex items-center justify-center cursor-pointer hover:text-[#0056FF] hover:font-bold"
            onClick={() =>
              handleSelectUseEbook(params.row.useEbook, params.row.title)
            }
          >
            <span>{params.value}</span>
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => {
        return <span>{moment(params.value).format("ll")}</span>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="flex flex-row items-center justify-center gap-4 h-full w-full">
            <IoQrCode
              size={25}
              className="text-[#0056FF] cursor-pointer"
              onClick={() => handleQrCode(params.row._id)}
            />
            <TbReportAnalytics
              size={28}
              className="text-green-500 cursor-pointer"
              onClick={() =>
                handleSelectUseEbook(params.row.useEbook, params.row.title)
              }
            />
            <RiDeleteBin5Line
              size={25}
              className="text-red-500 cursor-pointer"
              onClick={() => handleDelete(params.row._id)}
            />
          </div>
        );
      },
    },
  ];

  const handleQrCode = (id) => {
    setOpenQr(!openQr);
    setUrlQr(`${window.location.origin}/ebooks/${id}`);
  };

  const handleCloseQr = () => {
    setOpenQr(!openQr);
    setUrlQr(null);
  };

  const handleCloseUseEbook = () => {
    setOpenUseEbook(false);
  };

  const handleSelectUseEbook = (use, name) => {
    setSelectedUseEbook({
      useEbook: use,
      title: name,
    });
    setOpenUseEbook(true);
  };

  return (
    <div className="flex flex-col w-full p-4">
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <LuNotebookText size={30} className="text-[#0056FF]" />
        <h2 className="text-2xl font-bold text-[#0056FF]">Files Managements</h2>
      </div>

      {/* Tools */}
      <div className="flex flex-row items-center justify-between gap-2 mt-4">
        <div>
          <div
            className=" flex flex-row items-center px-6 py-2 bg-[#0056FF] text-white rounded-lg gap-2 cursor-pointer"
            onClick={handleOpenUpload}
          >
            <FiUpload size={20} className="font-bold" />
            <span className="font-bold">Upload</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="mt-6" style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={ebooks}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row._id}
            disableSelectionOnClick
          />
        </div>
      </div>

      <Dialog
        open={openUpload}
        onClose={handleCloseUpload}
        TransitionComponent={Transition}
        className="flex items-center justify-center"
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw",
            height: "auto",
            maxWidth: "100% !important",
            maxHeight: "100% !important",
          },
        }}
      >
        <EbookForm onClose={handleCloseUpload} userId={userId} />
      </Dialog>

      {openQr && (
        <Qrcode
          open={openQr}
          onClose={handleCloseQr}
          url={urlQr}
          text="Ebook"
        />
      )}
      <Dialog
        fullScreen
        open={openUseEbook}
        onClose={handleCloseUseEbook}
        TransitionComponent={Transition}
      >
        <UseEbookModal
          onClose={handleCloseUseEbook}
          useEbook={selectedUseEbook}
        />
      </Dialog>
    </div>
  );
}
