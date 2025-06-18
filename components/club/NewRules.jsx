import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Slide, Divider } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const rules = [
  { image: "/images/club/rules/0.png" },
  { image: "/images/club/rules/Slide2.jpeg" },
  { image: "/images/club/rules/Slide3.jpeg" },
  { image: "/images/club/rules/Slide4.jpeg" },
  { image: "/images/club/rules/Slide5.jpeg" },
  { image: "/images/club/rules/Slide6.jpeg" },
  { image: "/images/club/rules/Slide7.jpeg" },
  { image: "/images/club/rules/Slide8.jpeg" },
  { image: "/images/club/rules/Slide9.jpeg" },
  { image: "/images/club/rules/Slide10.jpeg" },
  { image: "/images/club/rules/Slide11.jpeg" },
  { image: "/images/club/rules/Slide12.jpeg" },
  { image: "/images/club/rules/Slide13.jpeg" },
  { image: "/images/club/rules/Slide14.jpeg" },
  { image: "/images/club/rules/Slide15.jpeg" },
  { image: "/images/club/rules/Slide16.jpeg" },
  { image: "/images/club/rules/Slide17.jpeg" },
  { image: "/images/club/rules/Slide18.jpeg" },
  { image: "/images/club/rules/Slide19.jpeg" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewRules() {
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenImage = (image) => {
    setSelectedImage(image);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setOpenImage(false);
  };

  return (
    <div className="flex w-full bg-gray-200 min-h-screen pb-20">
      <div className="flex flex-col bg-white w-full">
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/images/club/rules/new-logo.png"
            alt="new-rules"
            width={350}
            height={350}
            className="object-contain px-8"
          />
        </div>
        <div className="flex flex-col px-4 py-4 tracking-tight items-center text-center text-[13px] bg-white">
          <span className="text-blue-950">
            คือการแข่งขันเพื่อค้นหาสุดยอดคนเก่ง แห่งชาว Retail และ AL
            เพื่อเข้าคลับสุดพิเศษ เพื่อยกระดับศักยภาพ สร้างแรงบันดาลใจ
            และมอบสิทธิพิเศษสุดพรีเมียมสำหรับ Top Sales ที่ไม่หยุดพัฒนา Target:
            Top Sales ตั้งแต่ผลงานระดับ V ขึ้นไป ของทุกตำแหน่ง (E-V Performance)
          </span>
        </div>
        <div className="flex flex-col tracking-tight items-center text-center">
          {rules.map((item, index) => (
            <Image
              key={index}
              src={item.image}
              alt={`rule-${index}`}
              width={500}
              height={500}
              className="object-contain"
              onClick={() => handleOpenImage(item.image)}
            />
          ))}
        </div>
      </div>

      <Dialog
        open={openImage}
        onClose={handleCloseImage}
        TransitionComponent={Transition}
        className="flex items-center justify-center"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            boxShadow: "none",
            margin: 0,
            padding: 0,
          },
        }}
      >
        <div className="flex flex-col items-center">
          <button
            onClick={handleCloseImage}
            className="flex items-center justify-end p-2 w-full"
          >
            <IoIosCloseCircleOutline className="w-6 h-6 text-[#0056FF] bg-white rounded-full" />
          </button>
          {selectedImage && (
            <Zoom>
              <Image
                src={selectedImage}
                alt="rule"
                width={500}
                height={500}
                className="object-contain"
              />
            </Zoom>
          )}
        </div>
      </Dialog>
    </div>
  );
}
