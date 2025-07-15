import { useState, useEffect } from "react";
import axios from "axios";
import { Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewGroupForm({ onClose, groups, mutate, setGroup }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (name) setValue(generateValue(name));
  }, [name]);

  const generateValue = (text) => {
    return text
      ?.trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
  };

  const handleSave = async () => {
    try {
      if (!name) return toast.error("กรุณากรอกชื่อกลุ่ม");

      const res = await axios.post("/api/news/group", { name, value });
      if (res.status === 200 || res.status === 201) {
        mutate();
        toast.success("บันทึกกลุ่มเรียบร้อย");
        handleClose();
      } else {
        toast.error("บันทึกกลุ่มไม่สําเร็จ");
      }
    } catch (error) {
      console.log(error);
      toast.error("บันทึกกลุ่มไม่สําเร็จ");
    }
  };

  const handleClose = () => {
    if (value) {
      setName("");
      setValue("");
      setGroup(value);
      mutate();
      onClose(value);
    } else {
      setName("");
      setValue("");
      mutate();
      onClose();
    }
  };

  return (
    <div className="w-[400px]">
      {/* header */}
      <div className="flex items-center text-white justify-between p-2 bg-[#0056FF]">
        <h1 className="font-bold">สร้างกลุ่ม</h1>
        <IoClose className="cursor-pointer" onClick={handleClose} />
      </div>

      <div></div>
      <Divider />
      <div className="p-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-bold w-55">
            ชื่อกลุ่ม:
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
    </div>
  );
}
