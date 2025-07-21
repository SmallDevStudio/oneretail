import { useState, useEffect } from "react";
import axios from "axios";
import { Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaRegTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";

export default function NewTabForm({ onClose, tabs, mutate, setTab }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  console.log("value", value);

  useEffect(() => {
    if (name) setValue(generateValue(name));
  }, [name]);

  const generateValue = (text) => {
    return text
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // แปลง space เป็น -
      .replace(/[^\u0E00-\u0E7Fa-z0-9-_]/g, ""); // ✅ รองรับอักขระไทย
  };

  const isDuplicate = (name, value) => {
    if (!tabs || tabs.length === 0) return false; // ✅ ป้องกัน undefined/null
    return tabs.some(
      (tab) =>
        tab.name.trim() === name.trim() || tab.value.trim() === value.trim()
    );
  };

  const handleSave = async () => {
    try {
      if (!name) return toast.error("กรุณากรอกชื่อแท็บ");

      const generatedValue = generateValue(name);
      if (!generatedValue)
        return toast.error("ไม่สามารถสร้าง value ได้จากชื่อ");

      if (isDuplicate(name, generatedValue))
        return toast.error("ชื่อแท็บหรือ value นี้มีอยู่แล้ว");

      const res = await axios.post("/api/news/tabs", {
        name,
        value: generatedValue,
      });

      if (res.status === 200 || res.status === 201) {
        mutate();
        toast.success("บันทึกแท็บเรียบร้อย");
        handleClose(generatedValue);
      } else {
        toast.error("บันทึกแท็บไม่สําเร็จ");
      }
    } catch (error) {
      console.log(error);
      toast.error("บันทึกแท็บไม่สําเร็จ");
    }
  };

  const handleClose = (value) => {
    if (value) {
      setName("");
      setValue("");
      setTab(value);
      setOpen(false);
      mutate();
      onClose(value);
    } else {
      setName("");
      setValue("");
      setOpen(false);
      mutate();
      onClose();
    }
  };

  const handleEdit = (tab) => {
    setName(tab.name);
    setValue(tab.value);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/news/tabs/${id}`);
      if (res.status === 200 || res.status === 201) {
        mutate();
        toast.success("ลบแท็บเรียบร้อย");
        setName("");
        setValue("");
        setOpen(false);
      } else {
        toast.error("ลบแท็บไม่สําเร็จ");
      }
    } catch (error) {
      console.log(error);
      toast.error("ลบแท็บไม่สําเร็จ");
    }
  };

  return (
    <div className="w-[400px]">
      {/* header */}
      <div className="flex items-center text-white justify-between p-2 bg-[#0056FF]">
        <h1 className="font-bold">จัดการแท็บ</h1>
        <IoClose className="cursor-pointer" onClick={handleClose} />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-bold">แท็บที่มีอยู่</h1>
          <div
            className="flex justify-center items-center cursor-pointer bg-[#F2871F] p-1 rounded-full text-white"
            onClick={() => {
              setOpen(!open);
              setName("");
              setValue(""); // ✅ เคลียร์แค่ตอนสร้างใหม่
            }}
          >
            {open ? <FaMinus /> : <FaPlus />}
          </div>
        </div>
        {tabs && tabs.length > 0 && (
          <div className="flex flex-col gap-2">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <span>{tab.name}</span>
                <div className="flex items-center gap-2">
                  <FaEdit
                    className="text-[#0056FF] cursor-pointer"
                    onClick={() => handleEdit(tab)}
                  />
                  <FaRegTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(tab._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Divider />

      {open && (
        <div className="p-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-bold w-55">
              ชื่อแท็บ:
            </label>
            <input
              type="text"
              placeholder="ชื่อกลุ่ม"
              className="w-full p-2 text-black border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                className="bg-[#0056FF] text-white py-2 px-4 rounded-md"
                onClick={handleSave}
              >
                บักทึก
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={handleClose}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
