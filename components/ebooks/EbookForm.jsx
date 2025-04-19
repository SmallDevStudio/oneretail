import React, { useState, useEffect } from "react";
import Upload from "@/components/utils/Upload";
import { Slide, Dialog, Divider } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { GiBookCover } from "react-icons/gi";
import { LuNotebookText } from "react-icons/lu";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EbookForm({ onClose, userId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: {},
    ebook: {},
    url: "",
    category: "",
    group: "",
    type: "",
  });
  const [openUpload, setOpenUpload] = useState(null);

  useEffect(() => {
    if (form.ebook?.file_name) {
      setForm((prev) => ({
        ...prev,
        title: prev.title === "" ? form.ebook.file_name : prev.title,
        url: form.ebook.url,
      }));
    }
  }, [form.ebook]);

  const handleUploadImage = (image) => {
    const imageData = image[0];
    setForm({ ...form, image: imageData });
  };

  const handleUploadEbook = (files) => {
    console.log("files", files);
    const ebookData = files[0];
    setForm({
      ...form,
      ebook: ebookData,
    });
  };

  const handleSubmit = async () => {
    if (form.title === "") {
      toast.error("กรุณากรอกชื่อหนังสือ");
      return;
    }

    if (form.ebook === null) {
      toast.error("กรุณาเลือกไฟล์หนังสือ");
      return;
    }

    const ebookData = {
      title: form.title,
      description: form.description,
      image: form.image?.url ? form.image : undefined, // ✅ ส่งเมื่อมีค่า
      ebook: form.ebook,
      url: form.url || "",
      category: form.category,
      group: form.group,
      type: form.ebook?.mime_type || "",
      creator: userId,
    };

    try {
      const response = await axios.post("/api/ebook", ebookData);
      console.log(response.data);
      toast.success("เพิ่มหนังสือเรียบร้อย");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("เพิ่มหนังสือไม่สําเร็จ");
    }
  };

  const handleClear = () => {
    setForm({
      title: "",
      description: "",
      image: {},
      ebook: {},
      url: "",
      category: "",
      group: "",
      type: "",
    });
    setOpenUpload(null);
    onClose();
  };

  const handleOpenUpload = (type) => {
    setOpenUpload(type);
  };
  const handleCloseUpload = () => {
    setOpenUpload(null);
  };

  const handleFileIcon = (type) => {
    if (type === "application/pdf") {
      return "/images/iconfiles/pdf.png";
    } else if (type === "application/msword") {
      return "/images/iconfiles/doc.png";
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "/images/iconfiles/doc.png";
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return "/images/iconfiles/xls.png";
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return "/images/iconfiles/ppt.png";
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row items-center bg-[#0056FF] text-white p-2 gap-2">
        <IoIosArrowBack size={30} onClick={onClose} />
        <span className="text-xl font-bold">Upload Files</span>
      </div>
      {/* Form */}
      <div className="flex flex-col p-4 gap-2">
        <h2 className="text-xl font-bold">เพิ่มหนังสือ</h2>
        <Divider sx={{ mb: 1 }} />
        <div className="grid grid-cols-2 mb-4 gap-4">
          {/* Ebook */}
          <div className="flex flex-col gap-2">
            {/* preview */}
            <div>
              {form?.ebook && form?.ebook.url && (
                <div className="flex justify-center">
                  <Image
                    src={handleFileIcon(form?.ebook?.mime_type)}
                    alt="preview"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            {/* botton */}
            <div
              className="flex flex-row items-center border border-gray-200 rounded-xl p-4 gap-2 hover:bg-gray-200 cursor-pointer shadow-lg"
              onClick={() => handleOpenUpload("ebook")}
            >
              <LuNotebookText size={25} />
              <div className="flex flex-col gap-1">
                <span className="text-[#0056FF] font-bold text-lg">
                  Upload Ebook
                </span>
              </div>
            </div>
          </div>
          {/* Cover */}
          <div className="flex flex-col gap-2">
            {/* preview */}
            <div>
              {form?.image && form?.image?.url && (
                <div>
                  <Image
                    src={form?.image.url}
                    alt="preview"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            {/* botton */}
            <div
              className="flex flex-row items-center border border-gray-200 rounded-xl p-4 gap-2 hover:bg-gray-200 cursor-pointer shadow-lg"
              onClick={() => handleOpenUpload("cover")}
            >
              <GiBookCover size={25} />
              <div className="flex flex-col gap-1">
                <span className="text-[#0056FF] font-bold text-lg">
                  Upload Cover
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor="title" className="font-bold">
            ชื่อ:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-1/2 px-2 py-1 border border-gray-300 rounded-xl"
            placeholder="ชื่อหนังสือ"
            required
          />
        </div>
        <div className="flex flex-row gap-2">
          <label htmlFor="description" className="font-bold">
            รายละเอียด:
          </label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-1/2 px-2 py-1 border border-gray-300 rounded-xl"
            placeholder="รายละเอียดหนังสือ"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="category" className="font-bold">
              Category:
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded-xl"
              placeholder="Category"
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <label htmlFor="group" className="font-bold">
              Group:
            </label>
            <input
              type="text"
              name="group"
              id="group"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded-xl"
              placeholder="Group"
            />
          </div>
        </div>

        <div className="flex flex-row justify-center mt-5 items-center gap-4">
          <button
            className="px-6 py-1 bg-[#0056FF] rounded-xl text-white font-bold text-lg"
            onClick={handleSubmit}
          >
            บันทึก
          </button>
          <button
            className="px-6 py-1 bg-red-500 rounded-xl text-white font-bold text-lg"
            onClick={handleClear}
          >
            ยกเลิก
          </button>
        </div>
      </div>
      <Dialog
        open={openUpload}
        onClose={handleCloseUpload}
        TransitionComponent={Transition}
      >
        <Upload
          onClose={handleCloseUpload}
          setFiles={
            openUpload === "ebook" ? handleUploadEbook : handleUploadImage
          }
          folder="ebook"
          userId={userId}
        />
      </Dialog>
    </div>
  );
}
