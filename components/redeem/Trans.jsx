"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "moment/locale/th";
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import Divider from '@mui/material/Divider';
import { IoClose } from "react-icons/io5";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const Trans = () => {
  const [redeemTrans, setRedeemTrans] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    Padding: false,
    Deliver: false,
    Done: false,
  });
  const [search, setSearch] = useState('');

  const { data: session } = useSession();
  const userId = session?.user?.id;

  console.log(redeemTrans);

  useEffect(() => {
    fetchRedeemTrans();
  }, []);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [selectedRows]);


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


  const handleStatus = async (status) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      text: `คุณต้องการเปลี่ยนสถานะ ${status} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      await Promise.all(
        selectedRows.map(async (rowId) => {
          const redeemTran = redeemTrans.find((trans) => trans.id === rowId);
          await axios.post("/api/redeem/status", {
            redeemTransId: rowId,
            userId: redeemTran.userId,
            status: status,
            creator: userId,
          });
        })
      );
      fetchRedeemTrans();
    }
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

  console.log(redeemTrans);
  const handleExport = () => {
    // ตรวจสอบเงื่อนไขวันที่
    if (!startDate || !endDate) {
      setError("กรุณาระบุวันที่เริ่มต้นและวันที่สิ้นสุด");
      return;
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (end < start) {
      setError("วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น");
      return;
    }
  
    // หากเงื่อนไขถูกต้อง ให้เคลียร์ error
    setError("");
  
    // กรองข้อมูลตามวันที่ startDate และ endDate
    const filteredData = redeemTrans.filter((trans) => {
      const createdAt = new Date(trans.createdAt);
      return createdAt >= start && createdAt <= end;
    });
  
    // **Sheet 1: Redeem Transactions**
    const exportData = filteredData.map((trans) => ({
      ลำดับ: trans.seq,
      'Reward Code': trans.rewardCode,
      Name: trans.name,
      Group: trans.redeemId?.group || "",
      EmpId: trans.empId,
      'Full Name': trans.fullname,
      Address: trans.address,
      Status: trans.status,
      'Created At': moment(trans.createdAt).locale("th").format("DD/MM/YYYY HH:mm"),
    }));
  
    // **Sheet 2: Reward Code Counts**
    const rewardCounts = filteredData.reduce((acc, trans) => {
      const rewardCode = trans.rewardCode;
      const name = trans.name;
      const group = trans.redeemId?.group || "";

      if (!acc[rewardCode]) {
        acc[rewardCode] = { rewardCode, name, group, count: 0 };
      }
      acc[rewardCode].count += 1;
      return acc;
    }, {});
  
    const countData = Object.values(rewardCounts)
    .sort((a, b) => b.count - a.count) // เรียงจากมากไปน้อย
    .map((item, index) => ({
      ลำดับ: index + 1,
      'Reward Code': item.rewardCode,
      Name: item.name,
      Group: item.group || "",
      จำนวน: item.count,
    }));
  
    // **Sheet 3: Count by EmpId**
    const empCounts = filteredData.reduce((acc, trans) => {
      const empId = trans.empId;
      if (!acc[empId]) {
        acc[empId] = {
          empId,
          fullname: trans.fullname,
          teamGroup: trans?.emp?.teamGrop || "",
          position: trans?.emp?.position || "",
          group: trans?.emp?.group || "",
          department: trans?.emp?.department || "",
          branch: trans?.emp?.branch || "",
          total: 0,
        };
      }
      acc[empId].total += 1;
      return acc;
    }, {});
  
    const empCountData = Object.values(empCounts)
      .sort((a, b) => b.total - a.total) // เรียงจากมากไปน้อย
      .map((item, index) => ({
      ลำดับ: index + 1,
      EmpId: item.empId,
      'Full Name': item.fullname,
      TeamGroup: item.teamGroup,
      Position: item.position,
      Group: item.group,
      Department: item.department,
      Branch: item.branch,
      จำนวน: item.total,
    }));
  
    // **Sheet 4: Count by Group**
    const groupCounts = filteredData.reduce((acc, trans) => {
      const group = trans?.emp?.group || "Unknown"; // ใช้ "Unknown" หากไม่มีข้อมูล group
      if (!acc[group]) {
        acc[group] = { group, count: 0 };
      }
      acc[group].count += 1;
      return acc;
    }, {});
  
    const groupCountData = Object.values(groupCounts)
      .sort((a, b) => b.count - a.count) // เรียงจากมากไปน้อย
      .map((item, index) => ({
      ลำดับ: index + 1,
      Group: item.group,
      จำนวน: item.count,
    }));

    const groupRedeem = filteredData.reduce((acc, trans) => {
      const group = trans.redeemId.group || "Unknown"; // ใช้ "Unknown" หากไม่มีข้อมูล group
      const rewardCode = trans.rewardCode;
      const name = trans.name;
      if (!acc[group]) {
        acc[group] = { group, rewardCode, name, count: 0 };
      }
      acc[group].count += 1;
      return acc;
    }, {});

    const groupRedeemData = Object.values(groupRedeem)
      .sort((a, b) => b.count - a.count) // เรียงจากมากไปน้อย
      .map((item, index) => ({
      ลำดับ: index + 1,
      'Reward Code': item.rewardCode,
      Name: item.name,
      Group: item.group,
      จำนวน: item.count,
    }));
  
    // สร้าง worksheets
    const worksheet1 = XLSX.utils.json_to_sheet(exportData);
    const worksheet2 = XLSX.utils.json_to_sheet(countData);
    const worksheet3 = XLSX.utils.json_to_sheet(empCountData);
    const worksheet4 = XLSX.utils.json_to_sheet(groupCountData);
    const worksheet5 = XLSX.utils.json_to_sheet(groupRedeemData);
  
    // สร้าง workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Redeem Transactions");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Reward Code Counts");
    XLSX.utils.book_append_sheet(workbook, worksheet3, "EmpId Counts");
    XLSX.utils.book_append_sheet(workbook, worksheet4, "Group Counts");
    XLSX.utils.book_append_sheet(workbook, worksheet5, "Group Redeem");
  
    // บันทึกเป็นไฟล์ Excel
    XLSX.writeFile(workbook, "redeem_report.xlsx");
  };
  

  
  if (!redeemTrans) return <div>Loading...</div>;

  const toggleFilter = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };


  // ฟิลเตอร์ข้อมูลตามเงื่อนไขที่เลือก
  const filteredData = redeemTrans.filter((trans) => {
    const empIdMatch = trans.empId && trans.empId.toString().includes(search);
    const fullnameMatch = trans.fullname && trans.fullname.toLowerCase().normalize('NFC').includes(search.toLowerCase().normalize('NFC'));

    const statusMatch =
      (!Object.values(filters).includes(true) ||
        (filters.pending && trans.status === "pending") ||
        (filters.delivered && trans.status === "delivered") ||
        (filters.done && trans.status === "done"));
    
        

    return statusMatch && (empIdMatch || fullnameMatch);
  });


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
    { field: "status", headerName: "Status", width: 100,
      renderCell: (params) => (
        <span
          className={`${
            params.value === "pending"
              ? "bg-red-500 text-white"
              : params.value === "delivered"
              ? "bg-yellow-500 text-white"
              : "bg-green-500 text-white"
          } text-xs font-medium px-2.5 py-0.5 rounded-full`}
        >
          {params.value}
        </span>
      ),
     },
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
    <div className="p-4 text-sm">
          <>
            <div className="flex flex-row items-center justify-between mb-2 gap-2">
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center">
                  <lable className="font-bold">Start Date:</lable>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 ml-2 rounded-lg p-1"
                  />
                </div>

                <div className="flex flex-row items-center">
                  <lable className="font-bold">End Date:</lable>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 ml-2 rounded-lg p-1"
                  />
                </div>
                <button 
                  onClick={handleExport} 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Export
                </button>
              </div>

              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center w-full gap-1">
                  <div className="flex flex-row items-center mr-2">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 mr-4"
                      placeholder="ค้นหา empId หรือ fullname"
                    />
                  </div>
                  <span className="font-bold mr-2">Filter:</span>
                  {Object.keys(filters).map((filterKey) => (
                    filters[filterKey] && (
                      <div 
                        key={filterKey}
                        className={`flex flex-row items-center ${filterKey === "pending" ? "bg-red-500" : filterKey === "delivered" ? "bg-yellow-500" : "bg-green-500"} text-white px-2 py-0.5 rounded-full gap-1`}
                      >
                        {filterKey} <IoClose onClick={() => toggleFilter(filterKey)} className="cursor-pointer" />
                      </div>
                    )
                  ))}
                  
                </div>
              
              {/* ปุ่มฟิลเตอร์ */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleFilter("pending")} 
                    className="bg-red-500 text-white px-2 py-0.5 rounded-full"
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => toggleFilter("delivered")} 
                    className="bg-yellow-500 text-white px-2 py-0.5 rounded-full"
                  >
                    Delivered
                  </button>
                  <button 
                    onClick={() => toggleFilter("done")} 
                    className="bg-green-500 text-white px-2 py-0.5 rounded-full"
                  >
                    Done
                  </button>
                </div>

                <span className="font-bold">Total:</span>

                <div className="flex flex-row items-center gap-1">
                  <span>{filteredData.length}</span> 
                  <span>/</span>
                  <span>{redeemTrans.length}</span>
                </div>

              </div>
            </div>

            {error && <p className="bg-red-500 text-white my-2 p-1">{error}</p>}
        
            <div style={{ height: '70vh', width: "100%" }}>
              <DataGrid
                rows={filteredData}
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
            {showButton && (
              <div className="flex flex-row items-end mt-4 gap-4">
                <div className="flex flex-col">
                    <span className="font-bold">Update Status:</span>
                    <div className="flex flex-row items-center"> 
                        <button 
                          onClick={() => handleStatus('pending')} 
                          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Pending
                        </button>
                        <button 
                          onClick={() => handleStatus('delivery')} 
                          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Deliver
                        </button>
                        <button 
                          onClick={() => handleStatus('done')} 
                          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Done
                        </button>
                        <Divider orientation="vertical" flexItem  className="mx-2"/>
                        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Print</button>
                    </div>
                </div>    
              </div>
            )}
          </>
    </div>
  );
};

export default Trans;



