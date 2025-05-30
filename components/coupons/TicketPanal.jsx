import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { IoClose } from "react-icons/io5";
import { RiCoupon3Line } from "react-icons/ri";
import Swal from "sweetalert2";

export default function TicketPanal({ onClose, mutate }) {
  const [code, setCode] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  const handleClaimCoupon = async () => {
    setIsClaimed(true);
    if (!code || code.trim() === "") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "กรุณากรอกโค้ด",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const response = await axios.post("/api/coupons/claim", {
        code,
        userId: userId,
      });

      if (response.data.success) {
        onClose();
        setCode("");
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "คุณได้รับคูปองเรียบร้อยแล้ว",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      let errorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      onClose();
      setCode("");
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } finally {
      setIsClaimed(false);
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-gray-600 p-4 shadow-lg w-full">
        {/* Ticket Header */}
        <div className="flex flex-row items-center justify-between bg-[#0056FF] text-white font-bold p-3 rounded-t-lg border-b border-gray-500 shadow-xl">
          แลกคูปอง
          <IoClose className="cursor-pointer" size={20} onClick={handleClose} />
        </div>

        {/* Ticket Body */}
        <div className="bg-white p-4 rounded-b-lg relative pb-6">
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-gray-600 w-6 h-6 rounded-full"></div>
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-600 w-6 h-6 rounded-full"></div>

          {/* Form */}
          <div className="flex flex-col gap-2">
            <label htmlFor="code" className="font-bold">
              โค้ดคูปอง:
            </label>
            <div className="flex flex-row items-center gap-2">
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="กรุณากรอกโค้ดคูปอง"
              />
              <button
                type="button"
                className="bg-[#0056FF] text-white px-4 py-1 rounded-md flex items-center justify-center"
                onClick={handleClaimCoupon}
                disabled={isClaimed}
              >
                <RiCoupon3Line className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
