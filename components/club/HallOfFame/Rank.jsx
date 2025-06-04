import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { Slide, Dialog } from "@mui/material";
import UserPanel from "./UserPanel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Rank() {
  return (
    <div>
      {/* Header */}
      <div>Rank</div>
    </div>
  );
}
