"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { AdminLayout } from "@/themes";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "moment/locale/th";
import * as XLSX from 'xlsx';
import useMedia from "@/lib/hook/useMedia";
import Swal from "sweetalert2";

const RedeemPage = () => {
  const [redeems, setRedeems] = useState([]);
  const [redeemTrans, setRedeemTrans] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [form, setForm] = useState({
    rewardCode: "",
    name: "",
    description: "",
    image: "",
    stock: 0,
    coins: 0,
    point: 0,
    status: "true",
    type: "",
    creator: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("redeem");
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { add, delete: deleteMedia } = useMedia();

  const fileUploadRef = useRef(null);

  useEffect(() => {
    fetchRedeems();
    fetchRedeemTrans();
  }, []);

  const fetchRedeems = async () => {
    const res = await axios.get("/api/redeem");
    setRedeems(res.data.data);
  };

  const fetchRedeemTrans = async () => {
    const res = await axios.get("/api/redeemtran");
    setRedeemTrans(
      res.data.data.map((trans, index) => ({
        ...trans,
        id: trans._id,
        seq: index + 1,
        rewardCode: trans?.redeemId?.rewardCode,
        image: trans?.redeemId?.image,
        name: trans?.redeemId?.name,
        empId: trans?.user?.empId,
        fullname: trans?.user?.fullname,
        pictureUrl: trans?.user?.pictureUrl,
        address: trans?.user?.address,
      }))
    );
  };


  const handleFileChange = async (e) => {
    const folder = "redeem";
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const result = await add(file, userId, folder);
      console.log('Media added:', result); // { publicId, url, type }
      setMedia((prevMedia) => [...prevMedia, result]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeliver = async () => {
    await Promise.all(
      selectedRows.map(async (rowId) => {
        const redeemTran = redeemTrans.find((trans) => trans.id === rowId);
        await axios.post("/api/delivery", {
          redeemTransId: rowId,
          userId: redeemTran.userId,
          creator: userId,
        });
      })
    );
    fetchRedeemTrans();
  };

  const handlePrint = () => {
    const selectedData = redeemTrans.filter((trans) => selectedRows.includes(trans.id));
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write('<h1>Redeem Transactions</h1>');
    printWindow.document.write('<table border="1"><tr><th>ลำดับ</th><th>Reward Code</th><th>Name</th><th>EmpId</th><th>Full Name</th><th>Address</th></tr>');
  
    selectedData.forEach((trans) => {
      printWindow.document.write(
        `<tr>
          <td>${trans.seq}</td>
          <td>${trans.rewardCode}</td>
          <td>${trans.name}</td>
          <td>${trans.empId}</td>
          <td>${trans.fullname}</td>
          <td>${trans.address}</td>
        </tr>`
      );
    });
  
    printWindow.document.write('</table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleExport = () => {
    const selectedData = redeemTrans.filter((trans) => selectedRows.includes(trans.id));
    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Redeem Transactions");
    XLSX.writeFile(wb, "redeem_transactions.xlsx");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const generateRewardCode = () => {
    if (redeems.length === 0) {
      return "ttb0001";
    }
    const lastRedeem = redeems[redeems.length - 1];
    const lastCode = lastRedeem ? lastRedeem.rewardCode : "ttb0000";
    const lastNumber = parseInt(lastCode.replace("ttb", ""), 10);
    const newNumber = lastNumber + 1;
    return `ttb${String(newNumber).padStart(4, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedForm = {
      ...form,
      image: media[0]?.url,
      creator: userId,
    };
    if (isEdit) {
      await axios.put("/api/redeem", { ...formattedForm, id: editId });
    } else {
      const newRewardCode = generateRewardCode();
      console.log("newRewardCode", newRewardCode, "formattedForm", formattedForm);
      await axios.post("/api/redeem", {
        ...formattedForm,
        rewardCode: newRewardCode,
      });
      setForm({ ...form, rewardCode: newRewardCode });
    }
    fetchRedeems();
    setForm({
      rewardCode: "",
      name: "",
      description: "",
      image: "",
      stock: 0,
      coins: 0,
      point: 0,
      status: "true",
      type: "",
    });
    setIsEdit(false);
    setEditId(null);
    setMedia(null);
  };

  const handleEdit = (redeem) => {
    setForm({
      rewardCode: redeem.rewardCode,
      name: redeem.name,
      description: redeem.description,
      image: redeem.image,
      stock: redeem.stock,
      coins: redeem.coins,
      point: redeem.point,
      status: redeem.status,
      type: redeem.type,
      creator: redeem.creator,
    });
    setIsEdit(true);
    setEditId(redeem._id);
  };

  const handleDelete = async (data) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
        try {
            const response = await axios.delete(`/api/redeem`, {
                params: { id: data._id },
            });
            console.log(response.data);
            fetchRedeems(); // Refresh the list after deletion
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.message || "Failed to delete.", "error");
        }
    }
};

  const handleCancel = () => {
    setForm({
      rewardCode: "",
      name: "",
      description: "",
      image: "",
      stock: 0,
      coins: 0,
      point: 0,
      status: "true",
      type: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const redeemColumns = [
    { field: "rewardCode", headerName: "Reward Code", width: 100 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Image src={params.value} width={50} height={50} alt={params.row.name} />
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "coins", headerName: "Coins", width: 100 },
    { field: "point", headerName: "Points", width: 100 },
    {
      field: "creator",
      headerName: "Creator",
      width: 100,
      renderCell: (params) => (
        <Image src={params.value} width={50} height={50} alt="Creator" />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => moment(params.value).locale("th").format("DD/MM/YYYY HH:mm"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-500"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </button>
          <button
            className="text-red-500"
            onClick={() => handleDelete(params.row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const redeemTransColumns = [
    { field: "seq", headerName: "ลำดับ", width: 80 },
    { field: "rewardCode", headerName: "Reward Code", width: 100 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Image src={params.value} width={50} height={50} alt={params.row.name} />
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 150,
    },
    {
      field: "pictureUrl",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => (
        <Image src={params.value} width={50} height={50} alt={params.row.fullname} className="rounded-full" />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => moment(params.value).locale("th").format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">จัดการแลกของรางวัล</h1>
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "redeem" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("redeem")}
          >
            จัดการของรางวัล
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "redeemTrans" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("redeemTrans")}
          >
            ของรางวัลที่แลกแล้ว
          </button>
        </div>
        {activeTab === "redeem" ? (
          <>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={redeems}
                columns={redeemColumns}
                pageSize={10}
                getRowId={(row) => row._id}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
              <h2 className="text-xl font-bold mb-4">{isEdit ? "แก้ไข" : "เพิ่ม"} รางวัล</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-5 gap-1">
                  <div className="col-span-1">
                    <label className="block text-gray-700 font-bold mb-2">Reward Code:</label>
                    <input
                      type="text"
                      name="rewardCode"
                      value={form.rewardCode}
                      onChange={handleInputChange}
                      placeholder="Reward Code"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-gray-700 font-bold mb-2">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Description:</label>
                  <textarea
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                  />
                </div>
                <div>
                  {media && media.length > 0 && (
                    <Image
                      src={media[0].url}
                      width={200}
                      height={200}
                      alt={media.name}
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  )}
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => fileUploadRef.current.click()}
                  >
                    upload Image
                  </button>

                  {/* ซ่อน input file แต่ใช้ ref เพื่อให้มันทำงานเมื่อกดปุ่ม */}
                  <input
                        ref={fileUploadRef}
                        type="file"
                        multiple // สามารถเลือกหลายไฟล์ได้
                        accept="image/*,video/*" // จำกัดชนิดของไฟล์
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // ซ่อน input file
                    />
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <div className="col-span-1">
                    <label className="block text-gray-700 font-bold mb-2">Stock:</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleInputChange}
                      placeholder="Stock"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    <label className="block text-gray-700 font-bold mb-2">Coins:</label>
                    <input
                      type="number"
                      name="coins"
                      value={form.coins}
                      onChange={handleInputChange}
                      placeholder="Coins"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-gray-700 font-bold mb-2">Points:</label>
                    <input
                      type="number"
                      name="point"
                      value={form.point}
                      onChange={handleInputChange}
                      placeholder="Points"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Type:</label>
                  <input
                    type="number"
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    placeholder="Type"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex flex-row justify-center items-center gap-2 w-full">
                  <button
                    type="submit"
                    className="w-[50%] px-4 py-2 bg-green-500 text-white rounded-full"
                  >
                    {isEdit ? "อัปเดต" : "เพิ่ม"}
                  </button>
                  <button
                    className="w-[50%] px-4 py-2 bg-red-500 text-white rounded-full ml-2"
                    onClick={handleCancel}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={redeemTrans}
                columns={redeemTransColumns}
                pageSize={10}
                checkboxSelection
                onSelectionModelChange={(ids) => {
                  console.log("Selected Rows:", ids); // Debugging statement
                  setSelectedRows(ids);
                }}
                onRowSelectionModelChange={(ids) => {
                  console.log("Selected Rows (Alternate):", ids); // Debugging statement
                  setSelectedRows(ids);
                }}
              />
            </div>
            {selectedRows.length > 0 && (
              <div className="mt-4">
                <button onClick={handleDeliver} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Deliver</button>
                <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Print</button>
                <button onClick={handleExport} className="bg-yellow-500 text-white px-4 py-2 rounded">Export</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

RedeemPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

RedeemPage.auth = true;

export default RedeemPage;
