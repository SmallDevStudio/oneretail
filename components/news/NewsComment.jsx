import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Divider, Slide, Dialog } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import Avatar from "../utils/Avatar";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import ReplyInput from "../comments/ReplyInput";
import Loading from "../Loading";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";

moment.locale("th");

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewsComment({
  newId,
  comment,
  userId,
  onClose,
  mutateComments,
}) {
  const [localComment, setLocalComment] = useState(comment);
  const [openDialog, setOpenDialog] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedReply, setLikedReply] = useState({});
  const [isUpdating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!comment) return;

    setLocalComment(comment); // update local state เมื่อ props.comment เปลี่ยน

    setLiked(comment?.likes?.some((like) => like.userId === userId));
    setLikeCount(comment?.likes?.length);

    const likedReplyMap = {};
    comment?.reply?.forEach((reply) => {
      const isLiked = reply?.likes?.some((like) => like.userId === userId);
      likedReplyMap[reply._id] = isLiked;
    });

    setLikedReply(likedReplyMap);
  }, [comment, userId]);

  useEffect(() => {
    if (isUpdating) {
      mutateComments();
      setLocalComment(comment); // update local state เมื่อ props.comment เปลี่ยน

      setLiked(comment?.likes?.some((like) => like.userId === userId));
      setLikeCount(comment?.likes?.length);

      const likedReplyMap = {};
      comment?.reply?.forEach((reply) => {
        const isLiked = reply?.likes?.some((like) => like.userId === userId);
        likedReplyMap[reply._id] = isLiked;
      });

      setLikedReply(likedReplyMap);
      setUpdating(false);
    }
  }, [comment, isUpdating, mutateComments, userId]);

  if (!comment || !userId || !newId) return <Loading />;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCommentLike = async (commentId) => {
    if (!userId) return alert("กรุณาเข้าสู่ระบบ");

    try {
      const res = await axios.post(`/api/news/comments/${commentId}/like`, {
        userId,
      });

      if (res.data.success) {
        await mutateComments();
        setUpdating(true);
      }
    } catch (error) {
      console.error("Like comment error:", error);
    }
  };

  const handleSubmitReply = async (data) => {
    try {
      const newReply = {
        commentId: comment._id,
        comment: data.post,
        medias: data.media,
        files: data.files,
        tagusers: data.selectedUsers,
        sticker: data.sticker,
        pinned: false,
        newsId: newId,
        userId,
      };

      const res = axios.post("/api/news/reply", newReply);

      if (res.data.success) {
        toast.success("แสดงความคิดเห็นสำเร็จ");
        await mutateComments();
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("แสดงความคิดเห็นไม่สําเร็จ");
    }
  };

  const handleReplyLike = async (replyId) => {
    if (!userId) return alert("กรุณาเข้าสู่ระบบ");

    try {
      const res = await axios.post(`/api/news/reply/${replyId}/like`, {
        userId,
      });

      if (res.data.success) {
        await mutateComments();
        setUpdating(true);
      }
    } catch (error) {
      console.error("Like reply error:", error);
    }
  };

  return (
    <div className="flex flex-col text-sm bg-gray-200 min-h-screen">
      {/* header */}
      <div className="flex flex-row items-center gap-4 bg-[#0056FF] p-2 text-white">
        <IoIosArrowBack className="text-2xl" onClick={onClose} />
        <p className="text-md font-bold">Comment</p>
      </div>
      {/* comment */}
      <div className="flex flex-col bg-white p-2 w-full shadow-md">
        <div className="flex gap-2 w-full">
          <div className="flex items-center justify-center w-12">
            <Avatar
              size={40}
              src={localComment?.user?.pictureUrl}
              alt={localComment?.user?.userId}
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <p className="text-md font-bold text-[#0056FF]">
                {localComment?.user?.fullname}
              </p>
              <div className="flex gap-1 items-center">
                <p className="text-xs text-gray-500">
                  {moment(localComment?.createdAt).format("ll")}
                </p>
                <HiDotsVertical className="text-gray-500" />
              </div>
            </div>
            <p className="text-sm text-gray-600">{localComment?.comment}</p>
          </div>
        </div>
        {/* toolbox */}
        <div className="flex items-center justify-end mt-2">
          <div
            className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2 py-1 rounded-s-lg"
            onClick={() => handleCommentLike(localComment._id)}
          >
            {liked ? (
              <AiFillHeart className="text-red-500" />
            ) : (
              <AiOutlineHeart className="text-gray-400" />
            )}
            <span className="text-xs">{likeCount}</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 bg-gray-100 border border-gray-200 px-2 py-1 rounded-e-lg"
            onClick={handleOpenDialog}
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 277.04 277.04"
            >
              <path
                fill="currentColor"
                d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"
              />
              <path
                fill="currentColor"
                d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"
              />
              <path
                fill="currentColor"
                d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"
              />
              <path
                fill="currentColor"
                d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"
              />
            </svg>
            <span className="text-xs cursor-pointer">แสดงความคิดเห็น</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full pl-4 mt-2 gap-2">
        {localComment?.reply?.length > 0 &&
          localComment?.reply?.map((reply, i) => (
            <div
              key={i}
              className="flex flex-col bg-white p-2 w-full shadow-md"
            >
              <div className="flex gap-2 w-full">
                <div className="flex items-center justify-center w-12">
                  <Avatar
                    size={40}
                    src={reply?.user?.pictureUrl}
                    alt={reply?.user?.userId}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <p className="text-md font-bold text-[#0056FF]">
                      {reply?.user?.fullname}
                    </p>
                    <div className="flex gap-1 items-center">
                      <p className="text-xs text-gray-500">17/09/2023</p>
                      <HiDotsVertical className="text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{reply?.comment}</p>
                </div>
              </div>
              {/* toolbox */}
              <div className="flex items-center justify-end mt-2">
                <div
                  className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2 py-1 rounded-s-lg"
                  onClick={() => handleReplyLike(reply?._id)}
                >
                  {likedReply[reply?._id] ? (
                    <AiFillHeart className="text-red-500" />
                  ) : (
                    <AiOutlineHeart />
                  )}
                  <span className="text-xs">{reply?.likes?.length}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ReplyInput
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitReply}
          userId={userId}
          folder={"news"}
        />
      </Dialog>
    </div>
  );
}
