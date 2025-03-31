import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Divider, Slide, Dialog } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import Upload from "../utils/Upload";
import { deleteFile } from "@/lib/hook/useStorage";
import { toast } from "react-toastify";
import Loading from "../Loading";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BadgeForm({ data, onClose, mutate, newData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [openImage, setOpenImage] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      setImage(data.image);
    }
  }, [data]);

  console.log("data", data);

  const handleClose = () => {
    setForm({ name: "", description: "" });
    setImage(null);
    onClose();
  };

  const handleDeleteImage = async (url, public_id) => {
    try {
      await deleteFile(public_id, url);
      setFiles(null);
      toast.success("ลบรูปแล้ว");
    } catch (error) {
      console.log(error);
      toast.error("ลบรูปไม่สำเร็จ");
    }
  };

  const handleUpload = (files) => {
    const file = files[0];
    setImage({
      public_id: file.public_id,
      url: file.url,
    });
  };

  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClickClose = () => {
    setOpenImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Data = {
      ...form,
      image,
    };
    try {
      if (newData) {
        await axios.post("/api/badges", Data);
      } else {
        await axios.put(`/api/badges/${data.id}`, Data);
      }
      mutate();
      handleClose();
      toast.success("บันทึกสําเร็จ");
    } catch (error) {
      console.log(error);
      toast.error("บันทึกไม่สําเร็จ");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row items-center p-2 justify-between bg-[#0056FF] text-white w-full">
        <h2>{newData ? "สร้าง Badge" : "แก้ไข Badge"}</h2>
        <IoClose size={30} onClick={handleClose} />
      </div>

      {/* Form */}
      <div className="flex flex-col p-4 gap-2 w-full">
        <div className="flex flex-row items-center gap-2 mt-2 w-full">
          <label htmlFor="image" className="font-bold">
            รูปภาพ
          </label>
          {image ? (
            <div className="relative inline-block">
              <Image
                src={image.url}
                alt="image"
                width={200}
                height={200}
                className="object-contain h-[150px]"
                priority
              />
              <div
                className="absolute top-0 right-0 p-1 cursor-pointer bg-red-500 text-white rounded-full hover:bg-opacity-80"
                onClick={() => handleDeleteImage(image.url, image.public_id)}
              >
                <IoClose size={15} />
              </div>
            </div>
          ) : (
            <div
              className="flex flex-row gap-2 px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={handleClickOpen}
            >
              <FaRegImage size={25} />
              <span>อัพโหลดรูปภาพ</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="name" className="font-bold">
            ชื่อ
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="กรอกชื่อ"
          />
        </div>
        <div>
          <label htmlFor="description" className="font-bold">
            รายละเอียด
          </label>
          <textarea
            type="text"
            name="description"
            id="description"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="กรอกรายละเอียด"
          />
        </div>

        <div className="flex flex-row gap-2 mt-2 w-full">
          <button
            type="submit"
            className="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-[#0056FF] text-white rounded-lg cursor-pointer hover:bg-[#0056FF]/80"
            onClick={handleSubmit}
          >
            <span>{newData ? "สร้าง" : "แก้ไข"}</span>
          </button>

          <button
            type="button"
            className="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-500/80"
            onClick={handleClose}
          >
            <span>ยกเลิก</span>
          </button>
        </div>
      </div>
      <Dialog
        open={openImage}
        onClose={handleClickClose}
        Transition={Transition}
      >
        <Upload
          onClose={handleClickClose}
          setFiles={(files) => handleUpload(files)}
          folder="badges"
          newUpload={!image}
        />
      </Dialog>
    </div>
  );
}
