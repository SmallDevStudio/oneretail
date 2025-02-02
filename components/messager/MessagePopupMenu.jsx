import React, { useState } from "react";
import { RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Divider } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const MessagePopupMenu = ({ message, onCopy, onReply, onDelete, onLike, closeMenu }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const hasLiked = message.isLike?.includes(userId);

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
            onClick={async() => {
              await onLike(message);
              closeMenu();
            }}
          >
            {hasLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{hasLiked ? "ยกเลิกถูกใจ" : "ถูกใจ"}</span>
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
