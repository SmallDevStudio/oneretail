import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Divider, Slide, Dialog } from "@mui/material";
import { FaRegImage } from "react-icons/fa";
import Upload from "../utils/Upload";
import { deleteFile } from "@/lib/hook/useStorage";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { nanoid } from "nanoid";
import { RiCoupon3Line } from "react-icons/ri";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CouponForm({ onClose, mutate, data, newCoupon }) {
  const [form, setForm] = useState({
    code: "",
    descriptions: "",
    start_date: null,
    end_date: null,
    point: 0,
    coins: 0,
    stock: 0,
    note: "",
    repeatable: false,
  });
  const [files, setFiles] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({
    code: "",
    stock: "",
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  useEffect(() => {
    if (data) {
      setForm({
        code: data.code,
        descriptions: data.descriptions,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        point: data.point,
        coins: data.coins,
        stock: data.stock,
        note: data.note,
        repeatable: data.repeatable,
      });
      setFiles(data.image);
    }
  }, [data]);

  useEffect(() => {
    if (form.code !== "") {
      setErr({ ...err, code: "" });
      return;
    }
    if (form.stock > 0) {
      setErr({ ...err, stock: "" });
      return;
    }
  }, [err, form.code, form.stock]);

  const handleUpload = (files) => {
    const file = files[0];
    setFiles({
      public_id: file.public_id,
      url: file.url,
    });
  };

  const handleDeleteImage = async (url, fileId) => {
    try {
      await deleteFile(fileId, url);
      setFiles(null);
      toast.success("ลบรูปแล้ว");
    } catch (error) {
      console.log(error);
      toast.error("ลบรูปไม่สำเร็จ");
    }
  };

  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClickClose = () => {
    setOpenImage(false);
  };

  const handleSubmit = async () => {
    if (form.code.trim() === "") {
      toast.error("กรุณากรอกรหัสคูปอง");
      setErr({ ...err, code: "กรุณากรอกรหัสคูปอง" });
      return;
    }

    if (isSubmitting) return; // ❌ ป้องกันการกดซ้ำ

    setIsSubmitting(true); // ✅ เริ่มการบล็อค

    const newData = {
      ...form,
      image: files,
    };

    try {
      if (newCoupon && !data) {
        newData.created_by = session?.user?.id;
        const res = await axios.post("/api/coupons", newData);
        if (res.data.success) {
          toast.success("บันทึกคูปองเรียบร้อย");
          handleClear();
          mutate();
          onClose();
        }
      } else {
        newData.updated_by = session?.user?.id;
        const res = await axios.put(`/api/coupons/${data.code}`, newData);
        if (res.data.success) {
          toast.success("แก้ไขคูปองเรียบร้อย");
          handleClear();
          mutate();
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(newCoupon ? "บันทึกคูปองไม่สำเร็จ" : "แก้ไขคูปองไม่สำเร็จ");
    } finally {
      setIsSubmitting(false); // ✅ หยุด block
    }
  };

  const handleClear = () => {
    setForm({
      code: "",
      descriptions: "",
      start_date: null,
      end_date: null,
      point: 0,
      coins: 0,
      stock: 0,
      note: "",
      repeatable: false,
    });
    setFiles(null);
    setErr({});
    onClose();
  };

  const generateCode = () => {
    const code = nanoid(6);
    setForm({ ...form, code });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row items-center text-white justify-between bg-[#0056FF] px-6 py-4 w-full">
        <h2 className="text-lg font-bold">
          {newCoupon ? "เพิ่มคูปอง" : "แก้ไขคูปอง"}
        </h2>
        <IoClose className="text-lg cursor-pointer" onClick={handleClear} />
      </div>

      {/* Form */}
      <div className="flex flex-col text-sm gap-2 p-4 w-full">
        <div className="flex flex-col">
          <label htmlFor="code" className="font-bold">
            โค้ด
          </label>
          <div className="flex flex-row gap-2">
            <input
              type="text"
              name="code"
              id="code"
              className={`text-sm p-2 border rounded-xl
              ${err.code ? "border-red-500" : "border-gray-300"}`}
              placeholder="โค้ด"
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              value={form.code}
            />
            <button
              onClick={generateCode}
              className="bg-[#0056FF] text-white py-2 px-4 rounded-xl"
            >
              Generate Code
            </button>
          </div>
          {err.code && <span className="text-red-500">{err.code}</span>}
        </div>

        <div>
          <label htmlFor="descriptions" className="font-bold">
            คําอธิบาย
          </label>
          <textarea
            type="text"
            name="descriptions"
            id="descriptions"
            className="text-sm w-full p-2 border border-gray-300 rounded-xl"
            placeholder="คําอธิบาย"
            onChange={(e) => setForm({ ...form, descriptions: e.target.value })}
            value={form.descriptions}
          />
        </div>

        <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="start_date" className="font-bold">
              วันที่เริ่ม
            </label>
            <DatePicker
              selected={form.start_date ? new Date(form.start_date) : null}
              onChange={(date) =>
                setForm({
                  ...form,
                  start_date: date ? date.toISOString().split("T")[0] : null,
                })
              }
              dateFormat="dd-MM-yyyy"
              placeholderText="เลือกวันที่เริ่มต้น"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <label htmlFor="end_date" className="font-bold">
              วันที่สิ้นสุด
            </label>
            <DatePicker
              selected={form.end_date ? new Date(form.end_date) : null}
              onChange={(date) =>
                setForm({
                  ...form,
                  end_date: date ? date.toISOString().split("T")[0] : null,
                })
              }
              dateFormat="dd-MM-yyyy"
              placeholderText="เลือกวันที่สิ้นสุด"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col w-full">
            <label htmlFor="point" className="font-bold">
              point
            </label>
            <input
              type="number"
              name="point"
              id="point"
              className="text-sm p-2 border border-gray-300 rounded-xl"
              placeholder="point"
              onChange={(e) => setForm({ ...form, point: e.target.value })}
              value={form.point}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="coins" className="font-bold">
              coins
            </label>
            <input
              type="number"
              name="coins"
              id="coins"
              className="text-sm p-2 border border-gray-300 rounded-xl"
              placeholder="coins"
              onChange={(e) => setForm({ ...form, coins: e.target.value })}
              value={form.coins}
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="stock" className="font-bold">
                จำนวนคูปอง
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                className={`text-sm p-2 border rounded-xl
                ${err.stock ? "border-red-500" : "border-gray-300"}`}
                placeholder="stock"
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                value={form.stock}
              />
            </div>
            {err.stock && <span className="text-red-500">{err.stock}</span>}
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="repeatable" className="font-bold">
              ใช้โค้ดได้หลายครั้ง
            </label>
            <select
              name="repeatable"
              id="repeatable"
              className="text-sm p-2 border border-gray-300 rounded-xl"
              onChange={(e) => setForm({ ...form, repeatable: e.target.value })}
              value={form.repeatable}
            >
              <option value="true">ใช่</option>
              <option value="false">ไม่ใช่</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="font-bold">
            หมายเหตุ
          </label>
          <textarea
            type="text"
            name="note"
            id="note"
            className="text-sm w-full p-2 border border-gray-300 rounded-xl"
            placeholder="หมายเหตุ"
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            value={form.note}
            rows={4}
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
          folder="perf360"
          newUpload={!files}
        />
      </Dialog>
    </div>
  );
}
