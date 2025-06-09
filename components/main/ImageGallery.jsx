import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Modal, Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegPlayCircle } from "react-icons/fa";
import { TbZoomScan } from "react-icons/tb";
import axios from "axios";
import { GrView } from "react-icons/gr";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { MdFileDownload } from "react-icons/md";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageGallery = ({ medias, userId }) => {
  const [open, setOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [hasSentView, setHasSentView] = useState({}); // state เพื่อเก็บสถานะการส่งข้อมูล views
  const [videoViews, setVideoViews] = useState({});
  const videoRef = useRef([]); // ใช้ ref เก็บ video element หลายตัว
  const videoStartTimes = useRef({});
  const videoDurations = useRef({});
  const [currentIndex, setCurrentIndex] = useState(0);
  // รีเซ็ต hasSentView เมื่อ medias เปลี่ยน (เช่นเมื่อเปลี่ยนโพสต์)
  useEffect(() => {
    setHasSentView({}); // รีเซ็ตค่า hasSentView ทุกครั้งเมื่อโพสต์หรือ medias เปลี่ยน
  }, [medias]);

  const handleOpen = async (media, index) => {
    setCurrentMedia(media);
    setCurrentIndex(index); // <--- เพิ่มบรรทัดนี้
    setOpen(true);

    // 👉 เก็บเวลา view
    const now = Date.now();
    const postId = media.postId;
    const publicId = media.public_id;

    if (media.type === "image") {
      // image view
      setTimeout(async () => {
        const end = Date.now();
        const duration = end - now;

        if (duration > 1500 && !hasSentView[index]) {
          await axios.post("/api/posts/viewlog", {
            publicId,
            postId,
            userId,
            mediaType: "image",
            startTime: new Date(end - duration),
            endTime: new Date(end),
            duration,
          });

          setHasSentView((prev) => ({ ...prev, [index]: true }));
        }
      }, 2000);
    } else if (media.type === "video") {
      // video view count
      try {
        const res = await axios.get(`/api/libraries/views/${publicId}`);
        const views = res?.data?.data?.views || 0;
        setVideoViews((prev) => ({ ...prev, [publicId]: views }));
      } catch (err) {
        console.error("Error fetching video views:", err);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentMedia(null);
  };

  const handleImageView = async (index) => {
    const publicId = medias[index].public_id;
    const postId = medias[index].postId; // ต้องส่ง postId มาด้วยจาก Feed
    if (!publicId || hasSentView[index]) return;

    const startTime = new Date();
    setTimeout(async () => {
      const endTime = new Date();
      const duration = endTime - startTime;

      if (duration > 1500) {
        try {
          await axios.post("/api/posts/viewlog", {
            publicId,
            postId,
            userId,
            mediaType: "image",
            startTime,
            endTime,
            duration,
          });

          setHasSentView((prev) => ({ ...prev, [index]: true }));
        } catch (error) {
          console.error("Image view error:", error);
        }
      }
    }, 2000); // รอให้ดูครบ 2 วินาที
  };

  // ฟังก์ชันสำหรับ handleTimeUpdate
  const handleTimeUpdate = async (index) => {
    const videoElement = videoRef.current[index];
    if (!videoElement) return;

    const percentPlayed =
      (videoElement.currentTime / videoElement.duration) * 100;

    // ถ้าการเล่นถึง 80% และยังไม่ได้ส่งข้อมูล views ให้ส่งข้อมูล
    if (percentPlayed >= 60 && !hasSentView[index]) {
      try {
        await axios.post("/api/libraries/views", {
          publicId: medias[index].public_id,
          userId,
        });

        // อัปเดตสถานะว่าได้ส่งข้อมูลไปแล้วสำหรับวิดีโอนี้
        setHasSentView((prevState) => ({
          ...prevState,
          [index]: true,
        }));
      } catch (error) {
        console.error("Error posting video view:", error);
      }
    }
  };

  const handleVideoPlay = (index) => {
    if (!videoStartTimes.current[index]) {
      videoStartTimes.current[index] = Date.now(); // เริ่มนับเวลา
    }
  };

  const handleVideoPauseOrEnd = async (index, ended = false) => {
    const start = videoStartTimes.current[index];
    if (!start) return;

    const now = Date.now();
    const duration = now - start;

    const publicId = medias[index].public_id;
    const postId = medias[index].postId;

    // ยังไม่ได้ส่งหรือรวมเวลาใหม่
    videoDurations.current[index] =
      (videoDurations.current[index] || 0) + duration;
    videoStartTimes.current[index] = null;

    // ถ้า end จริงหรือเล่นไปเกิน 80% แล้ว ค่อยส่ง
    const videoElement = videoRef.current[index];
    const percentPlayed =
      (videoElement.currentTime / videoElement.duration) * 100;

    if ((ended || percentPlayed >= 60) && !hasSentView[index]) {
      try {
        await axios.post("/api/posts/viewlog", {
          publicId,
          postId,
          userId,
          mediaType: "video",
          startTime: new Date(now - duration),
          endTime: new Date(now),
          duration: videoDurations.current[index],
        });

        await axios.post("/api/libraries/views", {
          publicId,
          userId,
        });

        setHasSentView((prev) => ({ ...prev, [index]: true }));
        setVideoViews((prev) => ({
          ...prev,
          [publicId]: (prev[publicId] || 0) + 1,
        }));
      } catch (err) {
        console.error("Video view error:", err);
      }
    }
  };

  const getGridLayout = (medias) => {
    const length = medias.length;

    if (length === 1) {
      return [[medias[0]]]; // แถวเดียว
    } else if (length <= 3) {
      return [medias]; // แถวเดียว grid-cols ตามจำนวน
    } else if (length <= 5) {
      return [
        medias.slice(0, 2), // แถวแรก 2
        medias.slice(2), // แถวสองตามที่เหลือ (2–3)
      ];
    } else {
      return [
        medias.slice(0, 2), // แถวแรก 2
        medias.slice(2, 5), // แถวสอง 3
      ];
    }
  };

  const goNext = () => {
    if (currentIndex < medias.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentMedia(medias[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentMedia(medias[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  };

  const handleDownload = async (media) => {
    try {
      const response = await fetch(media.url, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image.");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${media.public_id}.jpg`; // หรือ .png ตาม type จริง
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // ล้าง blob memory
    } catch (error) {
      console.error("Download failed:", error);
      alert("ไม่สามารถดาวน์โหลดรูปภาพได้");
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-2 w-full">
          {(() => {
            const layout = getGridLayout(medias);
            const maxDisplay = 5;

            return layout.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-1items-center justify-center ${
                  row.length === 1
                    ? "grid-cols-1 items-center justify-center"
                    : row.length === 2
                    ? "grid-cols-2 items-center justify-center gap-1"
                    : "grid-cols-3 items-center justify-center gap-1"
                }`}
              >
                {row.map((media, index) => {
                  const globalIndex = rowIndex === 0 ? index : index + 2;

                  const showOverlay =
                    medias.length > maxDisplay &&
                    rowIndex === 1 &&
                    index === row.length - 1;

                  const remaining = medias.length - maxDisplay;

                  return (
                    <div
                      key={globalIndex}
                      className="relative cursor-pointer"
                      onClick={() => handleOpen(media, globalIndex)}
                    >
                      {medias.length === 1 ? (
                        <div className="w-full">
                          {medias[0].type === "image" ? (
                            <Image
                              src={medias[0].url}
                              alt="single-media"
                              width={600}
                              height={400}
                              className="w-full h-auto object-contain rounded"
                              onClick={() => handleOpen(medias[0], 0)}
                              onLoad={() => handleImageView(0)}
                            />
                          ) : (
                            <div className="relative w-full">
                              <video
                                src={medias[0].url}
                                controls
                                autoPlay
                                ref={(el) => (videoRef.current[0] = el)}
                                className="w-full h-auto object-contain rounded"
                                onTimeUpdate={() => handleTimeUpdate(0)}
                                onPlay={() => handleVideoPlay(0)}
                                onPause={() => handleVideoPauseOrEnd(0)}
                                onEnded={() => handleVideoPauseOrEnd(0, true)}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FaRegPlayCircle className="text-white text-3xl" />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {media.type === "image" ? (
                            <div className="relative w-full h-48 md:h-64 overflow-hidden rounded">
                              <Image
                                src={media.url}
                                alt="media"
                                fill
                                className="object-cover w-full h-full"
                                onLoad={() => handleImageView(globalIndex)}
                              />
                            </div>
                          ) : (
                            <div className="relative w-full h-48 md:h-64 overflow-hidden rounded">
                              <video
                                src={media.url}
                                ref={(el) =>
                                  (videoRef.current[globalIndex] = el)
                                }
                                className="object-cover w-full h-full"
                                onTimeUpdate={() =>
                                  handleTimeUpdate(globalIndex)
                                }
                                onPlay={() => handleVideoPlay(globalIndex)}
                                onPause={() =>
                                  handleVideoPauseOrEnd(globalIndex)
                                }
                                onEnded={() =>
                                  handleVideoPauseOrEnd(globalIndex, true)
                                }
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FaRegPlayCircle className="text-white text-3xl" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {showOverlay && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-bold">
                          +{remaining}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            margin: 0,
          },
        }}
      >
        <DialogContent>
          {currentMedia && (
            <div>
              <div className="flex justify-end p-2 gap-2">
                <MdFileDownload
                  size={24}
                  className="text-[#F2871F] cursor-pointer bg-white rounded-full"
                  onClick={() => handleDownload(currentMedia)}
                />
                <IoIosCloseCircleOutline
                  size={24}
                  className="text-[#F2871F] cursor-pointer bg-white rounded-full"
                  onClick={handleClose}
                />
              </div>

              <div className="flex items-center w-full">
                {currentMedia.type === "image" ? (
                  <Image
                    src={currentMedia.url}
                    alt="image"
                    width={600}
                    height={400}
                    className="rounded-xl object-cover"
                    style={{ width: "100%", height: "auto" }}
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full">
                    <video
                      ref={(el) =>
                        (videoRef.current[medias.indexOf(currentMedia)] = el)
                      }
                      src={currentMedia.url}
                      controls
                      autoPlay
                      className="object-cover w-full h-auto"
                      onPlay={() =>
                        handleVideoPlay(medias.indexOf(currentMedia))
                      }
                      onPause={() =>
                        handleVideoPauseOrEnd(
                          medias.indexOf(currentMedia),
                          false
                        )
                      }
                      onEnded={() =>
                        handleVideoPauseOrEnd(
                          medias.indexOf(currentMedia),
                          true
                        )
                      }
                    />
                    <div className="text-right text-sm text-gray-600 pr-4 mt-1">
                      <GrView className="inline-block mr-1" />
                      {videoViews[currentMedia.public_id] || 0} views
                    </div>
                  </div>
                )}
              </div>

              {medias.length > 1 && (
                <div className="flex items-center justify-between mt-4 px-4 text-white">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={` px-3 py-1 rounded-full text-lg ${
                      currentIndex === 0
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-black/20"
                    }`}
                  >
                    ◀
                  </button>

                  <span className="text-sm font-semibold bg-white opacity-30 text-black px-2 py-1 rounded-xl">
                    {currentIndex + 1} / {medias.length}
                  </span>

                  <button
                    onClick={goNext}
                    disabled={currentIndex === medias.length - 1}
                    className={`px-3 py-1 rounded-full text-lg ${
                      currentIndex === medias.length - 1
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-black/20"
                    }`}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
