import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Slide, Divider } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";

const rules = [
  { image: "/images/club/rules/0.png" },
  { image: "/images/club/rules/1.jpeg" },
  { image: "/images/club/rules/2.jpeg" },
  { image: "/images/club/rules/3.jpeg" },
  { image: "/images/club/rules/4.jpeg" },
  { image: "/images/club/rules/5.jpeg" },
  { image: "/images/club/rules/6.jpeg" },
  { image: "/images/club/rules/7.jpeg" },
  { image: "/images/club/rules/8.jpeg" },
  { image: "/images/club/rules/9.jpeg" },
  { image: "/images/club/rules/10.jpeg" },
  { image: "/images/club/rules/11.jpeg" },
  { image: "/images/club/rules/12.jpeg" },
  { image: "/images/club/rules/13.jpeg" },
  { image: "/images/club/rules/14.jpeg" },
  { image: "/images/club/rules/15.jpeg" },
  { image: "/images/club/rules/16.jpeg" },
  { image: "/images/club/rules/17.jpeg" },
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
    <div className="flex w-full min-h-screen">
      <div className="flex flex-col w-full">
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
            <Image
              src={selectedImage}
              alt="rule"
              width={500}
              height={500}
              className="object-contain"
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}
