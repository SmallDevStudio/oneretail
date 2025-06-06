import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Slide, Dialog } from "@mui/material";
import ECer from "./ECer";
import Avatar from "@/components/utils/Avatar";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserPanel({ data, onClose }) {
  const [openCer, setOpenCer] = useState(false);

  return (
    <div>
      {/* Header */}
      <div>
        <IoClose size={30} onClick={onClose} className="cursor-pointer" />
      </div>
      {/* Body */}
      <div className="p-4">
        <div className="flex flex-col items-center">
          {data?.user ? (
            <Avatar
              src={data.user.pictureUrl}
              size={100}
              userId={data.user.userId}
            />
          ) : (
            <Avatar src={"/images/Avatar.jpg"} size={100} />
          )}
        </div>
        <div className="text-center mt-4">
          <p className="font-bold text-lg text-[#0056FF]">{data?.rewardtype}</p>
          <p className="font-bold text-sm">
            Rank: <span>{data?.rank}</span>
          </p>
          <p className="font-bold">{data?.name}</p>
          <p className="font-bold">{data?.region}</p>
          <p className="text-sm">{data?.branch}</p>
          <p className="text-sm">{data?.zone}</p>
          <p>
            KPI: <span className="font-bold">{data?.achieve}</span>
          </p>
          <div className="mt-4">
            <button
              className="bg-[#0056FF] text-white px-4 py-2 rounded-md"
              onClick={() => setOpenCer(true)}
            >
              ใบรับรอง
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={openCer}
        TransitionComponent={Transition}
        onClose={() => setOpenCer(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "100%",
            padding: "0px",
          },
        }}
      >
        <ECer data={data} onClose={() => setOpenCer(false)} />
      </Dialog>
    </div>
  );
}
