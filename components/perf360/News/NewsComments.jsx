import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import CommentInput from "../../comments/CommentInput";
import Loading from "@/components/Loading";
import moment from "moment";
import "moment/locale/th";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Dialog, Slide, CircularProgress, Menu, MenuItem } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ReplyInput from "@/components/comments/ReplyInput";
import ImageGallery from "@/components/main/ImageGallery";
import Avatar from "@/components/utils/Avatar";
import Swal from "sweetalert2";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewsComments({ news, onClose }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [openCommentInput, setOpenCommentInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentOption, setCurrentOption] = useState(null);
  const [likes, setLikes] = useState({});
  const [tagMore, setTagMore] = useState(false);
  const [showReply, setShowReply] = useState({});

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  const {
    data,
    error,
    isLoading: userloading,
  } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const {
    data: commentsData,
    error: commentsError,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = useSWR(`/api/perf360/news/comments/${news._id}`, fetcher, {
    onSuccess: (data) => {
      setComments(data.data);
    },
  });

  useEffect(() => {
    if (comments.length) {
      const initialLikes = comments.reduce((acc, comment) => {
        acc[comment._id] = comment.likes.some((like) => like.userId === userId);
        return acc;
      }, {});
      setLikes(initialLikes);
    }
  }, [comments, userId]);

  if (userloading || !user || !news || commentsLoading) return <Loading />;

  const handleOpenComment = () => {
    setOpenCommentInput(true);
  };

  const handleCloseComment = () => {
    setOpenCommentInput(false);
  };

  const handleSubmitComment = async (data) => {
    handleCloseComment();
    setLoading(true);
    console.log("submit comment", data);
    try {
      const newData = {
        ...data,
        newsId: news._id,
        userId: userId,
        comment: data.post,
      };

      const response = await axios.post("/api/perf360/news/comments", newData);
      if (response.data.success) {
        if (
          response.data.data.selectedUsers &&
          response.data.data.selectedUsers.length > 0
        ) {
          for (const user of response.data.data.selectedUsers) {
            await axios.post("/api/notifications", {
              userId: user.userId,
              senderId: userId,
              description: `ได้แท็คความคิดเห็นใน Perf360`,
              referId: news._id,
              path: "News",
              subpath: "Comment",
              url: `${window.location.origin}perf360}`,
              type: "Tag",
            });
          }
        }
        toast.success("บันทึกความคิดเห็นเรียบร้อย");
        mutateComments();
      } else {
        toast.error("บันทึกความคิดเห็นไม่สําเร็จ");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("บันทึกความคิดเห็นไม่สําเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await axios.put("/api/perf360/news/comments/commentlike", {
        commentId,
        userId,
      });

      setLikes((prevLikes) => ({
        ...prevLikes,
        [commentId]: !prevLikes[commentId],
      }));
      mutateComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    handleOptionClose();
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณแน่ใจว่าต้องการลบความคิดเห็นนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: "swal2-custom-zindex",
      },
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(`/api/perf360/news/comments?commentId=${commentId}`);
        toast.success("ลบความคิดเห็นเรียบร้อย");
        mutateComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
        Swal.fire(
          "Error!",
          "There was an issue deleting the comment.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOptionClick = (event, type, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentOption({ type, id });
  };

  const handleOptionClose = () => {
    setAnchorEl(null);
    setCurrentOption(null);
  };

  return (
    <div className="flex flex-col bg-gray-300 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-row px-2 py-2 bg-[#0056FF] text-white items-center justify-between w-full">
        <h2 className="text-lg font-bold">Comments</h2>
        <IoClose className="text-lg cursor-pointer" onClick={onClose} />
      </div>

      {/* Content */}
      <div className="p-4 bg-white shadow-lg">
        <h2 className="text-md font-bold">{news.title}</h2>
        <div
          className="tiptap w-full"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* input */}
        <div className="flex flex-row items-center mt-2 gap-2 w-full">
          <div className="relative" onClick={() => router.push(`/p/${userId}`)}>
            <Image
              src={user?.pictureUrl}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div
            onClick={handleOpenComment}
            className="text-sm border border-gray-300 rounded-full p-2 w-full h-26"
          >
            พิมพ์ความคิดเห็น
          </div>
        </div>
      </div>
      {/* Comments */}
      {comments && comments.length > 0 && (
        <div className="flex flex-col gap-2 bg-gray-100 px-4 py-2 mb-2 mt-2">
          {comments.map((comment, commentIndex) => (
            <>
              <div key={commentIndex} className="flex flex-col w-full gap-2">
                <div className="flex flex-row w-full gap-2">
                  <Avatar
                    src={comment?.user?.pictureUrl}
                    size={40}
                    userId={comment?.user?.userId}
                  />
                  <div className="flex flex-col text-sm w-[calc(100%-50px)]">
                    <div className="flex flex-row flex-wrap items-center gap-2 text-sm font-bold text-[#0056FF]">
                      <span
                        onClick={() =>
                          router.push(`/p/${comment?.user?.userId}`)
                        }
                      >
                        {comment?.user?.fullname}
                      </span>
                      <div className="flex flex-row flex-wrap items-center gap-1 mt-[-5px]">
                        {comment?.tagusers && comment?.tagusers.length > 0 && (
                          <>
                            <span className="text-gray-500 text-xs">กับ</span>
                            {tagMore && comment?.tagusers
                              ? comment?.tagusers.slice(0, 2).map((user) => (
                                  <span
                                    key={user.userId}
                                    className="inline text-[#F68B1F] text-xs"
                                    onClick={() =>
                                      router.push(`/p/${user.userId}`)
                                    }
                                  >
                                    {user.fullname}
                                  </span>
                                ))
                              : comment?.tagusers.map((user) => (
                                  <span
                                    key={user.userId}
                                    className="inline text-[#F68B1F] text-xs"
                                    onClick={() =>
                                      router.push(`/p/${user.userId}`)
                                    }
                                  >
                                    {user.fullname}
                                  </span>
                                ))}
                            {tagMore && comment?.tagusers?.length > 2 ? (
                              <span
                                onClick={() => setTagMore(false)}
                                className="text-gray-500 text-xs"
                              >
                                ดูน้อยลง
                              </span>
                            ) : (
                              <span
                                onClick={() => setTagMore(true)}
                                className="text-gray-500 text-xs"
                              >
                                ดูเพิ่มขึ้น
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {moment(comment?.createdAt).fromNow()}
                    </span>
                  </div>
                  {(comment.userId === session?.user?.id ||
                    user?.user?.role === "admin" ||
                    user?.user?.role === "manager") && (
                    <div className="relative">
                      <BsThreeDotsVertical
                        onClick={(e) =>
                          handleOptionClick(e, "comment", comment._id)
                        }
                      />
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleOptionClose}
                        classes={{ paper: "text-xs" }}
                        sx={{ fontSize: "8px" }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleCommentDelete(currentOption.id);
                          }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  {comment?.comment && (
                    <span className="text-sm mb-1">{comment?.comment}</span>
                  )}
                  {comment?.medias.length > 0 && (
                    <ImageGallery
                      medias={comment.medias}
                      userId={session?.user?.id}
                    />
                  )}
                  {comment?.sticker && comment?.sticker?.url && (
                    <div className="flex flex-col w-full">
                      <Image
                        src={comment?.sticker?.url}
                        alt="sticker"
                        width={100}
                        height={100}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-row justify-between w-full px-2">
                  <div className="flex flex-row items-center gap-2">
                    {likes[comment._id] ? (
                      <AiFillHeart
                        className="w-4 h-4 text-red-500"
                        onClick={() => handleCommentLike(comment._id)}
                      />
                    ) : (
                      <AiOutlineHeart
                        className="w-4 h-4"
                        onClick={() => handleCommentLike(comment._id)}
                      />
                    )}
                    <span>
                      {Array.isArray(comment?.likes)
                        ? comment?.likes.length
                        : 0}
                    </span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
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
                    <span
                      className="text-xs cursor-pointer"
                      // onClick={() => handleClickOpen("reply", comment._id)}
                    >
                      ตอบกลับความคิดเห็น
                    </span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <span
                      className="text-xs cursor-pointer"
                      onClick={() =>
                        setShowReply(
                          showReply !== comment._id ? comment._id : null
                        )
                      }
                    >
                      {showReply === comment._id
                        ? "ซ่อนตอบกลับความคิดเห็น"
                        : "ดูตอบกลับความคิดเห็น"}
                    </span>
                    <span className="text-xs">
                      {Array.isArray(comment.reply) ? comment.reply.length : 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  {showReply === comment._id &&
                    Array.isArray(comment.reply) &&
                    comment.reply.map((reply, replyIndex) => (
                      <div
                        key={replyIndex}
                        className="flex flex-col w-full gap-2"
                      >
                        <div className="flex flex-row w-full gap-2">
                          <Avatar
                            src={reply?.user?.pictureUrl}
                            size={30}
                            userId={reply?.user?.userId}
                          />
                          <div className="flex flex-col text-sm w-[calc(100%-40px)]">
                            <div className="flex flex-row flex-wrap items-center gap-2 text-xs font-bold text-[#0056FF]">
                              <span
                                onClick={() =>
                                  router.push(`/p/${reply?.user?.userId}`)
                                }
                              >
                                {reply?.user?.fullname}
                              </span>
                              <div className="flex flex-row flex-wrap items-center gap-1 mt-[-5px]">
                                {reply?.tagusers &&
                                  reply?.tagusers.length > 0 && (
                                    <>
                                      <span className="text-gray-500 text-xs">
                                        กับ
                                      </span>
                                      {tagMore && reply?.tagusers
                                        ? reply?.tagusers
                                            .slice(0, 2)
                                            .map((user) => (
                                              <span
                                                key={user.userId}
                                                className="inline text-[#F68B1F] text-xs"
                                                onClick={() =>
                                                  router.push(
                                                    `/p/${user.userId}`
                                                  )
                                                }
                                              >
                                                {user.fullname}
                                              </span>
                                            ))
                                        : reply?.tagusers.map((user) => (
                                            <span
                                              key={user.userId}
                                              className="inline text-[#F68B1F] text-xs"
                                              onClick={() =>
                                                router.push(`/p/${user.userId}`)
                                              }
                                            >
                                              {user.fullname}
                                            </span>
                                          ))}
                                      {tagMore &&
                                      reply?.tagusers?.length > 2 ? (
                                        <span
                                          onClick={() => setTagMore(false)}
                                          className="text-gray-500 text-xs"
                                        >
                                          ดูน้อยลง
                                        </span>
                                      ) : (
                                        <span
                                          onClick={() => setTagMore(true)}
                                          className="text-gray-500 text-xs"
                                        >
                                          ดูเพิ่มขึ้น
                                        </span>
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {moment(reply?.createdAt).fromNow()}
                            </span>
                          </div>
                          {(reply?.userId === session?.user?.id ||
                            user?.user?.role === "admin" ||
                            user?.user?.role === "manager") && (
                            <div className="relative">
                              <BsThreeDotsVertical
                                onClick={(e) =>
                                  handleOptionClick(e, "comment", comment._id)
                                }
                              />
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleOptionClose}
                                classes={{ paper: "text-xs" }}
                                sx={{ fontSize: "8px" }}
                              >
                                <MenuItem
                                  onClick={() => {
                                    handleReplyDelete(currentOption.id);
                                    handleOptionClose();
                                  }}
                                >
                                  Delete
                                </MenuItem>
                              </Menu>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          {reply?.reply && (
                            <span className="text-sm mb-1">{reply?.reply}</span>
                          )}
                          {reply?.medias.length > 0 && (
                            <ImageGallery
                              medias={reply.medias}
                              userId={session?.user?.id}
                            />
                          )}
                          {reply?.sticker && reply?.sticker?.url && (
                            <div className="flex flex-col w-full">
                              <Image
                                src={reply?.sticker?.url}
                                alt="sticker"
                                width={100}
                                height={100}
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row justify-between w-full px-2">
                          {likes[reply._id] ? (
                            <AiFillHeart
                              className="w-3 h-3 text-red-500"
                              onClick={() =>
                                handleReplyLike(reply._id, comment.postId)
                              }
                            />
                          ) : (
                            <AiOutlineHeart
                              className="w-3 h-3"
                              onClick={() =>
                                handleReplyLike(reply._id, comment.postId)
                              }
                            />
                          )}
                          <span className="text-sm">
                            {Array.isArray(reply?.likes)
                              ? reply?.likes?.length
                              : 0}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ))}
        </div>
      )}
      <Dialog
        fullScreen
        open={openCommentInput}
        onClose={handleCloseComment}
        TransitionComponent={Transition}
        keepMounted
      >
        <div className="p-4">
          <CommentInput
            handleSubmit={(data) => handleSubmitComment(data)}
            userId={userId}
            handleClose={handleCloseComment}
            folder="news-comments"
          />
        </div>
      </Dialog>
    </div>
  );
}
