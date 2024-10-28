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

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const Trans = () => {
  const [redeemTrans, setRedeemTrans] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);


  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    fetchRedeemTrans();
  }, []);

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

 
// Update custom order (Admin functionality, optional)
  const updateOrder = async (redeemItem, newOrder) => {
    try {
      await axios.put(`/api/redeem/${redeemItem._id}`, {
        customOrder: newOrder
      });
      Swal.fire('Updated!', 'Custom order updated successfully.', 'success');
      mutateRedeem(); // Refresh the list after update
    } catch (error) {
      Swal.fire('Error!', 'Failed to update custom order.', 'error');
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

  const handleDone = async () => {
    await Promise.all(
      selectedRows.map(async (rowId) => {
        const redeemTran = redeemTrans.find((trans) => trans.id === rowId);
        await axios.put("/api/done", {
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

  
  if (!redeemTrans) return <div>Loading...</div>;

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
    <div className="p-4 text-sm">
          <>
            <div style={{ height: '70vh', width: "100%" }}>
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
              <div className="flex flex-row items-end mt-4 gap-4">
                <div className="flex flex-col">
                    <span className="font-bold">Update Status:</span>
                    <div className="flex flex-row items-center"> 
                        <button onClick={handleDeliver} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Deliver</button>
                        <button onClick={handleDone} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Done</button>
                    </div>
                </div>
                <Divider orientation="vertical" className="mt-4" flexItem/>
                <div className="flex flex-row">
                    <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Print</button>
                    <button onClick={handleExport} className="bg-red-500 text-white px-4 py-2 rounded">Export</button>
                </div>
              </div>
            )}
          </>
    </div>
  );
};

export default Trans;



