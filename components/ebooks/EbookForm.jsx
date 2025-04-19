import React, { useState, useEffect } from "react";
import Upload from "@/components/utils/Upload";
import { Slide, Dialog, Divider } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { GiBookCover } from "react-icons/gi";
import { LuNotebookText } from "react-icons/lu";
import { toast } from "react-toastify";

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

  const handleUploadImage = (image) => {
    const imageData = image[0];
    setForm({ ...form, image: imageData });
  };

  const handleUploadEbook = (ebook) => {
    const ebookData = ebook[0];
    setForm({
      ...form,
      ebook: ebookData,
      url: ebookData.url,
      type: ebookData.mime_type,
    });
  };

  const handleSubmit = async () => {
    console.log("form", form);
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
  };

  const handleOpenUpload = (type) => {
    setOpenUpload(type);
  };
  const handleCloseUpload = () => {
    setOpenUpload(null);
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
            <div></div>
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
            <div></div>
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
