import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import moment from "moment";
import "moment/locale/th";
import Avatar from "@/components/utils/Avatar";
import { CircularProgress } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import CommentInput from "@/components/comments/CommentInput";
import PostInput from "@/components/comments/PostInput";
import ReplyInput from "@/components/comments/ReplyInput";
import ImageGallery from "@/components/main/ImageGallery";
import Swal from "sweetalert2";
import { BsPinAngleFill } from "react-icons/bs";
import Loading from "@/components/Loading";

moment.locale("th");

export default function PostPanel({ post }) {
    const [tagMore, setTagMore] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    console.log(post);
    return !post ? (
        <div className="w-full h-full flex items-center justify-center">
            <CircularProgress />
        </div>
    ) : (
        <>
        <div className="flex flex-col w-full gap-1">
            {/* Header */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row w-full gap-2">
                    <Avatar
                        src={post?.user?.pictureUrl}
                        size={40}
                        userId={post?.user?.userId}
                    />
                    <div className="flex flex-col text-sm">
                        <div className="flex flex-row items-center gap-2 text-sm font-bold text-[#0056FF]">
                            <span
                                onClick={() => router.push(`/p/${post?.user?.userId}`)}
                            >
                                {post?.user?.fullname}
                            </span>
                            {post?.page !== "post" && 
                                <>
                                <span className="text-gray-500">{'>'}</span>
                                <span 
                                    className="text-[#F68B1F]"
                                    onClick={() => router.push(`/stores?tab=share-your-story#${post?._id}`)}
                                > 
                                    {post?.page}
                                </span>
                                </>
                            }
                            {post?.tagusers && post?.tagusers.length > 0 && (
                                <>
                                <span className="text-gray-500 text-xs">กับ</span>
                                {tagMore && post?.tagusers ? (
                                  post?.tagusers.slice(0, 2).map((user) => (
                                    <span
                                      key={user.userId}
                                      className="text-[#F68B1F] text-xs"
                                      onClick={() => router.push(`/p/${user.userId}`)}
                                    >
                                      {user.fullname}
                                    </span>
                                  ))
                                ):(
                                  post?.tagusers.map((user) => (
                                    <span
                                      key={user.userId}
                                      className="text-[#F68B1F] text-xs"
                                      onClick={() => router.push(`/p/${user.userId}`)}
                                    >
                                      {user.fullname}
                                    </span>
                                    )
                                ))}
                                {tagMore ? (
                                    <span onClick={() => setTagMore(false)} className="text-gray-500 text-xs">ดูน้อยลง</span>
                                ): (
                                    <span onClick={() => setTagMore(true)} className="text-gray-500 text-xs">ดูเพิ่มขึ้น</span>
                                )}
                                </>
                            )}
                        </div>
                        <span className="text-gray-500 text-xs">{moment(post?.createdAt).fromNow()}</span>
                    </div>
                </div>

                <div>
                <BsThreeDotsVertical 
                    size={15}
                    className="cursor-pointer text-gray-400"
                />
                </div>
            </div>
            {/* Content */}
            <div className="flex flex-col">
                {post?.post && (
                    <span className="text-sm mb-1">{post?.post}</span>
                )}
                
                {post?.sticker && post?.sticker?.url && (
                    <div className="flex flex-col justify-center items-center w-full">
                        <Image
                            src={post?.sticker?.url}
                            alt="sticker"
                            width={200}
                            height={200}
                            className="w-full"
                            priority
                        />
                    </div>
                )}
            </div>
            {/* Tools */}
            <div className="flex flex-row items-center justify-between gap-2">

            </div>
        </div>
        </>
    );
}