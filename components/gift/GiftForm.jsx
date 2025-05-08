import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import Upload from "../utils/Upload";
import { Dialog, Slide, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GiftForm({ onClose, gift, mutate }) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (gift) {
      setForm({
        code: gift.code,
        name: gift.name,
        description: gift.description,
        price: gift.price,
      });
      setImage(gift.image);
      setIsEdit(true);
    }
  }, [gift]);

  const handleOpenUpload = () => {
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  const handleUpload = (files) => {
    setImage(files[0]);
    handleCloseUpload();
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newData = {
      ...form,
      image: image,
    };

    try {
      if (isEdit) {
        await axios.put(`/api/gift/${gift._id}`, newData);
        toast.success("แก้ไขของขวัญสําเร็จ");
      } else {
        await axios.post("/api/gift", newData);
        toast.success("เพิ่มของขวัญสําเร็จ");
      }
      mutate();
      handleClear();
    } catch (error) {
      console.log(error);
      toast.error("บันทึกของขวัญไม่สําเร็จ");
    }
  };

  const handleClear = () => {
    setForm({ code: "", name: "", description: "", price: "" });
    setImage(null);
    setIsEdit(false);
    onClose();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row items-center bg-[#0056FF] text-white p-4 gap-4">
        <IoChevronBack className="text-lg cursor-pointer" onClick={onClose} />
        <h2 className="text-lg font-bold">
          {isEdit ? "แก้ไขของขวัญ" : "เพิ่มของขวัญ"}
        </h2>
      </div>
      {/* Form */}
      <div className="flex flex-col p-4 gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="font-bold">
            รูปภาพ
          </label>
          {image && (
            <div className="flex flex-row gap-4">
              <Image
                src={image?.url}
                alt={image?.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          )}
          <button
            className="bg-[#0056FF] text-white px-2 py-2 rounded-lg w-36"
            onClick={handleOpenUpload}
          >
            อัพโหลด
          </button>
        </div>
        <div>
          <label htmlFor="code" className="font-bold">
            โค้ดของขวัญ
          </label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            placeholder="โค้ดของขวัญ"
          />
        </div>
        <div>
          <label htmlFor="name" className="font-bold">
            ชื่อของขวัญ
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            placeholder="ชื่อของขวัญ"
          />
        </div>
        <div>
          <label htmlFor="description" className="font-bold">
            รายละเอียดของขวัญ
          </label>
          <textarea
            type="text"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            placeholder="รายละเอียดของขวัญ"
            rows={4}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor="price" className="font-bold">
            ราคาของขวัญ
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-2 py-1 w-32"
            placeholder="ราคาของขวัญ"
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-5">
          <button
            className="bg-[#0056FF] text-white px-2 py-2 rounded-lg w-36"
            onClick={(e) => handleSubmit(e)}
          >
            {isEdit ? "แก้ไข" : "เพิ่ม"}
          </button>
          <button
            className="bg-red-500 text-white px-2 py-2 rounded-lg w-36"
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
      <Dialog
        open={openUpload}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseUpload}
      >
        <Upload
          onClose={handleCloseUpload}
          setFiles={(image) => handleUpload(image)}
          folder={"gift"}
          newUpload={true}
        />
      </Dialog>
    </div>
  );
}
