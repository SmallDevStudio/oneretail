import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Slide, Divider } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const rules = [
  { image: "/images/club/rules/2026/1.jpg" },
  { image: "/images/club/rules/2026/2.jpg" },
  { image: "/images/club/rules/2026/3.jpg" },
  { image: "/images/club/rules/2026/4.jpg" },
  { image: "/images/club/rules/2026/5.jpg" },
  { image: "/images/club/rules/2026/6.jpg" },
  { image: "/images/club/rules/2026/7.jpg" },
  { image: "/images/club/rules/2026/8.jpg" },
  { image: "/images/club/rules/2026/9.jpg" },
  { image: "/images/club/rules/2026/10.jpg" },
  { image: "/images/club/rules/2026/11.jpg" },
  { image: "/images/club/rules/2026/12.jpg" },
  { image: "/images/club/rules/2026/13.jpg" },
  { image: "/images/club/rules/2026/14.jpg" },
  { image: "/images/club/rules/2026/15.jpg" },
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
        <div className="flex flex-col tracking-tight items-center text-center">
          {rules.map((item, index) => (
            <Image
              key={index}
              src={item.image}
              alt={`rule-${index}`}
              width={800}
              height={800}
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
