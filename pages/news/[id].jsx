import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import { Divider, Slide, Dialog } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import NewsComment from "@/components/news/NewsComment";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "@/components/utils/Avatar";
import CommentInput from "@/components/comments/CommentInput";
import { toast } from "react-toastify";
import Link from "next/link";
import ReactPlayer from "react-player";

moment.locale("th");

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function News() {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [openInput, setOpenInput] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const {
    data: newsData,
    error: newsError,
    isLoading: newsLoading,
    mutate,
  } = useSWR(`/api/news/${id}`, fetcher, {
    onSuccess: (data) => {
      if (data.success) {
        setNews(data.data);
        setLikeCount(data.data?.likes?.length);
        setLiked(data.data?.likes?.some((like) => like.userId === userId));
      } else {
        return router.push("/error/404");
      }
    },
  });

  const {
    data: commentsData,
    error: commentsError,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = useSWR(`/api/news/${id}/comments`, fetcher, {
    onSuccess: (data) => {
      if (data.success) {
        const updated = data.data.map((comment) => ({
          ...comment,
          liked: comment.likes.some((like) => like.userId === userId),
          likeCount: comment.likes.length,
        }));
        setComments(updated);
      }
    },
  });

  console.log("news", news);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [status, session]);

  const handleLike = async () => {
    if (!userId) return alert("กรุณาเข้าสู่ระบบ");

    try {
      const res = await axios.post(`/api/news/${id}/like`, { userId });
      if (res.data.success) {
        mutate();
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!userId) return alert("กรุณาเข้าสู่ระบบ");

    try {
      const res = await axios.post(`/api/news/comments/${commentId}/like`, {
        userId,
      });

      if (res.data.success) {
        mutateComments();
      }
    } catch (error) {
      console.error("Like comment error:", error);
    }
  };

  const handleAddPost = async (data) => {
    try {
      const res = await axios.post("/api/news/comments", {
        comment: data.post,
        medias: data.media,
        files: data.files,
        tagusers: data.selectedUsers,
        sticker: data.sticker,
        pinned: false,
        newsId: id,
        userId,
      });

      if (res.data.success) {
        toast.success("แสดงความคิดเห็นสำเร็จ");
        setOpenInput(false);

        const newComment = res.data.comment || res.data.data;

        // เพิ่มคอมเมนต์ใหม่เข้า state ทันที
        setComments((prev) => [
          {
            ...newComment,
            liked: false,
            likeCount: 0,
            user: {
              fullname: session?.user?.fullname || "ไม่ระบุชื่อ",
              pictureUrl: session?.user?.pictureUrl || "",
            },
          },
          ...prev,
        ]);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการแสดงความคิดเห็น");
      console.log(error);
    }
  };

  const handleOpenComment = (comment) => {
    setSelectedComment(comment);
    setOpenComment(true);
  };

  const handleCloseComment = () => {
    setSelectedComment(null);
    setOpenComment(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen pb-20">
      {/* header */}
      <div className="flex items-center gap-2 bg-[#0056FF] text-white p-4">
        <IoIosArrowBack
          className="text-xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h3 className="text-xl font-bold">{news.title}</h3>
      </div>
      {/* content */}
      <div className="w-full bg-white shadow-lg">
        <div>
          <Image
            src={news?.cover?.url || "/images/news/sample.jpg"}
            alt={news.title}
            width={500}
            height={500}
            className="w-full shadow-sm"
          />
        </div>
        <div>
          {news?.images?.length > 0 && (
            <div className="flex items-center gap-2 p-4 overflow-x-auto">
              {news?.images?.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={news.title}
                  width={200}
                  height={200}
                  className="w-full shadow-sm"
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full">
          {news?.video?.length > 0 &&
            (news?.video?.length === 1 ? (
              <div className="w-full aspect-video">
                <ReactPlayer
                  url={news.video[0].videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {news.video.map((video, index) => (
                  <ReactPlayer
                    key={index}
                    url={video.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    className="w-full aspect-video"
                  />
                ))}
              </div>
            ))}
        </div>

        <div className="px-4 py-2">
          <h3 className="text-lg font-bold text-[#0056FF]">{news.title}</h3>
          <p className="text-[12px] text-gray-600">
            วันที่เผยแพร่: {moment(news.createdAt).format("lll")}
          </p>
          <p className="text-xs text-gray-900 whitespace-pre-line mt-1">
            {news.content}
          </p>

          <div className="flex w-full">
            {news?.files?.length > 0 && (
              <div className="flex items-center gap-2 p-4 overflow-x-auto">
                {news?.files?.map((file, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <Link
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={file.icon}
                        alt={news.title}
                        width={100}
                        height={100}
                        className="w-[50px]"
                      />
                    </Link>
                    <div className="flex flex-col items-center">
                      <Link
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="text-sm text-gray-600 font-bold">
                          {file.file_name}
                        </p>
                      </Link>
                      <span className="text-[10px] text-gray-600">
                        size:{formatFileSize(file.file_size)}
                      </span>
                      <div className="text-[10px] bg-[#0056FF] text-white px-2 py-1 rounded">
                        ดาวน์โหลด
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Divider sx={{ my: 1, mt: 2 }} />
          {/* Toolbox */}
          <div className="flex items-center justify-start">
            <div
              onClick={handleLike}
              className="flex items-center gap-1 cursor-pointer bg-gray-100 border border-gray-200 px-2 py-1 rounded-s-lg"
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
              onClick={() => setOpenInput(true)}
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
      </div>
      {/* comments */}
      <div className="mt-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="flex flex-col bg-white p-2 w-full shadow-md"
          >
            <div
              className="flex gap-2 w-full"
              onClick={() => handleOpenComment(c)}
            >
              <div className="flex items-center justify-center w-12">
                <Avatar size={40} src={c.user?.pictureUrl} alt={c.userId} />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <p className="text-md font-bold text-[#0056FF]">
                    {c.user?.fullname || "ไม่ระบุชื่อ"}
                  </p>
                  <div className="flex gap-1 items-center">
                    <p className="text-xs text-gray-500">
                      {moment(c.createdAt).format("ll")}
                    </p>
                    <HiDotsVertical className="text-gray-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{c.comment}</p>
              </div>
            </div>
            <div className="flex items-center justify-end mt-2">
              <div
                onClick={() => handleCommentLike(c._id)}
                className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2 py-1 rounded-s-lg cursor-pointer"
              >
                {c.liked ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart className="text-gray-400" />
                )}
                <span className="text-xs">{c.likeCount}</span>
              </div>
              <div className="flex flex-row items-center gap-2 bg-gray-100 border border-gray-200 px-2 py-1 rounded-e-lg">
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
                <span className="text-xs cursor-pointer">
                  {c?.reply?.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        fullScreen
        open={openInput}
        onClose={() => setOpenInput(false)}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CommentInput
          handleSubmit={handleAddPost}
          userId={userId}
          handleClose={() => setOpenInput(false)}
          folder={"news"}
        />
      </Dialog>

      <Dialog
        fullScreen
        open={openComment}
        onClose={handleCloseComment}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <NewsComment
          newId={id}
          comment={selectedComment}
          onClose={handleCloseComment}
          userId={userId}
          mutateComments={mutateComments}
        />
      </Dialog>
    </div>
  );
}
