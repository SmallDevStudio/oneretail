import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../Loading";
import { IoClose } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

export default function TeamGroup({ onClose, mutate, data }) {
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (name === "") {
      setError("กรุณากรอกชื่อกลุ่มทีม");
      toast.error("กรุณากรอกชื่อกลุ่มทีม");
    }

    try {
      const res = await axios.post("/api/perf360/teamgroup", {
        name,
        value: name,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("บันทึกกลุ่มทีมเรียบร้อย");
        handleClear();
        mutate();
      } else {
        toast.error("บันทึกกลุ่มทีมไม่สําเร็จ");
      }
    } catch (error) {
      console.log(error);
      toast.error("บันทึกกลุ่มทีมไม่สําเร็จ");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการลบ!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/api/perf360/teamgroup?id=${id}`);
        console.log(response.data);
        toast.success("ลบข้อมูลเรียบร้อย");
        mutate();
      } catch (error) {
        console.log(error);
        toast.error("ลบข้อมูลไม่สําเร็จ");
      }
    }
  };

  const handleClear = () => {
    setOpenForm(false);
    setName("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row bg-[#0056FF] text-white items-center justify-between p-2 gap-4 w-full">
        <span className="text-lg font-bold">TeamGroup Managements</span>
        <IoClose className="text-lg cursor-pointer" onClick={onClose} />
      </div>

      {/* Body */}
      <div className="flex flex-col p-2">
        <div>
          <button
            className="flex flex-row items-center gap-2 p-2 bg-green-500 font-bold text-white rounded-lg"
            onClick={() => setOpenForm(true)}
          >
            create
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <span className="font-bold">กลุ่มทีม</span>
          {data &&
            data.map((item, index) => (
              <div
                className="flex flex-row items-center justify-between gap-2 py-2 px-4 border rounded-full"
                key={index}
              >
                <span className="font-bold">{item.name}</span>
                <div className="flex flex-row gap-2">
                  <CiEdit size={25} className="text-green-500 cursor-pointer" />
                  <IoClose
                    size={25}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Form */}
      {openForm && (
        <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-lg">
          <h2 className="text-lg font-bold">สร้างกลุ่มทีม</h2>
          <div>
            <label htmlFor="name" className="font-bold">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className={`w-full p-2 border  rounded-lg
              ${error ? "border-red-500" : "border-gray-200"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ใส่ชื่อ TeamGroup"
            />
            {error && <span className="text-red-500">{error}</span>}
          </div>
          <div className="flex flex-row justify-center gap-4 mt-4">
            <button
              className="flex flex-row items-center gap-2 p-2 bg-[#0056FF] font-bold text-white rounded-lg"
              onClick={handleSave}
            >
              บันทึก
            </button>
            <button
              className="flex flex-row items-center gap-2 p-2 bg-red-500 font-bold text-white rounded-lg"
              onClick={handleClear}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
