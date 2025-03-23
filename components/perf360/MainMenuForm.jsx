import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import { Divider, Slide, Dialog } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import Upload from "../utils/Upload";
import { deleteFile } from "@/lib/hook/useStorage";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GroupData = [
  { name: "Retail", value: "Retail" },
  { name: "AL", value: "AL" },
  { name: "TCON", value: "TCON" },
  { name: "PB", value: "PB" },
];

export default function MainMenuForm({ onClose, data, mutate, newData }) {
  const [form, setForm] = useState({
    active: true,
    title: "",
    descriptions: "",
  });
  const [group, setGroup] = useState(GroupData.map((g) => g.value));
  const [openImage, setOpenImage] = useState(false);
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status, loading } = useSession();

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  useEffect(() => {
    if (!GroupData) return;
  }, []);

  useEffect(() => {
    if (data) {
      setGroup(Array.isArray(data.group) ? data.group : []);
      setForm({
        active: data.active ?? true,
        title: data.title ?? "",
        descriptions: data.descriptions ?? "",
      });
      if (data.files) setFiles(data.files);
    } else if (newData) {
      // ✅ กรณีสร้างใหม่ ให้เลือกทุก group
      setGroup(GroupData.map((g) => g.value));
      setForm({
        active: true,
        title: "",
        descriptions: "",
      });
    }
  }, [data, newData]);

  const handleClickCloseForm = () => {
    onClose();
  };

  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClickClose = () => {
    setOpenImage(false);
  };

  const handleChangeActive = (value) => {
    setForm((prevForm) => ({
      ...prevForm,
      active: value,
    }));
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/blob/delete?url=${files.url}`);
      await deleteFile(files.fileId);
      setFiles(null);
      toast.success("ลบรูปแล้ว");
    } catch (error) {
      console.log(error);
      toast.error("ลบรูปไม่สำเร็จ");
    }
  };

  const handleUpload = (files) => {
    const file = files[0];
    setFiles(file);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // ❌ ไม่ให้ส่งซ้ำ

    setIsSubmitting(true); // ✅ เริ่ม block
    const newData = {
      ...form,
      group,
      image: files,
    };

    try {
      if (data && data._id) {
        newData.updated_users = [
          {
            userId: session?.user?.id,
            updatedAt: new Date(),
          },
        ];
        const res = await axios.put(`/api/perf360/menu/${data._id}`, newData);
        if (res.data.success) {
          toast.success("แก้ไข menu เรียบร้อย");
          handleClear();
          mutate();
          onClose();
        }
      } else {
        newData.creator = session?.user?.id || "";
        const res = await axios.post("/api/perf360/menu", newData);
        if (res.data.success) {
          toast.success("บันทึก menu เรียบร้อย");
          handleClear();
          mutate();
          onClose();
        }
      }
    } catch (error) {
      toast.error("บันทึกผิดพลาด");
      console.log(error);
    } finally {
      setIsSubmitting(false); // ✅ ปลดล็อกเมื่อเสร็จ
    }
  };

  const handleClear = () => {
    setForm({
      active: true,
      title: "",
      descriptions: "",
    });
    setFiles(null);
    setGroup(GroupData.map((g) => g.value));
    onClose();
  };

  const handleToggleGroup = (value) => {
    if (!Array.isArray(group)) return;
    setGroup((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center py-4 px-2 bg-[#0056FF] text-white w-full">
        <h2 className="font-bold">หมวดเมนูหลัก</h2>
        <IoClose
          className="self-end"
          size={20}
          onClick={handleClickCloseForm}
        />
      </div>

      {/* Form */}
      <div className="flex flex-col px-4 py-2 gap-2 w-full">
        <h2 className="font-bold text-lg text-[#0056FF]">
          {newData ? "เพิ่ม" : "แก้ไข"} Popup
        </h2>

        <div className="flex flex-col w-full">
          <label htmlFor="teamGrop" className="font-bold">
            กลุ่มพนักงาน
          </label>
          <div className="flex flex-row items-center justify-between border border-gray-200 rounded-lg p-2 w-full">
            {GroupData.map((g, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  name="group"
                  id={`group-${g.value}`}
                  checked={Array.isArray(group) && group.includes(g.value)}
                  onChange={() => handleToggleGroup(g.value)}
                />
                <label htmlFor={`group-${g.value}`}>{g.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="active" className="font-bold">
            สถานะการเปิดใช้งาน
          </label>
          <div className="flex flex-row justify-around items-center border border-gray-300 rounded-md p-2 w-full">
            <div className="flex gap-2">
              <div
                className={`w-6 h-6 rounded-md 
                ${form.active ? "bg-green-500" : "bg-gray-300"}`}
                onClick={() => handleChangeActive(true)}
              ></div>
              <span>Online</span>
            </div>
            <div className="flex gap-2">
              <div
                className={`w-6 h-6 rounded-md 
                ${!form.active ? "bg-red-500" : "bg-gray-300"}`}
                onClick={() => handleChangeActive(false)}
              ></div>
              <span>Offline</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="title" className="font-bold">
            ชื่อหมวดกิจกรรมหลัก
          </label>
          <input
            type="text"
            name="title"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="พิมพ์ชื่อหมวดกิจกกรมหลัก"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="descriptions" className="font-bold">
            คำอธิบายหมวดกิจกกรมหลัก
          </label>
          <input
            type="text"
            name="descriptions"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.descriptions}
            onChange={(e) => setForm({ ...form, descriptions: e.target.value })}
            placeholder="คำอธิบายหมวดกิจกกรมหลัก"
          />
        </div>

        <div className="flex flex-row items-center gap-2 my-2 w-full">
          <label htmlFor="image" className="font-bold">
            รูปภาพ
          </label>
          {files ? (
            <div className="relative inline-block">
              <Image
                src={files.url}
                alt="image"
                width={200}
                height={200}
                className="object-contain h-[150px]"
                priority
              />
              <div
                className="absolute top-0 right-0 p-1 cursor-pointer bg-red-500 text-white rounded-full hover:bg-opacity-80"
                onClick={handleDeleteImage}
              >
                <IoClose size={15} />
              </div>
            </div>
          ) : (
            <div
              className="flex flex-row gap-2 px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg"
              onClick={handleClickOpen}
            >
              <FaRegImage size={25} />
              <span>อัพโหลดรูปภาพ</span>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-center gap-4 mt-4 w-full">
          <button
            className="px-4 py-2 bg-[#0056FF] rounded-lg text-white font-bold disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
          </button>

          <button
            className="px-4 py-2 bg-[#F2871F] rounded-lg text-white font-bold"
            onClick={handleClear}
          >
            ยกเลิก
          </button>
        </div>
      </div>
      <Dialog
        open={openImage}
        onClose={handleClickClose}
        TransitionComponent={Transition}
        keepMounted
      >
        <Upload
          onClose={handleClickClose}
          setFiles={(files) => handleUpload(files)}
          folder="popup"
          newUpload={!files}
        />
      </Dialog>
    </div>
  );
}
