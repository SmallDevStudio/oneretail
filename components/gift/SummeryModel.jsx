import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function SummeryModel({ onClose, branchId, mutate }) {
  const [gift, setGift] = useState([]);
  const [budget, setBudget] = useState([]);
  const [selectedGift, setSelectedGift] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: budgets } = useSWR(
    branchId ? `/api/gift/budget/${branchId}` : null,
    fetcher,
    {
      onSuccess: (data) => {
        setBudget(data.data);
        setRemainingBudget(data.data.budget);
      },
    }
  );

  const { data: gifts } = useSWR(`/api/gift`, fetcher, {
    onSuccess: (data) => {
      setGift(data.data);
    },
  });

  useEffect(() => {
    if (branchId) {
      const fetchOrder = async () => {
        try {
          const res = await axios.get(`/api/gift/order/${branchId}`);
          const data = res.data;
          if (data.success && data.data) {
            const order = data.data;

            // แปลง order.gifts จาก Array<[]>
            const flatGifts = order.gifts.flat(); // ✅ fix รูปแบบ gift ซ้อน []

            const updatedGiftList = gift.map((g) => {
              const matched = flatGifts.find(
                (og) => og._id === g._id || og.code === g.code
              );
              return matched
                ? { ...g, qty: matched.qty, total: matched.total }
                : g;
            });

            setGift(updatedGiftList);
            setSelectedGift(flatGifts);
            setInfo(order.info ? order.info : null);
            setOrderId(order._id);
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setIsOrderLoaded(true);
        }
      };

      if (branchId && gift.length > 0 && !isOrderLoaded) {
        fetchOrder();
      }
    }
  }, [branchId, gift, isOrderLoaded]);

  useEffect(() => {
    const total = selectedGift.reduce((acc, g) => acc + g.qty * g.price, 0);
    setTotalAmount(total);
    setRemainingBudget(budget.budget - total);
  }, [budget.budget, selectedGift]);

  const handleSaveOrder = async (status) => {
    if (!session?.user?.id) return;

    if (status === "approved") {
      const result = await Swal.fire({
        title: "ยืนยันการสั่งจอง",
        icon: "warning",
        text: "การสั่งจองจะไม่สามารถยกเลิก และแก้ไขได้ คุณแน่ใจหรือไม่",
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

    const giftsToSave = selectedGift.map((gift) => ({
      ...gift, // ส่ง gift ทั้ง object
    }));

    const dataToSave = {
      userId: session.user.id,
      branchId: branchId,
      gifts: giftsToSave,
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
      await axios.put(`/api/gift/order/${branchId}`, {
        newData: dataToSave,
        orderId, // for logging if needed
      });
      mutate();
      toast.success("อัปเดตรายการสำเร็จ");
      handleClear();
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleClear = () => {
    setForm({ code: "", name: "", description: "", price: "" });
    setImage(null);
    setIsEdit(false);
    onClose();
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
                    {formatNumber(budget?.budget)}
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
        <button className="bg-[#0056FF] text-white font-bold px-4 py-2 rounded-lg">
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
