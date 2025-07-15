import { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

export default function NewTabForm({ onClose }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const handleClose = () => {
    setName("");
    setValue("");
    onClose();
  };

  return (
    <div className="w-[400px]">
      {/* header */}
      <div className="flex items-center text-white justify-between p-2 bg-[#0056FF]">
        <h1 className="font-bold">สร้างแท็บ</h1>
        <IoClose className="cursor-pointer" onClick={handleClose} />
      </div>

      <div></div>
      <div className="p-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-bold w-55">
            ชื่อแท็บ:
          </label>
          <input
            type="text"
            placeholder="ชื่อแท็บ"
            className="w-full p-2 text-black border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
