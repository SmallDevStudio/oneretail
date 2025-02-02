import React, { useState } from "react";
import Image from "next/image";
import { TbZoomScan } from "react-icons/tb";
import { Dialog, Slide } from "@mui/material";
import {
  IoCloseCircleOutline,
  IoDownload,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageTab({ ImageData }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setZoom(1); // รีเซ็ต zoom เมื่อเปิด modal ใหม่
    setOffset({ x: 0, y: 0 }); // รีเซ็ตตำแหน่งเลื่อนภาพ
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setOpenModal(false);
  };

  // ฟังก์ชันเพิ่ม zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  // ฟังก์ชันลด zoom
  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.2, 1);
      if (newZoom === 1) {
        setOffset({ x: 0, y: 0 }); // รีเซ็ต offset เมื่อ zoom กลับไปที่ 1
      }
      return newZoom;
    });
  };

  // ฟังก์ชัน download ไฟล์ต้นฉบับ
  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      // ดึงชื่อไฟล์จาก URL ถ้าไม่พบก็ใช้ default
      const filename = url.split("/").pop() || "downloaded_file";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error: ", error);
    }
  };

  // Event handlers สำหรับ dragging (Desktop)
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setDragging(true);
      setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging && zoom > 1) {
      setOffset({
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseLeave = () => {
    setDragging(false);
  };

  // Event handlers สำหรับ dragging (Mobile - Touch)
  const handleTouchStart = (e) => {
    if (zoom > 1) {
      setDragging(true);
      const touch = e.touches[0];
      setStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (dragging && zoom > 1) {
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - start.x,
        y: touch.clientY - start.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <div className="flex w-full mt-2 px-2 py-2 bg-white h-screen">
      {ImageData?.length > 0 ? (
        <div className="grid grid-cols-3 justify-between w-full gap-2">
          {ImageData.map((image, index) => (
            <div
              key={index}
              onClick={() => handleOpenModal(image)}
              className="relative cursor-pointer w-[120px] h-[120px]"
            >
              <Image
                src={image.url}
                alt={image.public_id}
                width={120}
                height={120}
                className="object-cover w-[120px] h-[120px] rounded-md"
              />
              <div className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-50 rounded-tl-md">
                <TbZoomScan className="text-white" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseModal}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            borderRadius: 0,
            width: "100%",
          },
        }}
      >
        {selectedImage && (
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Container สำหรับภาพที่สามารถลากได้ */}
              <div
                className={`overflow-hidden ${zoom > 1 ? "cursor-grab" : "cursor-default"}`}
                style={{
                  width: "500px",
                  height: "500px",
                  touchAction: "none", // ป้องกัน scroll บนมือถือ
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.public_id}
                  width={500}
                  height={500}
                  style={{
                    transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                    transition: dragging ? "none" : "transform 0.3s",
                  }}
                  className="object-cover"
                  loading="eager"
                />
              </div>
            </div>
            {/* Toolbar สำหรับ zoom และ download */}
            <div className="flex gap-4 mt-2 bg-black bg-opacity-50 p-2 rounded">
              <IoRemoveCircleOutline
                onClick={zoom > 1 ? handleZoomOut : null}
                className={`cursor-pointer ${zoom > 1 ? "text-white" : "text-gray-400"}`}
                size={30}
              />
              <IoAddCircleOutline
                onClick={zoom < 3 ? handleZoomIn : null}
                className={`cursor-pointer ${zoom < 3 ? "text-white" : "text-gray-400"}`}
                size={30}
              />
              <IoDownload
                onClick={() => handleDownload(selectedImage.url)}
                className="text-white cursor-pointer"
                size={30}
              />

              <IoCloseCircleOutline
                className="text-white cursor-pointer"
                onClick={handleCloseModal}
                size={30}
              />

            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
