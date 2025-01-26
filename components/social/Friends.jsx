import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { IoIosCloseCircle } from "react-icons/io";
import { BiUserPlus } from "react-icons/bi";
import Avatar from "../utils/Avatar";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";

const fetcher = url => axios.get(url).then(res => res.data);

export default function Friends({user}) {

    const { data: session } = useSession();
    const userId = session.user.id;

    const { data: friends, error: friendsError, mutate } = useSWR(`/api/onesociety/follower?userId=${userId}`, fetcher);

    console.log('friends:', friends);
    
    return (
        <div className="flex flex-col gap-4 bg-white px-4 py-2">
            <span className="text-lg font-bold text-[#0056FF]">เพื่อนของคุณ</span>

            <div className="flex flex-col gap-2">
                {friends?.data.length > 0 ? friends?.data?.map((friend, index) => (
                    <div 
                        key={index}
                        className="flex flex-row items-center gap-2 w-full"
                    >
                        <div className="flex flex-row items-center gap-2 w-full">
                            <Avatar 
                                src={friend?.user?.pictureUrl}
                                size={30}
                                userId={friend?.user?.userId}
                            />
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-sm text-[#0056FF] font-bold">
                                    {friend?.user?.fullname}
                                </span>
                                <span className="text-xs">
                                    {friend?.friend ? "(เพื่อน)" : "(ติดตาม)"}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <div className="bg-gray-200 px-3 py-1 rounded-lg">
                                <FaRegCommentDots size={20}/>
                            </div>
                            <BsThreeDots size={20}/>
                        </div>
                    </div>
                )):(
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-sm text-gray-500 font-bold">
                            ไม่มีเพื่อน
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}