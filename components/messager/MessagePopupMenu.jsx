import React from "react";
import { RiDeleteBinLine, RiReplyLine, RiFileCopyLine } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Divider } from "@mui/material";

const MessagePopupMenu = ({ message, onCopy, onReply, onDelete, onLike, closeMenu }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const hasLiked = message.isLike?.includes(userId);

    return (
        <div className="absolute flex flex-row text-xs items-center p-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 w-auto bottom-[-40px] left-1/2 transform -translate-x-1/2">
            <button
                className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg w-14"
                onClick={() => {
                    onCopy(message);
                    closeMenu();
                }}
            >
                <div className="flex flex-col items-center justify-center gap-1">
                  <RiFileCopyLine /> 
                  <span>คัดลอก</span>
                </div>
            </button>

            <Divider orientation="vertical" flexItem />

            <button
                className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg w-14"
                onClick={() => {
                    onReply(message);
                    closeMenu();
                }}
            >
                <div className="flex flex-col items-center gap-1">
                  <RiReplyLine /> 
                  <span>อ้างอิง</span>
                </div>
            </button>

            <Divider orientation="vertical" flexItem />

            <button
                className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg w-14"
                onClick={async () => {
                    await onLike(message);
                    closeMenu();
                }}
            >
                <div className="flex flex-col items-center gap-1">
                  {hasLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  <span>{hasLiked ? "ยกเลิกถูกใจ" : "ถูกใจ"}</span>
                </div>
            </button>

            <Divider orientation="vertical" flexItem />
            
            <button
                className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg w-14"
                onClick={() => {
                    onDelete(message);
                    closeMenu();
                }}
            >
                <div className="flex flex-col items-center gap-1">
                  <RiDeleteBinLine /> 
                  <span>ลบ</span>
                </div>
            </button>
        </div>
    );
};

export default MessagePopupMenu;
