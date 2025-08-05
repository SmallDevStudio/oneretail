import React, { useState, useEffect, useRef } from "react";
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
import { FaRegImage, FaRegFileAlt, FaPlus, FaMinus } from "react-icons/fa";
import Upload from "../utils/Upload";
import Image from "next/image";
import { deleteFile } from "@/lib/hook/useStorage";
import Swal from "sweetalert2";
import NewGroup from "./NewGroup";
import NewTabs from "./NewTabs";
import Link from "next/link";

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
    display: "",
    active: true,
  });
  const [content, setContent] = useState("พิมพ์ข้อความข่าวสารที่ต้องการแสดง");
  const [openImage, setOpenImage] = useState(false);
  const [type, setType] = useState("");
  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [video, setVideo] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideo, setOpenVideo] = useState(false);
  const [group, setGroup] = useState("");
  const [tab, setTab] = useState("");

  const { data: session, status } = useSession();

  const router = useRouter();
  const didInit = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [session, status]);

  useEffect(() => {
    if (!data || didInit.current) return;

    setForm({
      start_date: data.start_date,
      end_date: data.end_date,
      title: data.title,
      url: data.url,
      display: data.display,
      active: data.active,
    });
    setContent(data.content);
    setCover(data.cover ? data.cover : null);
    setImages(data.images ? data.images : []);
    setVideo(data.video ? data.video : []);
    setFiles(
      data.files
        ? data.files.map((file) => ({
            ...file,
            icon: getFileIcon(file.mime_type),
          }))
        : []
    );
    setGroup(data.group ? data.group : "");
    setTab(data.tab ? data.tab : "");

    // ✅ ป้องกันไม่ให้ useEffect ทำงานซ้ำอีกครั้ง
    didInit.current = true;
  }, [data]);

  const handleClickOpen = (type) => {
    setType(type);
    setOpenImage(true);
  };

  const handleClickClose = () => {
    setType("");
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

  const handleUpload = (type, files) => {
    const filesWithIcon = files.map((file) => ({
      ...file,
      icon: getFileIcon(file.mime_type),
    }));

    if (type === "images") {
      setFiles((prev) => [...(prev || []), ...filesWithIcon]);
    } else if (type === "cover") {
      setCover(filesWithIcon[0]);
    } else if (type === "files") {
      setFiles((prev) => [...(prev || []), ...filesWithIcon]);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const newData = {
      group: group,
      tab: tab,
      start_date: form.start_date || new Date().toISOString(),
      end_date: form.end_date || new Date().toISOString(),
      title: form.title,
      url: form.url,
      content: content,
      display: form.display,
      active: form.active,
      images: images,
      cover: cover,
      files: files,
      video: video,
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

  const getFileIcon = (type) => {
    const fileType = type?.toLowerCase() || "";
    if (!fileType) return "/images/iconfiles/other.png";

    if (fileType.includes("pdf")) return "/images/iconfiles/pdf.png";
    if (fileType.includes("msword") || fileType.includes("doc"))
      return "/images/iconfiles/doc.png";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "/images/iconfiles/xls.png";
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return "/images/iconfiles/ppt.png";

    return "/images/iconfiles/other.png";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  };

  const handleClear = () => {
    setForm({
      start_date: "",
      end_date: "",
      title: "",
      url: "",
      display: "",
      active: true,
    });
    setContent(`<p>พิมพ์ข้อความข่าวสารที่ต้องการแสดง</p>`);
    setFiles(null);
    setGroup("");
    setTab("");
    onClose();
  };

  const handleAddVideo = async () => {
    try {
      const res = await axios.post("/api/getyoutube", { youtubeUrl: videoUrl });
      const video = res.data;
      setVideo((prev) => [...prev, video]);
      setVideoUrl("");
      setOpenVideo(false);
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารถดึงข้อมูล YouTube ได้");
    }
  };

  const handleDeleteVideo = (index) => {
    setVideo((prev) => prev.filter((_, i) => i !== index));
  };

  console.log("video", video);

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
            <NewGroup setGroup={setGroup} group={group} />
          </div>

          <div className="flex flex-col w-full">
            <NewTabs setTab={setTab} tab={tab} />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="descriptions" className="font-bold">
            เนื้อหา
          </label>
          <textarea
            name="content"
            id="content"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="พิมพ์เนื้อหา"
            rows={5}
            cols={5}
          />
        </div>

        {/* Cover & Images */}
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="cover" className="font-bold">
              รูปปก
            </label>

            {cover && (
              <div className="relative">
                <Image
                  src={cover.url}
                  alt="Cover"
                  width={200}
                  height={200}
                  className="object-cover "
                />
                <IoClose
                  size={25}
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => handleDeleteImage(cover.url, cover.public_id)}
                />
              </div>
            )}
            <div
              className="flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg w-52 cursor-pointer"
              onClick={() => handleClickOpen("cover")}
            >
              <FaRegImage size={25} />
              <div className="flex flex-col">
                <span>อัพโหลดรูปปก</span>
                <span className="text-xs">(อัพโหลดได้ 1 ไฟล์)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2 w-full">
            <label htmlFor="images" className="font-bold">
              รูปภาพ
            </label>
            {images && images.length > 0 && (
              <div className="flex flex-row items-center gap-2 w-full overflow-x-auto">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image.url}
                      alt={`Image ${index}`}
                      width={200}
                      height={200}
                      className="object-cover rounded-md"
                    />
                    <IoClose
                      key={index}
                      size={25}
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() =>
                        handleDeleteImage(image.url, image.public_id)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <div
              className="flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg w-52 cursor-pointer"
              onClick={() => handleClickOpen("images")}
            >
              <FaRegImage size={25} />
              <div className="flex flex-col">
                <span>อัพโหลดรูปภาพ</span>
                <span className="text-xs">(อัพโหลดได้หลายไฟล์)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          <label htmlFor="files" className="font-bold">
            ไฟล์
          </label>

          {files && files.length > 0 && (
            <div className="flex flex-row items-center gap-2 mt-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border p-2 rounded-md bg-gray-50"
                >
                  <Image
                    src={file.icon}
                    alt="file-icon"
                    width={30}
                    height={30}
                  />
                  <div className="flex flex-col">
                    <Link
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="font-medium">{file.file_name}</span>
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.file_size)}
                    </span>
                  </div>
                  <IoClose
                    size={20}
                    className="ml-auto cursor-pointer text-red-500"
                    onClick={() => handleDeleteImage(file.url, file.public_id)}
                  />
                </div>
              ))}
            </div>
          )}

          <div
            className="flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg w-52 cursor-pointer"
            onClick={() => handleClickOpen("files")}
          >
            <FaRegFileAlt size={22} />
            <div className="flex flex-col">
              <span>อัพโหลดไฟล์</span>
              <span className="text-xs">(อัพโหลดได้หลายไฟล์)</span>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="flex flex-col w-full mt-2">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="video" className="font-bold">
              วีดีโอ
            </label>
            <div
              className="bg-[#F2871F] rounded-full p-1 text-white"
              onClick={() => {
                setOpenVideo(!openVideo);
                setVideoUrl("");
              }}
            >
              {openVideo ? <FaMinus size={18} /> : <FaPlus size={18} />}
            </div>
          </div>
          {video && video.length > 0 && (
            <div className="my-2 w-full overflow-x-auto">
              {video.map((v, i) => (
                <div key={i} className="relative w-[200px]">
                  <Image
                    src={v.thumbnailUrl}
                    alt={`video-thumbnail ${i}`}
                    width={200}
                    height={200}
                    className="object-cover rounded-md"
                  />
                  <IoClose
                    key={i}
                    size={25}
                    className="absolute top-0 right-0 cursor-pointer text-red-500"
                    onClick={() => handleDeleteVideo(i)}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Get Video */}
          {openVideo && (
            <div className="flex items-center gap-2 mt-2">
              <label htmlFor="url" className="font-bold">
                URL:
              </label>
              <input
                type="text"
                id="url"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=your-video-id"
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded w-32"
                onClick={handleAddVideo}
              >
                เพิ่มวีดีโอ
              </button>
            </div>
          )}
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
        TransitionComponent={Transition}
      >
        <Upload
          onClose={handleClickClose}
          setFiles={(files) => handleUpload(type, files)}
          folder="news"
          newUpload={!files}
        />
      </Dialog>
    </div>
  );
}
