import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import { MdDisplaySettings } from "react-icons/md";
import Loading from "@/components/Loading";
import { RiFileExcel2Fill, RiFilePdfFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { Dialog, Slide, Divider } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import * as XLSX from "xlsx";

moment.locale("th");

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const selecteStatus = [
  { id: "draft", name: "แบบร่าง" },
  { id: "pending", name: "รออนุมัติ" },
  { id: "approved", name: "อนุมัติ" },
  { id: "notApprove", name: "ไม่อนุมัติ" }, // แก้ให้ตรงกับ data จริง
];

export default function GiftSummery() {
  const [order, setOrder] = useState(null);
  const [filteredOrder, setFilteredOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState(
    selecteStatus.map((s) => s.id) // ✅ default เลือกทั้งหมด
  );
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/gift/budget`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      onSuccess: (data) => {
        setOrder(data.data);
      },
    }
  );

  useEffect(() => {
    if (order?.length > 0) {
      // ✅ filter ตาม status ที่เลือก
      const filtered = order.filter((o) => filteredStatus.includes(o.status));
      setFilteredOrder(filtered);
    }
  }, [order, filteredStatus]);

  const handleCheckboxChange = (statusId) => {
    if (filteredStatus.includes(statusId)) {
      // ✅ เอาออก
      setFilteredStatus(filteredStatus.filter((id) => id !== statusId));
    } else {
      // ✅ เพิ่มเข้าไป
      setFilteredStatus([...filteredStatus, statusId]);
    }
  };
  if (isLoading) return <Loading />;

  const getButton = (status) => {
    if (status === "order") {
      return (
        <button className="bg-gray-300 font-bold text-gray-800 px-2 py-2 rounded-lg">
          สั่งของขวัญ
        </button>
      );
    } else if (status === "draft") {
      return (
        <button className="bg-red-500 font-bold text-white px-2 py-2 rounded-lg">
          แบบร่าง
        </button>
      );
    } else if (status === "pending") {
      return (
        <button className="bg-[#FFC107] font-bold text-white px-2 py-2 rounded-lg">
          รอการอนุมัติ
        </button>
      );
    } else if (status === "approved") {
      return (
        <button className="bg-green-500 font-bold text-white px-2 py-2 rounded-lg">
          อนุมัติแล้ว
        </button>
      );
    } else if (status === "notApprove") {
      return (
        <button className="bg-red-500 font-bold text-white px-2 py-2 rounded-lg">
          ไม่อนุมัติ
        </button>
      );
    }
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0.00";
    }
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setOpenDetail(false);
  };

  const handleExportExcel = () => {
    if (!filteredOrder || filteredOrder.length === 0) return;

    const wb = XLSX.utils.book_new();

    selecteStatus.forEach((status) => {
      const ordersByStatus = filteredOrder.filter(
        (o) => o.status === status.id
      );

      if (ordersByStatus.length > 0) {
        let sheetData = [];

        ordersByStatus.forEach((o, index) => {
          let row = {
            No: index + 1,
            branch: o.branch,
            rh: o.rh,
            zone: o.zone,
            budget: o.budget,
            usedBudget: o.usedBudget,
            createdAt: moment(o.order_createdAt).format("lll"),
            address: o.info.address || "",
            phone_manager: o.info.phone_manager || "",
            receiver1_name: o.info.receiver1_name || "",
            receiver1_phone: o.info.receiver1_phone || "",
            receiver2_name: o.info.receiver2_name || "",
            receiver2_phone: o.info.receiver2_phone || "",
          };

          // ✅ แตก gifts เป็นคอลัมน์
          if (o.gifts && o.gifts.length > 0) {
            o.gifts.forEach((gift, gIndex) => {
              row[`gift${gIndex + 1}_name`] = gift.name;
              row[`gift${gIndex + 1}_price`] = gift.price;
              row[`gift${gIndex + 1}_qty`] = gift.qty;
              row[`gift${gIndex + 1}_total`] = gift.total;
            });
          }

          sheetData.push(row);
        });

        const ws = XLSX.utils.json_to_sheet(sheetData);

        // ปรับ column width
        const wscols = Object.keys(sheetData[0]).map((k) => ({ wch: 20 }));
        ws["!cols"] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, status.name);
      }
    });

    // ✅ สร้าง Gift Summary เฉพาะ status = approved
    const approveOrders = filteredOrder.filter((o) => o.status === "approved");
    if (approveOrders.length > 0) {
      let giftSummaryMap = {};

      approveOrders.forEach((o) => {
        if (o.gifts && o.gifts.length > 0) {
          o.gifts.forEach((gift) => {
            if (!giftSummaryMap[gift.name]) {
              giftSummaryMap[gift.name] = {
                name: gift.name,
                qty: 0,
                price: gift.price, // ✅ ใช้ราคาตาม gift
                total: 0,
              };
            }
            giftSummaryMap[gift.name].qty += gift.qty;
            giftSummaryMap[gift.name].total += gift.total;
          });
        }
      });

      const giftSummary = Object.values(giftSummaryMap).map((g, index) => ({
        No: index + 1,
        name: g.name,
        qty: g.qty,
        price: g.price,
        total: g.total,
      }));

      const wsSummary = XLSX.utils.json_to_sheet(giftSummary);
      const wscolsSummary = Object.keys(giftSummary[0]).map((k) => ({
        wch: 25,
      }));
      wsSummary["!cols"] = wscolsSummary;

      XLSX.utils.book_append_sheet(wb, wsSummary, "Gift Summary");
    }

    XLSX.writeFile(wb, `Gift_Report_${moment().format("YYYYMMDD_HHmm")}.xlsx`);
  };

  console.log("filteredOrder", filteredOrder);

  return (
    <div className="flex flex-col pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-[#0056FF] text-white flex flex-row items-center justify-between p-2 gap-4">
        <div className="flex items-center gap-2">
          <IoChevronBack
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="font-bold">Gift Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <RiFileExcel2Fill
            className="cursor-pointer"
            size={30}
            onClick={handleExportExcel}
          />
        </div>
      </div>
      {/* Table */}
      <div>
        {/* Toolbar */}
        <div className="flex flex-col gap-2 p-2">
          {/* Checkbox Filter */}
          <div className="flex items-center justify-between gap-2 p-1 border rounded-lg">
            {selecteStatus.map((s) => (
              <div key={s.id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={filteredStatus.includes(s.id)} // ✅ checked default
                  onChange={() => handleCheckboxChange(s.id)}
                />
                <label>{s.name}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="table-auto text-xs w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">สาขา</th>
                <th className="px-4 py-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrder &&
                filteredOrder.map((o, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td
                      className="border px-4 py-2"
                      onClick={() => handleOpenDetail(o)}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0056FF]">
                          {o.branch}
                        </span>
                        <span>
                          วันที่สร้าง: {moment(o.createdAt).format("lll")}
                        </span>
                        <span className="font-bold text-[#0056FF]">
                          งบประมาณ: {formatNumber(o.budget)}
                        </span>
                        <span className="font-bold text-[#F2871F]">
                          งบที่ใช้ไป: {formatNumber(o.usedBudget)}
                        </span>
                      </div>
                    </td>
                    <td
                      className="border px-4 py-2"
                      onClick={() => handleOpenDetail(o)}
                    >
                      {getButton(o.status)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        TransitionComponent={Transition}
        sx={{ "& .MuiDialog-paper": { width: "100%" } }}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div>
            <div className="flex flex-row bg-[#0056FF] text-white items-center justify-between p-2 gap-4 w-full">
              <span className="font-bold">รายละเอียด</span>
              <IoClose
                size={24}
                className="cursor-pointer"
                onClick={handleCloseDetail}
              />
            </div>
          </div>
          {/* Detail */}
          <div className="flex flex-col p-4">
            <div className="flex flex-col text-sm">
              <span className="font-bold">สาขา: {selectedOrder?.branch}</span>
              <div className="flex flex-row items-center gap-2">
                <span className="">{selectedOrder?.rh}</span>
                <span className="">{selectedOrder?.zone}</span>
              </div>
              <span className="">
                วันที่สร้าง: {moment(selectedOrder?.createdAt).format("lll")}
              </span>
              <span>งบประมาณ: {formatNumber(selectedOrder?.budget)}</span>
              <span>งบที่ใช้ไป: {formatNumber(selectedOrder?.usedBudget)}</span>
              <Divider sx={{ my: 2 }} />
              <div className="flex flex-col gap-2">
                {selectedOrder?.gifts.map((p, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <span>{index + 1}.</span>
                      <Image
                        src={p.image.url}
                        alt={p.name}
                        width={50}
                        height={50}
                      />
                      <span className="text-xs">{p.name}</span>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2 ml-4 text-xs">
                      <span>ราคา/หน่วย: {formatNumber(p.price)} บาท</span>
                      <span>จํานวน: {p.qty}</span>
                      <span>รวม: {formatNumber(p.total)} บาท</span>
                    </div>
                    <Divider sx={{ my: 1 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
