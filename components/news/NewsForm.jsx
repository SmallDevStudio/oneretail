import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { Divider, Slide, Dialog } from "@mui/material";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import Upload from "../utils/Upload";
import Image from "next/image";
import { deleteFile } from "@/lib/hook/useStorage";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
  ssr: false,
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewsForm({ data, onClose, newData, mutate }) {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    title: "",
    url: "",
    group: "",
    display: "",
    active: true,
  });
  const [content, setContent] = useState(
    `<p>พิมพ์ข้อความข่าวสารที่ต้องการแสดง</p>`
  );
  const [openImage, setOpenImage] = useState(false);
  const [files, setFiles] = useState(null);
  const [group, setGroup] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [session, status]);

  useEffect(() => {
    if (data) {
      setForm({
        start_date: data.start_date,
        end_date: data.end_date,
        title: data.title,
        url: data.url,
        group: data.group,
        display: data.display,
        active: data.active,
      });
      setContent(data.content);
      setFiles(data.image);
    }
  }, [data]);

  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClickClose = () => {
    setOpenImage(false);
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
    setFiles({
      public_id: file.public_id,
      url: file.url,
    });
  };

  const handleChangeActive = (value) => {
    setForm((prevForm) => ({
      ...prevForm,
      active: value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const newData = {
      group: form.group,
      start_date: form.start_date || new Date().toISOString(),
      end_date: form.end_date || new Date().toISOString(),
      title: form.title,
      url: form.url,
      content: content,
      display: form.display,
      active: form.active,
      image: files,
    };

    if (data && data._id) {
      newData.updated_users = [
        {
          userId: session?.user?.id,
          updatedAt: new Date(),
        },
      ];
      const res = await axios.put(`/api/news/${data._id}`, newData);
      if (res.data.success) {
        toast.success("แก้ไขข่าวสารเรียบร้อย");
        handleClear();
        mutate();
        onClose();
      }
    } else {
      try {
        newData.creator = session?.user?.id; // ตรวจสอบให้แน่ใจว่ามีค่า
        const res = await axios.post("/api/news", newData);
        if (res.data.success) {
          toast.success("บันทึกข่าวสารเรียบร้อย");
          handleClear();
          mutate();
          onClose();
        }
      } catch (error) {
        toast.error("บันทึกผิดพลาด");
        console.log(error);
      }
    }
  };

  const handleClear = () => {
    setForm({
      start_date: "",
      end_date: "",
      title: "",
      url: "",
      group: "",
      display: "",
      active: true,
    });
    setContent(`<p>พิมพ์ข้อความข่าวสารที่ต้องการแสดง</p>`);
    setFiles(null);
    onClose();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center py-4 px-2 bg-[#0056FF] text-white w-full">
        <h2 className="text-xl font-bold">
          {newData ? "เพิ่ม" : "แก้ไข"}ข่าวสาร
        </h2>
        <IoClose size={25} onClick={handleClose} />
      </div>
      <div className="flex flex-col px-4 py-2 gap-2 w-full">
        <div className="flex flex-col w-full">
          <label htmlFor="title" className="font-bold">
            หัวข้อข่าวสาร
            <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            id="title"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="พิมพ์หัวข้อข่าวสาร"
            required
          />
        </div>

        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="start_date" className="font-bold">
              วันที่เริ่มต้น
            </label>
            <DatePicker
              selected={form.start_date ? new Date(form.start_date) : null}
              onChange={(date) =>
                setForm({ ...form, start_date: date.toISOString() })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy HH:mm"
              timeCaption="เวลา"
              placeholderText="เลือกวันที่และเวลา"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="end_date" className="font-bold">
              วันที่เวลาสิ้นสุด
            </label>
            <DatePicker
              selected={form.end_date ? new Date(form.end_date) : null}
              onChange={(date) =>
                setForm({ ...form, end_date: date.toISOString() })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy HH:mm"
              timeCaption="เวลา"
              placeholderText="เลือกวันที่และเวลา"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="display" className="font-bold">
              การแสดงผล
            </label>
            <select
              name="display"
              id="display"
              value={form.display}
              onChange={(e) => setForm({ ...form, display: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">-- กรุณาเลือกการแสดงผล --</option>
              <option value="popup">Popup</option>
              <option value="home">Home</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 mt-2 w-full">
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
                onClick={() => handleDeleteImage(files.url, files.public_id)}
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

        <div className="flex flex-col w-full">
          <label htmlFor="descriptions" className="font-bold">
            เนื้อหา
          </label>
          <TiptapEditor
            content={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        <div className="flex flex-row items-center justify-center gap-4 mt-4 w-full">
          <button
            className="px-4 py-2 bg-[#0056FF] rounded-lg text-white font-bold"
            onClick={handleSubmit}
          >
            บันทึก
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
        Transition={Transition}
      >
        <Upload
          onClose={handleClickClose}
          setFiles={(files) => handleUpload(files)}
          folder="news"
          newUpload={!files}
        />
      </Dialog>
    </div>
  );
}
