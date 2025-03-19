import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import StickerPanel from "@/components/stickers/StickerPanel";
import CircularProgress from "@mui/material/CircularProgress";
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import { RiEmojiStickerLine } from "react-icons/ri";
import { ImFilePicture } from "react-icons/im";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import Swal from "sweetalert2";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LuMessageSquarePlus } from "react-icons/lu";
import { IoCloseCircle } from "react-icons/io5";

moment.locale("th");

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SurveyPanel = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [textareaValue, setTextareaValue] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [sticker, setSticker] = useState(null);
  const [media, setMedia] = useState([]);

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [openSticker, setOpenSticker] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // Menu anchor state
  const [user, setUser] = useState(null);

  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const surveyId = router.query.surveyId;

  const { data: userData } = useSWR(
    () => (userId ? `/api/users/${userId}` : null),
    fetcher,
    {
      onSuccess: (data) => {
        setUser(data.user);
      },
    }
  );

  const {
    data: survey,
    error: surveyError,
    mutate: fetchSurveyData,
  } = useSWR(
    () => (userId ? `/api/survey/board/comments/${surveyId}` : null),
    fetcher
  );

  if (surveyError) return <div>Error loading Survey</div>;
  if (!survey) return <CircularProgress />;

  const handleCommentSubmit = async () => {
    if (!sticker && !textareaValue) {
      setError("กรุณาใส่ความคิดเห็นหรือสติกเกอร์");
      return;
    }

    setIsLoading(true);

    if (isEdit) {
      const updateComment = {
        comment: textareaValue,
        sticker,
        medias: media,
      };

      try {
        await axios.put(
          `/api/survey/board/comments/update?id=${selectedComment}`,
          updateComment
        );
        fetchSurveyData();
        handleClose();
      } catch (error) {
        console.error("Error updating comment:", error);
        Swal.fire({
          icon: "error",
          title: "แก้ไขความคิดเห็นไม่สําเร็จ",
          text: "เกิดข้อผิดพลาดขณะแก้ไขความคิดเห็น",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#0056FF",
          allowOutsideClick: true,
        });
      }
    } else {
      try {
        const newComment = {
          surveyId: selectedComment,
          comment: textareaValue,
          userId,
          sticker,
          medias: media,
        };

        console.log("newComment", newComment);

        const response = await axios.post(
          `/api/survey/board/comments`,
          newComment
        );
        console.log("response", response.data);
        if (response.data.success) {
          try {
            await axios.post("/api/notifications", {
              userId: selectedData.userId,
              senderId: userId,
              description: `แสดงความคิดเห็นใน Verbatim`,
              referId: response.data.data._id,
              path: "Survey",
              subpath: "Memo",
              url: `/survey/panel?surveyId=${survey.data._id}`,
              type: "Comment",
            });
          } catch (error) {
            console.error("Error posting notification:", error);
          }
        }
        fetchSurveyData();
        handleClose();
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }

    setIsLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    handleMenuClose();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this comment? This process cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/survey/board/comments/delete?id=${commentId}`);
      } catch (error) {
        console.error("Error deleting comment:", error);
      } finally {
        setIsLoading(false);
        fetchSurveyData();
      }
    }
  };

  const handleEditComment = (id) => {
    handleMenuClose();
    console.log("Editing", id);
    // Implement edit logic
    setTextareaValue(
      survey.data.comments.find((comment) => comment._id === id).comment
    );
    setSticker(
      survey.data.comments.find((comment) => comment._id === id).sticker
    );
    setMedia(survey.data.comments.find((comment) => comment._id === id).medias);
    setSelectedComment(id);
    setType("comment");
    setIsEdit(true);
    setOpen(true);
  };

  const handleReplySubmit = async () => {
    setIsLoading(true);

    if (isEdit) {
      const updateReply = {
        reply: textareaValue,
        sticker,
        medias: media,
      };
      try {
        await axios.put(
          `/api/survey/board/reply/update?id=${selectedComment}`,
          updateReply
        );
        fetchSurveyData();
        handleClose();
      } catch (error) {
        console.error("Error updating reply:", error);
        Swal.fire({
          icon: "error",
          title: "แก้ไขความคิดเห็นไม่สําเร็จ",
          text: "เกิดข้อผิดพลาดขณะแก้ไขความคิดเห็น",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#0056FF",
          allowOutsideClick: true,
        });
      }
    } else {
      try {
        const newReply = {
          commentId: selectedComment,
          userId: userId,
          reply: textareaValue,
          sticker,
          medias: media,
        };
        const response = await axios.post(`/api/survey/board/reply`, newReply);
        if (response.status === 201) {
          try {
            await axios.post("/api/notifications", {
              userId: selectedData.userId,
              senderId: userId,
              description: `ตอบกลับความคิดเห็นใน Verbatim`,
              referId: response.data.data._id,
              path: "Survey",
              subpath: "Memo",
              url: `/survey/panel?surveyId=${survey.data._id}`,
              type: "Reply",
            });
          } catch (error) {
            console.error("Error posting notification:", error);
          }
        }

        fetchSurveyData();
        handleClose();
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteReply = async (id) => {
    setMenuAnchorEl(null);

    // Await the Swal.fire promise to ensure it waits for user action
    const result = await Swal.fire({
      title: "คุณต้องการลบความคิดเห็นใช่หรือไม่?",
      text: "คุณจะไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0056FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/survey/board/reply/delete?id=${id}`);
        fetchSurveyData(); // Refresh survey data
      } catch (error) {
        console.error("Error deleting comment:", error);
        Swal.fire({
          icon: "error",
          title: "ลบความคิดเห็นไม่สําเร็จ",
          text: "เกิดข้อผิดพลาดขณะลบความคิดเห็น",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#0056FF",
          allowOutsideClick: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditReply = (id, reply) => {
    handleMenuClose();
    console.log("Editing", id);
    // Implement edit logic
    setIsEdit(true);
    setSelectedComment(id);
    setTextareaValue(reply.reply);
    setSticker(reply.sticker);
    setMedia(reply.medias);
    setOpen(true);
  };

  const handleClickOpen = (type, data) => {
    const id = data._id;
    setSelectedComment(id);
    setSelectedData(data);
    setType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedComment(null);
    setSelectedData(null);
    setType(null);
    setError(null);
    setTextareaValue("");
    setSticker(null);
    setMedia([]);
    setIsEdit(false);
    setOpen(false);
  };

  const handleOpenSticker = () => {
    setOpenSticker(true);
  };

  const handleCloseSticker = () => {
    setOpenSticker(false);
  };

  const handleMenuClick = (event, commentId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedComment(commentId); // Save the commentId for deletion
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  console.log(survey);

  return (
    <div className="flex-1 flex-col p-2 mb-20">
      <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
        <IoIosArrowBack
          className="text-xl inline text-gray-700"
          onClick={() => router.back()}
          size={25}
        />
        <h2 className="text-3xl font-bold text-[#0056FF]">Verbatim</h2>
        <div></div>
      </div>

      <div className="flex flex-wrap flex-row mt-1 gap-2 text-sm w-full">
        <span>
          <strong>TeamGroup:</strong>
          {survey?.data?.emp?.teamGrop === "Retail"
            ? "BBD"
            : survey?.data?.emp?.teamGrop}
        </span>
        {survey?.data?.emp?.chief_th && (
          <div className="flex flex-row gap-2">
            <span>{">"}</span>
            <span>
              <strong>Chief:</strong> {survey?.data?.emp?.chief_th}
            </span>
          </div>
        )}
        {survey?.data?.emp?.position && (
          <div className="flex flex-row gap-2">
            <span>{">"}</span>
            <span>
              <strong>Position:</strong> {survey?.data?.emp?.position}
            </span>
          </div>
        )}
        {survey?.data?.emp?.group && (
          <div className="flex flex-row gap-2">
            <span>{">"}</span>
            <span>
              <strong>Group:</strong> {survey?.data?.emp?.group}
            </span>
          </div>
        )}
        {survey?.data?.emp?.deparment && (
          <div className="flex flex-row gap-2">
            <span>{">"}</span>
            <span>
              <strong>Department:</strong> {survey?.data?.emp?.deparment}
            </span>
          </div>
        )}
        {survey?.data?.emp?.branch && (
          <div className="flex flex-row gap-2">
            <span>{">"}</span>
            <span>
              <strong>Branch:</strong> {survey?.data?.emp?.branch}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-2 w-full">
        <div className="flex flex-col px-2 py-1 w-full">
          <div className="flex flex-col p-2 bg-gray-300 rounded-3xl text-sm w-full mb-2">
            <div className="flex flex-row gap-4 mb-2 w-full ">
              <div className="flex flex-row w-[40px]">
                <Image
                  src="/images/survey/3.svg"
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>

              <div className="grid grid-cols-4 px-1 gap-1 w-full">
                <p className="col-span-3 text-sm">{survey?.data?.memo}</p>
                <p className="col-span-1 text-xs">
                  {moment(survey?.data?.createdAt).locale("th").format("lll")}
                </p>
              </div>
            </div>

            <Divider className="w-full mb-2" />

            <div className="flex flex-row justify-end items-center px-2 w-full">
              <div
                className="flex flex-row gap-2 items-center"
                onClick={() => handleClickOpen("comment", survey?.data)}
              >
                <LuMessageSquarePlus className="text-gray-700" size={15} />
                <div className="flex flex-row gap-1 items-center">
                  <span>ความคิดเห็น</span>
                  <span>
                    {survey?.data?.comments.length > 0 &&
                      survey?.data?.comments.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Comments List */}
      {Array.isArray(survey?.data?.comments) &&
        survey?.data?.comments.map((comment, index) => (
          <div key={index} className="flex flex-col px-2 w-full mb-1">
            <div className="flex flex-col bg-gray-200 rounded-xl p-1 w-full">
              <div className="flex flex-row w-full">
                <div className="flex flex-col">
                  <Image
                    src={
                      comment?.user?.role === "manager"
                        ? comment.user.pictureUrl || "/images/survey/3.svg"
                        : "/images/survey/3.svg"
                    }
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>

                <div className="flex flex-col w-full text-left ml-2 px-1">
                  <div className="flex flex-row justify-between w-full ">
                    <span className="text-sm font-bold text-[#0056FF]">
                      {comment?.user?.role === "manager"
                        ? comment.user.fullname
                        : "ไม่ระบุ"}
                    </span>
                    <div className="flex flex-row gap-1">
                      <span className="text-xs">
                        {moment(comment.createdAt).locale("th").format("lll")}
                      </span>
                      <BsThreeDotsVertical
                        className="text-gay-300 cursor-pointer"
                        onClick={(e) => handleMenuClick(e, comment._id)}
                      />
                    </div>

                    {/* Dropdown menu */}
                    <Menu
                      anchorEl={menuAnchorEl}
                      open={
                        Boolean(menuAnchorEl) && selectedComment === comment._id
                      }
                      onClose={handleMenuClose}
                    >
                      {comment.userId === userId && (
                        <MenuItem
                          onClick={() => handleEditComment(comment._id)}
                        >
                          แก้ไขความคิดเห็น
                        </MenuItem>
                      )}

                      {(user?.role === "admin" ||
                        user?.role === "manager" ||
                        comment.userId === userId) && (
                        <MenuItem
                          onClick={() => handleDeleteComment(selectedComment)}
                        >
                          ลบความคิดเห็น
                        </MenuItem>
                      )}
                    </Menu>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm">{comment.comment}</p>
                    <div className="flex flex-col w-full">
                      {comment?.sticker && (
                        <div className="flex gap-1">
                          <Image
                            src={comment.sticker.url}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full"
                            style={{ width: "auto", height: "80px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="w-full my-1" />

              <div className="flex flex-row justify-end items-center gap-2 mx-2">
                <div
                  className="flex flex-row items-center jestify-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-xl shadow-sm"
                  onClick={() => handleClickOpen("reply", comment)}
                >
                  <FaRegCommentDots className="text-gray-500 text-sm" />
                  <span>ตอบกลับ</span>
                </div>
              </div>
            </div>

            {Array.isArray(comment?.reply) &&
              comment?.reply.map((reply, index) => (
                <div key={index} className="flex flex-col w-full mt-1 pl-5">
                  <div className="flex flex-col bg-gray-100 rounded-xl p-1 w-full">
                    <div className="flex flex-row  w-full">
                      <div className="flex flex-col w-[50px]">
                        <Image
                          src={
                            reply?.user?.role === "manager"
                              ? reply?.user?.pictureUrl ||
                                "/images/survey/3.svg"
                              : "/images/survey/3.svg"
                          }
                          alt="sticker"
                          width={50}
                          height={50}
                          className="rounded-full"
                          style={{ width: "40px", height: "40px" }}
                        />
                      </div>

                      <div className="flex flex-col w-full text-left ml-2 px-1">
                        <div className="flex flex-row justify-between w-full ">
                          <span className="text-sm font-bold text-[#0056FF]">
                            {reply?.user?.role === "manager"
                              ? reply?.user?.fullname
                              : "ไม่ระบุ"}
                          </span>
                          <div className="flex flex-row gap-1">
                            <span className="text-xs">
                              {moment(reply?.createdAt)
                                .locale("th")
                                .format("LL")}
                            </span>
                            <BsThreeDotsVertical
                              className="text-gay-300"
                              onClick={(e) => handleMenuClick(e, reply?._id)}
                            />
                          </div>

                          {/* Dropdown menu */}
                          <Menu
                            anchorEl={menuAnchorEl}
                            open={
                              Boolean(menuAnchorEl) &&
                              selectedComment === reply?._id
                            }
                            onClose={handleMenuClose}
                          >
                            {reply.userId === userId && (
                              <MenuItem
                                onClick={() =>
                                  handleEditReply(reply?._id, reply)
                                }
                              >
                                แก้ไขความคิดเห็น
                              </MenuItem>
                            )}

                            {(user?.role === "admin" ||
                              user?.role === "manager") && (
                              <MenuItem
                                onClick={() => handleDeleteReply(reply?._id)}
                              >
                                ลบความคิดเห็น
                              </MenuItem>
                            )}
                          </Menu>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-sm">{reply?.reply}</p>
                          <div className="flex flex-col w-full">
                            {reply?.sticker && (
                              <div className="flex flex-row gap-1">
                                <Image
                                  src={reply?.sticker?.url}
                                  alt="sticker"
                                  width={80}
                                  height={80}
                                  className="rounded-full"
                                  style={{ width: "auto", height: "80px" }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tools */}
                  </div>
                </div>
              ))}
          </div>
        ))}

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth={true} // ทำให้ Dialog เต็มหน้าจอในแนวกว้าง
        maxWidth="md" // กำหนดขนาดสูงสุดของ Dialog เป็นขนาด "md"
        PaperProps={{
          style: {
            maxHeight: "50vh", // กำหนดความสูงของ Dialog เป็น 50% ของหน้าจอ
            borderRadius: "15px", // กำหนดให้มุมของ Dialog โค้งมน
            margin: "10px",
            padding: "10px",
          },
        }}
      >
        <div>
          <div className="flex flex-row items-center gap-2 mt-5 w-full">
            <IoIosArrowBack
              className="text-xl inline text-gray-700"
              onClick={handleClose}
              size={25}
            />
            <div>
              <span className="font-bold text-lg text-[#0056FF]">
                {type === "comment" ? "ตอบกลับ Verbatim" : "ตอบความคิดเห็น"}
              </span>
            </div>
          </div>

          <Divider className="w-full mt-4 mb-4" />
          {error && (
            <div>
              <span className="text-red-500 px-4">{error}</span>
            </div>
          )}

          <div className="flex flex-col justify-center items-center gap-1 mt-2 px-4 w-full">
            <div className="flex flex-col p-2 bg-white border rounded-xl w-full">
              <textarea
                className="w-full outline-none resize-none"
                placeholder="กรอกความคิดเห็น"
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
              />
              <div className="flex flex-col jestify-center items-center">
                {sticker && (
                  <>
                    <div className="relative flex justify-end items-center ml-20">
                      <IoCloseCircle
                        className="text-lg inline text-gray-900"
                        onClick={() => setSticker(null)}
                      />
                    </div>

                    <Image
                      src={sticker.url}
                      alt="sticker"
                      width={80}
                      height={80}
                      style={{
                        width: "auto",
                        height: "80px",
                        marginTop: "-20px",
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-row justify-end items-center gap-2 px-1">
                <RiEmojiStickerLine
                  className="text-xl inline text-gray-500"
                  size={20}
                  onClick={handleOpenSticker}
                />
                <ImFilePicture
                  className="text-xl inline text-gray-500"
                  size={18}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center gap-2 px-6 w-full mt-2">
            <button
              className="text-white bg-[#0056FF] rounded-xl px-6 py-1"
              onClick={
                type === "comment" ? handleCommentSubmit : handleReplySubmit
              }
            >
              {isEdit ? "แก้ไข" : "ตอบกลับ"}
            </button>
          </div>
        </div>
      </Dialog>

      {openSticker && (
        <Dialog
          open={openSticker}
          onClose={handleCloseSticker}
          TransitionComponent={Transition}
        >
          <StickerPanel setSticker={setSticker} onClose={handleCloseSticker} />
        </Dialog>
      )}
    </div>
  );
};

export default SurveyPanel;

SurveyPanel.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyPanel.auth = true;
