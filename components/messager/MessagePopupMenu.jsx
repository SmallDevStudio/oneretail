import React, { useState } from "react";
import { RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";
import { useSession } from "next-auth/react";

const MessagePopupMenu = ({ message, onCopy, onReply, onDelete, closeMenu }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    return (
        <div className="absolute bg-white shadow-lg text-sm rounded-lg p-2 z-10">
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onCopy(message);
              closeMenu();
            }}
          >
            <RiFileCopyLine /> <span>Copy</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onReply(message);
              closeMenu();
            }}
          >
            <RiReplyLine /> <span>Reply</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onDelete(message);
              closeMenu();
            }}
          >
            <RiDeleteBinLine /> <span>Delete</span>
          </button>
        </div>
      );
    };

export default MessagePopupMenu;
