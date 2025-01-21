import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { IoIosCloseCircle } from "react-icons/io";
import { BiUserPlus } from "react-icons/bi";
import Avatar from "../utils/Avatar";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";

export default function Friends() {
    return (
        <div className="flex flex-col gap-4 bg-white px-4 py-2">
            <span className="text-lg font-bold text-[#0056FF]">เพื่อนของคุณ</span>

            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2 w-full">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <Avatar 
                        src={""}
                        size={30}
                        />
                        <span className="text-sm text-[#0056FF] font-bold">Username</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="bg-gray-200 px-3 py-1 rounded-lg">
                            <FaRegCommentDots size={20}/>
                        </div>
                        <BsThreeDots size={20}/>
                    </div>
                </div>
            </div>
        </div>
    );
}