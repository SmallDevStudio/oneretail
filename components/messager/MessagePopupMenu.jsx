import React, { useState } from "react";
import { RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Divider } from "@mui/material";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";

const icons =[
  {id: 1, src: "/images/survey/1.svg"},
  {id: 2, src: "/images/survey/2.svg"},
  {id: 3, src: "/images/survey/3.svg"},
  {id: 4, src: "/images/survey/4.svg"},
  {id: 5, src: "/images/survey/5.svg"},
]

const MessagePopupMenu = ({ message, onCopy, onReply, onDelete, onLike, closeMenu }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    return (
        <div className="absolute text-xs p-2 z-10 w-32">
          <div className="flex flex-col gap-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full">
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onCopy(message);
              closeMenu();
            }}
          >
            <RiFileCopyLine /> <span>คัดลอก</span>
          </button>
          <Divider />
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onReply(message);
              closeMenu();
            }}
          >
            <RiReplyLine /> <span>อ้างอิง</span>
          </button>
          <Divider />
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onLike(message);
              closeMenu();
            }}
          >
            <FaRegHeart /> <span>ถูกใจ</span>
          </button>
          <Divider />
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onDelete(message);
              closeMenu();
            }}
          >
            <RiDeleteBinLine /> <span>ลบ</span>
          </button>
          </div>
        </div>
      );
    };

export default MessagePopupMenu;
