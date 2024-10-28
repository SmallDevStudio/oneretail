"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "moment/locale/th";
import useMedia from "@/lib/hook/useMedia";
import Swal from "sweetalert2";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from "@/components/Modal";
import DatePicker, { registerLocale } from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS
import th from "date-fns/locale/th"; // Import Thai locale for DatePicker
import { Tooltip } from '@mui/material';

// Register Thai locale for the DatePicker
registerLocale('th', th);

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const Redeems = () => {
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
    group: "",
    expireDate: null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("redeem");
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useState(null);
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { add } = useMedia();

  const fileUploadRef = useRef(null);

  useEffect(() => {
    fetchRedeemTrans();
  }, []);

  const { data: redeem, mutate: mutateRedeem } = useSWR('/api/redeem/table', fetcher, {
    onSuccess: (data) => {
      // Sort the data by customOrder
      const sortedData = data.data.sort((a, b) => a.customOrder - b.customOrder);
      setRedeems(sortedData);
    }
  });

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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
      group: "",
      expireDate: null,
    });
    setIsEdit(false);
    setOpen(false);
  };

  const handleUploadImageClick = (e) => {
    e.preventDefault(); // Prevent default behavior
    fileUploadRef.current.click(); // Trigger file input click
  };


  const handleFileChange = async (e) => {
    const folder = "redeem";
    const file = e.target.files[0];
    setIsUploading(true);
    try {
        const result = await add(file, userId, folder);
        console.log('Media added:', result); // { publicId, url, type }

        // Set the image URL directly in the form state
        setForm((prevForm) => ({
            ...prevForm,
            image: result.url,
        }));

        setMedia(result);
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const generateRewardCode = () => {
    if (redeems.length === 0) {
        return "ttb0001";
    }

    // Extract all reward numbers from existing codes
    const numbers = redeems.map((redeem) => {
        const code = redeem.rewardCode.replace("ttb", "");
        return parseInt(code, 10);
    });

    // Find the maximum number and increment it
    const maxNumber = Math.max(...numbers);
    const newNumber = maxNumber + 1;

    // Generate the new reward code
    return `ttb${String(newNumber).padStart(4, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the form data to submit
    const formattedForm = {
        ...form,
        image: form.image || media?.url, // Use the form's image if it exists, else use the new media URL
        creator: userId,
        customOrder: redeems.length + 1,
        currentStock: form.stock,
        expireDate: form.expireDate ? new Date(form.expireDate).toISOString() : null,
    };

    if (isEdit) {
        try {
            const response = await axios.put("/api/redeem", { ...formattedForm, id: editId });
            console.log(response.data);
            mutateRedeem();
            setIsEdit(false);
            setEditId(null);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("Adding:", formattedForm);
        const newRewardCode = generateRewardCode();
        try {
            await axios.post("/api/redeem", {
                ...formattedForm,
                rewardCode: newRewardCode,
            });
            mutateRedeem();
        } catch (error) {
            console.error(error);
        }
    }

    // Clear the form after submission
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
        group: "",
        expireDate: null,
    });

    setMedia(null); // Clear media state
    setOpen(false);

    fileUploadRef.current.value = null;
  };

  const handleEdit = (redeem) => {
    setForm({
        rewardCode: redeem.rewardCode,
        name: redeem.name,
        description: redeem.description,
        image: redeem.image, // Set the current image URL
        stock: redeem.stock,
        coins: redeem.coins,
        point: redeem.point,
        status: redeem.status,
        type: redeem.type,
        creator: redeem.creator,
        group: redeem.group,
        customOrder: redeem.customOrder,
        currentStock: redeem.currentStock,
        expireDate: redeem.expireDate? redeem.expireDate : null,
    });
    setMedia({ url: redeem.image }); // Set the media with the current image URL
    setIsEdit(true);
    setEditId(redeem._id);
    setOpen(true);
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
      group: "",
      expireDate: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const handleUpdateStatus = async (data) => {
    // Toggle the status as a Boolean
    const newStatus = !data.status;
    
    try {
        const response = await axios.put(`/api/redeem/${data._id}`, {
            status: newStatus,
        });
        console.log(response.data);

        // Refresh the data after the update
        mutateRedeem();
    } catch (error) {
        console.error('Error updating status:', error);
    }
  };

  const handleCustomOrderChange = (data, value) => {
    setRedeems((prevRedeems) =>
      prevRedeems.map((redeem) =>
        redeem._id === data._id ? { ...redeem, customOrder: value } : redeem
      )
    );
  };

  const handleCustomOrderKeyDown = async (event, data, value) => {
    if (event.key === "Enter") {
      try {
        const response = await axios.put(`/api/redeem/${data._id}`, {
          customOrder: value,
        });
        console.log(response.data);
        mutateRedeem();
        setShowTooltip(null); // ซ่อน Tooltip หลังจากอัปเดตข้อมูลสำเร็จ
      } catch (error) {
        console.error("Error updating customOrder:", error);
      }
    }
  };

  if (!redeem) return <div>Loading...</div>;

  const redeemColumns = [
    { field: "rewardCode", headerName: "Reward Code", width: 100 },
    {
        field: "customOrder",
        headerName: "CustomOrder",
        width: 100,
        renderCell: (params) => {
          return (
            <Tooltip
              open={showTooltip === params.row._id} // แสดง Tooltip เฉพาะแถวที่ถูกคลิก
              title="เมื่อแก้ไขแล้วกด Enter เพื่อบันทึกการเปลี่ยนแปลง"
              arrow
              placement="top"
            >
              <input
                type="number"
                value={params.value}
                onChange={(e) =>
                  handleCustomOrderChange(params.row, e.target.value)
                }
                onKeyDown={(e) =>
                  handleCustomOrderKeyDown(e, params.row, e.target.value)
                }
                onFocus={() => setShowTooltip(params.row._id)} // แสดง Tooltip เฉพาะแถวที่ถูก focus
                onBlur={() => setShowTooltip(null)} // ซ่อน Tooltip เมื่อออกจาก input
              />
            </Tooltip>
          );
        },
      },
    {
        field: "image",
        headerName: "Image",
        width: 100,
        renderCell: (params) => (
            params.value ? (
                <Image src={params.value} width={50} height={50} alt={params.row.name} />
            ) : (
                <div>No Image</div>
            )
        ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "coins", headerName: "Coins", width: 100 },
    { field: "point", headerName: "Points", width: 100 },
    { field: "group", headerName: "Group", width: 100 },
    {
      field: "expireDate",
      headerName: "Expired Date",
      width: 150,
      renderCell: (params) => params.value ? moment(params.value).locale("th").format("DD/MM/YYYY") : "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
          const isActive = params.value === true; // Check if the value is true (Boolean)
          const statusText = isActive ? "Active" : "Inactive";
          const bgColor = isActive ? "bg-green-500" : "bg-red-500";
  
          return (
              <div
                  className={`${bgColor} text-white rounded-md items-center text-center cursor-pointer`}
                  onClick={() => handleUpdateStatus(params.row)}
              >
                  {statusText}
              </div>
          );
      },
    },
    {
        field: "creator",
        headerName: "Creator",
        width: 100,
        renderCell: (params) => (
            params.value ? (
                <Image src={params.value} width={50} height={50} alt="Creator" />
            ) : (
                <div>No Creator</div>
            )
        ),
    },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 150,
        renderCell: (params) => (
            params.value ? moment(params.value).locale("th").format("DD/MM/YYYY HH:mm") : "N/A"
        ),
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <div className="flex space-x-2">
                <button
                    className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded h-10 items-center text-center cursor-pointer"
                    onClick={() => handleEdit(params.row)}
                >
                    Edit
                </button>
                <button
                    className="flex bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded h-10 items-center text-center cursor-pointer"
                    onClick={() => handleDelete(params.row)}
                >
                    Delete
                </button>
            </div>
        ),
    },
];


  return (
    <div className="p-4 text-sm">
          <>
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
              onClick={handleOpen}
            >
              เพิ่ม
            </button>
          </div>
          <div style={{ height: "600px", width: "100%" }}>
              <DataGrid
                rows={redeems}
                columns={redeemColumns}
                pageSize={10}
                getRowId={(row) => row._id}
              />
          </div>

            {open && (
              <Modal
                open={open}
                onClose={handleClose}
              >
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
                      <div className="flex flex-col w-1/3 gap-2">
                        {isUploading && (
                            <div className="flex justify-center items-center">
                                <CircularProgress />
                            </div>
                        )}

                        {media && (
                            <Image
                                src={media.url}
                                width={200}
                                height={200}
                                alt={media.name}
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                        )}
                        <button 
                            type="button" // Ensure the button is not of type "submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleUploadImageClick} // Use the new function
                        >
                            Upload Image
                        </button>

                        {/* Hidden file input */}
                        <input
                            ref={fileUploadRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                      </div>
                      <div className="flex flex-row items-center gap-4">
                        <label className="block text-gray-700 font-bold mb-2">Expire Date:</label>
                        <DatePicker
                          selected={form.expireDate}
                          onChange={(date) => setForm({ ...form, expireDate: date })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          dateFormat="dd/MM/yyyy" // Display format
                          locale="th" // Use Thai locale
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <div className="flex flex-row items-center gap-2 col-span-1">
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
                          <div className="flex flex-row items-center gap-2 col-span-1">
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
                          <div className="flex flex-row items-center gap-2 col-span-1">
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
                      <div className="flex flex-row items-center gap-4">
                        <div className="flex flex-row items-center gap-2 w-full">
                          <label className="block text-gray-700 font-bold mb-2">Type:</label>
                          <input
                            type="text"
                            name="type"
                            value={form.type}
                            onChange={handleInputChange}
                            placeholder="Type"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full">
                          <label className="block text-gray-700 font-bold mb-2">Group:</label>
                          <input
                            type="text"
                            name="group"
                            value={form.group}
                            onChange={handleInputChange}
                            placeholder="Group"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
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
                </Modal>
            )}
          </>
       
    </div>
  );
};

export default Redeems;



