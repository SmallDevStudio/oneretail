import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Modal, Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegPlayCircle } from "react-icons/fa";
import { TbZoomScan } from "react-icons/tb";
import axios from "axios";
import { GrView } from "react-icons/gr";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

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
  // รีเซ็ต hasSentView เมื่อ medias เปลี่ยน (เช่นเมื่อเปลี่ยนโพสต์)
  useEffect(() => {
    setHasSentView({}); // รีเซ็ตค่า hasSentView ทุกครั้งเมื่อโพสต์หรือ medias เปลี่ยน
  }, [medias]);

  const handleOpen = async (media, index) => {
    setCurrentMedia(media);
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
        const res = await axios.get(
          `/api/libraries/views?publicId=${publicId}`
        );
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

  return (
    <div className="flex gap-2 pb-20">
      <div className="flex flex-col justify-center items-center w-full">
        {medias.length > 1 ? (
          <div className="grid grid-cols-2">
            {medias.map((media, index) => (
              <div key={index} className="flex relative">
                {media.type === "image" ? (
                  <div
                    className="flex flex-col w-full"
                    onClick={() => handleOpen(media, index)}
                    style={{ width: "180px", height: "250px" }}
                  >
                    <div
                      className="flex w-full relative"
                      style={{ width: "180px", height: "210px" }}
                    >
                      <Image
                        src={media.url}
                        alt="image"
                        width={600}
                        height={400}
                        className="object-cover cursor-pointer"
                        style={{ width: "100%", height: "auto" }}
                        loading="lazy"
                        onLoad={() => handleImageView(index)} // เรียกเมื่อโหลดภาพสำเร็จ
                      />
                    </div>
                    <div className="flex relative bottom-8 right-1 justify-end items-center">
                      <div className="bg-white/50 flex justify-center items-center rounded-full p-2">
                        <TbZoomScan />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative w-full cursor-pointer"
                    onClick={() => handleOpen(media, index)}
                  >
                    <video
                      src={media.url}
                      ref={(el) => (videoRef.current[index] = el)}
                      className="object-cover cursor-pointer"
                      style={{ width: "100%", height: "auto" }}
                      onTimeUpdate={() => handleTimeUpdate(index)}
                      onPlay={() => handleVideoPlay(index)}
                      onPause={() => handleVideoPauseOrEnd(index)}
                      onEnded={() => handleVideoPauseOrEnd(index, true)}
                      onLoad={() => handleVideoLoad(index)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaRegPlayCircle className="text-white text-3xl drop-shadow-lg" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/70 flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                      <GrView />
                      <span>{videoViews[media.public_id] || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          medias.map((media, index) => (
            <div key={index} className="flex relative">
              {media.type === "image" ? (
                <div className="flex flex-col w-full">
                  <div
                    className="flex relative w-full"
                    onClick={() => handleOpen(media, index)}
                  >
                    <Image
                      src={media.url}
                      alt="image"
                      width={600}
                      height={400}
                      className="object-cover cursor-pointer"
                      style={{ width: "100%", height: "auto" }}
                      loading="lazy"
                      onLoad={() => handleImageView(index)} // เรียกเมื่อโหลดภาพสำเร็จ
                    />
                  </div>
                  <div className="flex relative bottom-10 right-2 justify-end items-center">
                    <div className="bg-white/50 flex justify-center items-center rounded-full p-2">
                      <TbZoomScan />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-full cursor-pointer"
                  onClick={() => handleOpen(media, index)}
                >
                  <video
                    src={media.url}
                    ref={(el) => (videoRef.current[index] = el)}
                    className="object-cover cursor-pointer h-full"
                    style={{ width: "100%", height: "auto" }}
                    onTimeUpdate={() => handleTimeUpdate(index)}
                    onPlay={() => handleVideoPlay(index)}
                    onPause={() => handleVideoPauseOrEnd(index)}
                    onEnded={() => handleVideoPauseOrEnd(index, true)}
                    onLoad={() => handleVideoLoad(index)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaRegPlayCircle className="text-white text-3xl drop-shadow-lg" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white/70 flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                    <GrView />
                    <span>{videoViews[media.public_id] || 0}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ bgcolor: "#fff", p: 0 }}>
          {currentMedia && (
            <div>
              <div className="flex justify-end p-2">
                <IoIosCloseCircleOutline
                  size={24}
                  className="text-[#F2871F] cursor-pointer"
                  onClick={handleClose}
                />
              </div>

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
                    onPlay={() => handleVideoPlay(medias.indexOf(currentMedia))}
                    onPause={() =>
                      handleVideoPauseOrEnd(medias.indexOf(currentMedia), false)
                    }
                    onEnded={() =>
                      handleVideoPauseOrEnd(medias.indexOf(currentMedia), true)
                    }
                  />
                  <div className="text-right text-sm text-gray-600 pr-4 mt-1">
                    <GrView className="inline-block mr-1" />
                    {videoViews[currentMedia.public_id] || 0} views
                  </div>
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
