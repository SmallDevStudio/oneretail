import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { Dialog, Slide, Divider } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SummeryModel({ onClose, order, mutate }) {
  const [budget, setBudget] = useState([]);
  const [selectedGift, setSelectedGift] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [info, setInfo] = useState(null);
  const [openNotApprove, setOpenNotApprove] = useState(false);
  const [reason, setReason] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (order) {
      setSelectedGift(order.gifts);
      setBudget(order.budget);
      setTotalAmount(order.usedBudget);
      setRemainingBudget(order.remainingBudget);
      setOrderId(order.orderId);
      setInfo(order.info);
    }
  }, [order]);

  const handleSaveOrder = async (status) => {
    if (!session?.user?.id) return;

    if (status === "approved") {
      const result = await Swal.fire({
        title: "ยืนยันการสั่งจอง",
        icon: "warning",
        text: "ยืนยันการสั่งจองจะไม่สามารถยกเลิก และแก้ไขได้ คุณแน่ใจหรือไม่",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    const dataToSave = {
      userId: session.user.id,
      branchId: order._id,
      gifts: selectedGift,
      info,
      status,
    };

    try {
      const update_by = {
        update_by: [
          {
            userId: session.user.id,
            update_at: new Date(),
          },
        ],
      };
      dataToSave.update_by = update_by.update_by;
      // update
      await axios.put(`/api/gift/order/${order._id}`, {
        newData: dataToSave,
        orderId, // for logging if needed
      });
      mutate();
      toast.success("อัปเดตรายการสำเร็จ");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
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

  const handleNotApprove = () => {
    setReason("");
    setOpenNotApprove(true);
  };

  const handleCloseNotApprove = () => {
    setReason("");
    setOpenNotApprove(false);
    onClose();
  };

  const handleNotApproveSubmit = async () => {
    if (reason === "") {
      toast.error("กรุณาใส่เหตุผล");
      return;
    }

    try {
      const dataSave = {
        branchId: order._id,
        orderId,
        userId: order.userId,
        approverId: session.user.id,
        reason,
      };
      const res = await axios.post("/api/gift/order/not_approve", dataSave);
      if (res.data.success) {
        handleSaveOrder("notApprove");
        mutate();
        toast.success("บันทึกเรียบร้อย");
        handleCloseNotApprove();
      } else {
        toast.error("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleApprove = async () => {
    handleSaveOrder("approved");
  };

  return (
    <div className="flex flex-col gap-2 p-4 w-full">
      <div className="absolute top-2 right-2">
        <IoClose
          className="text-red-500 text-lg cursor-pointer"
          onClick={onClose}
        />
      </div>
      <h2 className="text-lg font-bold text-center">
        อนุมัติการสั่งจองของขวัญ
      </h2>
      <p className="text-sm text-center">
        คุณต้องการอนุมัติการสั่งจองของขวัญหรือไม่?
      </p>
      <div>
        <table className="table-auto w-full text-xs">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-1">รายการ</th>
              <th className="py-1">จํานวน</th>
              <th className="py-1">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {selectedGift.length > 0 ? (
              <>
                {selectedGift.length > 0 &&
                  selectedGift.map((item) => (
                    <tr key={item._id}>
                      <td className="py-1">{item.name}</td>
                      <td className="py-1">{formatNumber(item.price)}</td>
                      <td className="py-1">{formatNumber(item.total)}</td>
                    </tr>
                  ))}
                <tr>
                  <td className="py-1">รวมทั้งหมด</td>
                  <td
                    className="bg-green-500 font-bold text-white py-1"
                    colSpan="2"
                  >
                    {formatNumber(totalAmount)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">งบประมาณที่ได้รับ</td>
                  <td
                    className="bg-orange-500 font-bold text-white py-1"
                    colSpan="2"
                  >
                    {formatNumber(budget)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">งบประมาณคงเหลือ</td>
                  <td
                    className="bg-blue-500 font-bold text-white py-1"
                    colSpan="2"
                  >
                    {formatNumber(remainingBudget)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="py-1" colSpan="3">
                  ไม่มีรายการ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-red-500 text-center">
        หากอนุมัติการสั่งซื้อของขวัญ จะไม่สามารถแก้ไขได้
      </p>

      <div className="flex justify-center gap-2">
        <button
          className="bg-[#F2871F] text-white font-bold px-4 py-2 rounded-lg"
          onClick={() => handleSaveOrder("approved")}
        >
          อนุมัติ
        </button>
        <button
          className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg"
          onClick={handleNotApprove}
        >
          ไม่อนุมัติ
        </button>
        <button
          className="bg-[#0056FF] text-white font-bold px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          ยกเลิก
        </button>
      </div>
      <Dialog
        open={openNotApprove}
        onClose={handleCloseNotApprove}
        TransitionComponent={Transition}
        sx={{ "& .MuiDialog-paper": { width: "100%", maxWidth: "md" } }}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between bg-red-500 text-white p-2">
            <h3 className="font-bold">ไม่อนุมัติ</h3>
            <IoClose size={25} onClick={handleCloseNotApprove} />
          </div>
          <div className="flex flex-col gap-2 p-4 w-full">
            <label htmlFor="reason" className="font-bold">
              เหตุผลไม่อนุมัติ
            </label>
            <textarea
              id="reason"
              className="border border-gray-300 rounded-md p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="กรุณากรอกเหตุผลไม่อนุมัติ"
            />
            <div className="flex justify-center gap-2 mt-4">
              <button
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg"
                onClick={handleNotApproveSubmit}
              >
                ยืนยัน
              </button>
              <button
                className="bg-[#0056FF] text-white font-bold px-4 py-2 rounded-lg"
                onClick={handleCloseNotApprove}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
