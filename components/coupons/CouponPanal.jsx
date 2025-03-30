import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { RiCoupon3Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function CouponPanal({ onClose, mutate }) {
  const [code, setCode] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  const handleClaimCoupon = async () => {
    setIsClaimed(true);
    if (!code || code.trim() === "") {
      toast.error("กรุณากรอกโค้ด");
      return;
    }
    try {
      const response = await axios.post("/api/coupons/claim", {
        code,
        userId: session.user.id,
      });
      if (response.data.success) {
        onClose();
        setCode("");
        mutate();
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "คุณได้รับคูปองเรียบร้อยแล้ว",
          confirmButtonText: "OK",
        });
      } else {
        setCode("");
        onClose();
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
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
      {/* Header */}
      <div className="flex flex-row bg-[#0056FF] text-white items-center p-2 gap-4 w-full justify-between">
        <h2 className="text-lg font-bold">คูปอง</h2>
        <IoClose className="text-lg cursor-pointer" onClick={handleClose} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <div>
          <label htmlFor="code">โค้ด:</label>
          <div className="flex flex-row items-center gap-2">
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              placeholder="กรุณากรอกโค้ด"
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
  );
}
