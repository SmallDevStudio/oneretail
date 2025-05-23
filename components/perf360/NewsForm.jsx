import React, { useState, useEffect } from "react";
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

export default function NewsForm({
  onClose,
  data,
  mutate,
  newData,
  GroupData,
}) {
  const [form, setForm] = useState({
    category: "",
    start_date: "",
    end_date: "",
    title: "",
    url: "",
    display: "",
    active: true,
  });
  const [content, setContent] = useState(
    `<p>พิมพ์ข้อความข่าวสารที่ต้องการแสดง</p>`
  );
  const [openImage, setOpenImage] = useState(false);
  const [files, setFiles] = useState(null);
  const [group, setGroup] = useState(GroupData.map((g) => g.value));
  const [position, setPosition] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [category, setCategory] = useState("");

  const { data: session, status, loading } = useSession();

  const {
    data: categoryData,
    error: categoryError,
    mutate: mutateCategory,
  } = useSWR("/api/perf360/news/category", fetcher);

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  useEffect(() => {
    if (!GroupData) return;
  }, [GroupData]);

  useEffect(() => {
    if (GroupData) {
      setGroup(GroupData.map((g) => g.value));
    }
  }, [GroupData]);

  useEffect(() => {
    if (data) {
      setForm({
        category: data.category,
        start_date: data.start_date,
        end_date: data.end_date,
        title: data.title,
        url: data.url,
        display: data.display,
        active: data.active,
      });
      setContent(data.content);
      setFiles(data.image);
      setGroup(data.group);
      setPosition(data.position ?? []);
    }
  }, [data]);

  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClickClose = () => {
    setOpenImage(false);
  };

  const handleSubmit = async () => {
    const newData = {
      category: form.category,
      group,
      start_date: form.start_date || new Date(),
      end_date: form.end_date || new Date(),
      title: form.title,
      url: form.url,
      content: content,
      display: form.display,
      position,
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
      const res = await axios.put(`/api/perf360/news/${data._id}`, newData);
      if (res.data.success) {
        toast.success("แก้ไข popup เรียบร้อย");
        handleClear();
        mutate();
        onClose();
      }
    } else {
      try {
        newData.creator = session?.user?.id || ""; // ตรวจสอบให้แน่ใจว่ามีค่า
        const res = await axios.post("/api/perf360/news", newData);
        if (res.data.success) {
          toast.success("บันทึก popup เรียบร้อย");
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
      category: "",
      start_date: "",
      end_date: "",
      title: "",
      url: "",
      display: "",
      active: true,
    });
    setContent(`<p>พิมพ์ข้อความข่าวสารที่ต้องการแสดง</p>`);
    setGroup(GroupData.map((g) => g.value));
    setFiles(null);
    setPosition([]);
    onClose();
  };

  const handleClose = () => {
    handleClear();
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

  const handleToggleGroup = (value) => {
    if (!Array.isArray(group)) return;
    setGroup((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleAddPosition = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && Array.isArray(position) && !position.includes(value)) {
        setPosition([...position, value]);
        e.target.value = ""; // Clear input after adding
      }
    }
  };

  const handleDeletePosition = (index) => {
    setPosition(position.filter((_, i) => i !== index));
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
  };

  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  const handleChangeCategory = (value) => {
    if (value === "addCategory") {
      handleOpenCategory();
      setForm((prevForm) => ({
        ...prevForm,
        category: "",
      }));
      return;
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        category: value,
      }));
    }
  };

  const handleAddCategory = async () => {
    if (category) {
      try {
        const res = await axios.post("/api/perf360/news/category", {
          name: category,
        });
        if (res.data.success) {
          toast.success("บันทึกหมวดข่าวสารเรียบร้อย");
          handleCloseCategory();
          setCategory("");
          mutateCategory();
        }
      } catch (error) {
        toast.error("บันทึกหมวดข่าวสารไม่สําเร็จ");
        console.log(error);
      }
    } else {
      toast.error("กรุณากรอกหมวดข่าวสาร");
    }
  };

  const handleCancelCategory = () => {
    setCategory("");
    handleCloseCategory();
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/perf360/news/category/${id}`);
      if (res.data.success) {
        toast.success("ลบหมวดข่าวสารเรียบร้อย");
        mutateCategory();
      }
    } catch (error) {
      toast.error("ลบหมวดข่าวสารไม่สําเร็จ");
      console.log(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center py-4 px-2 bg-[#0056FF] text-white w-full">
        <h2 className="text-xl font-bold">Popup Menu</h2>
        <IoClose size={25} onClick={handleClose} />
      </div>
      <div className="flex flex-col px-4 py-2 gap-2 w-full">
        <h2 className="font-bold text-lg text-[#0056FF]">
          {newData ? "เพิ่ม" : "แก้ไข"}ข่าวสาร
        </h2>

        <div className="flex flex-col w-full">
          <label htmlFor="teamGrop" className="font-bold">
            กลุ่มพนักงาน
          </label>
          <div className="flex flex-row items-center justify-between border border-gray-200 rounded-lg p-2 w-full">
            {GroupData &&
              GroupData.map((g, index) => (
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
          <label htmlFor="category" className="font-bold">
            หมวดข่าวสาร
          </label>
          <select
            name="category"
            id="category"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.category}
            onChange={(e) => handleChangeCategory(e.target.value)}
          >
            <option value="">เลือกหมวดข่าวสาร</option>
            {categoryData && categoryData.data.length > 0
              ? categoryData.data.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))
              : null}
            <Divider />
            <option value={"addCategory"}>เพิ่มหมวดข่าวสาร</option>
          </select>
        </div>

        <div className="flex flex-col col-span-2">
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

        <div className="flex flex-col col-span-2">
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
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="display" className="font-bold">
            ประเภทการแสดงข่าวสาร
            <span className="text-red-500">*</span>
          </label>
          <select
            name="display"
            id="display"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.display}
            onChange={(e) => setForm({ ...form, display: e.target.value })}
          >
            <option value="">เลือกประเภทการแสดงข่าวสาร</option>
            <option value="url">เชื่อมโยงลิงก์ภายนอก</option>
            <option value="popup">Popup</option>
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="url" className="font-bold">
            ลิงก์ที่ใช้เชื่อมโยงไประบบงานอื่น
          </label>
          <input
            name="url"
            id="url"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="URL ที่จะเชื่อมต่อระบบ"
          />
        </div>

        <div className="flex flex-col flex-wrap w-full">
          <label htmlFor="position" className="font-bold">
            ตำแหน่งพนักงานที่เข้าใช้งาน
          </label>

          <div className="flex flex-wrap gap-2 mb-2">
            {position &&
              position.map((pos, index) => (
                <div
                  key={index}
                  className="text-xs bg-gray-200 px-3 py-0.5 rounded-full flex items-center"
                >
                  <span>{pos}</span>
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => handleDeletePosition(index)}
                  >
                    x
                  </button>
                </div>
              ))}
          </div>

          <input
            type="text"
            className="border rounded-md p-2 w-full"
            placeholder="พิมพ์ตำแหน่งแล้วกด Spacebar หรือ Enter"
            onKeyDown={handleAddPosition}
          />
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
          folder="popup"
          newUpload={!files}
        />
      </Dialog>

      <Dialog
        open={openCategory}
        onClose={handleCloseCategory}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "100%",
          },
        }}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center justify-between p-2 bg-[#0056FF] text-white w-full">
            <h2 className="text-xl font-bold">ประเภทข่าวสาร</h2>
            <IoClose size={25} onClick={handleCloseCategory} />
          </div>
          <div className="flex flex-col w-full">
            {categoryData &&
              categoryData.data.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between px-4 py-1 border-b border-gray-300"
                >
                  <span>{category.name}</span>
                  <IoClose
                    size={25}
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDeleteCategory(category._id)}
                  />
                </div>
              ))}
          </div>
          <div className="flex flex-row gap-2 p-4">
            <div className="flex flex-col w-full">
              <label htmlFor="category" className="font-bold">
                ชื่อหมวดหมู่
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="ชื่อหมวดหมู่"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center gap-2 px-4 pb-4">
            <button
              className="px-4 py-2 bg-[#0056FF] rounded-lg text-white font-bold"
              onClick={handleAddCategory}
            >
              เพิ่ม
            </button>
            <button
              className="px-4 py-2 bg-[#F2871F] rounded-lg text-white font-bold"
              onClick={handleCancelCategory}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
