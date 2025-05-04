import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Dialog, Slide } from "@mui/material";
import { GrView } from "react-icons/gr";
import { FaRegPlayCircle } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import Loading from "@/components/Loading";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FeedVideo = ({ posts }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [videoViews, setVideoViews] = useState({});
  const [hasSentView, setHasSentView] = useState({});
  const videoRef = useRef(null);
  const videoStart = useRef(null);
  const videoDuration = useRef(0);

  useEffect(() => {
    setLoading(true);
    const fetchAllViews = async () => {
      const allMedia = posts
        .flatMap((post) => post.medias || [])
        .filter((media) => media.type === "video" && media.public_id);

      const viewMap = {};

      for (const media of allMedia) {
        try {
          const res = await axios.get(
            `/api/libraries/views/${media.public_id}`
          );
          viewMap[media.public_id] = res?.data?.data?.views || 0;
        } catch (err) {
          console.error(`Error fetching views for ${media.public_id}:`, err);
          viewMap[media.public_id] = 0;
        }
      }

      setVideoViews(viewMap);
      setLoading(false);
    };

    if (posts?.length > 0) {
      fetchAllViews();
    }
  }, [posts]);

  const handleOpen = async (media) => {
    setCurrentMedia(media);
    setOpen(true);

    try {
      const res = await axios.get(`/api/libraries/views/${media.public_id}`);
      const views = res?.data?.data?.views || 0;
      setVideoViews((prev) => ({
        ...prev,
        [media.public_id]: views,
      }));
    } catch (err) {
      console.error("Fetch views error:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentMedia(null);
    videoStart.current = null;
    videoDuration.current = 0;
  };

  const handlePlay = () => {
    if (!videoStart.current) videoStart.current = Date.now();
  };

  const handlePauseOrEnd = async (ended = false) => {
    const start = videoStart.current;
    const now = Date.now();

    if (!start || !currentMedia || hasSentView[currentMedia.public_id]) return;

    videoDuration.current += now - start;
    videoStart.current = null;

    const video = videoRef.current;
    const percentPlayed = (video.currentTime / video.duration) * 100;

    if (ended || percentPlayed >= 60) {
      try {
        await axios.post("/api/posts/viewlog", {
          publicId: currentMedia.public_id,
          postId: currentMedia.postId,
          userId: session?.user?.id,
          mediaType: "video",
          startTime: new Date(now - videoDuration.current),
          endTime: new Date(now),
          duration: videoDuration.current,
        });

        await axios.post("/api/libraries/views", {
          publicId: currentMedia.public_id,
          userId: session?.user?.id,
        });

        setHasSentView((prev) => ({
          ...prev,
          [currentMedia.public_id]: true,
        }));
        setVideoViews((prev) => ({
          ...prev,
          [currentMedia.public_id]: (prev[currentMedia.public_id] || 0) + 1,
        }));
      } catch (error) {
        console.error("View log error:", error);
      }
    }
  };

  if (!posts) return <Loading />;

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-3 gap-2">
        {posts
          .filter((post) =>
            post?.medias?.some((media) => media.type === "video")
          )
          .map((post) =>
            post.medias
              .filter((media) => media.type === "video")
              .map((media, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => handleOpen({ ...media, postId: post._id })}
                >
                  <video
                    src={media.url}
                    muted
                    className="w-full h-auto object-cover rounded-md"
                    style={{ maxHeight: 200 }}
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <FaRegPlayCircle className="text-white text-4xl" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white/70 flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                    <GrView />
                    <span>{videoViews[media.public_id] ?? 0}</span>
                  </div>
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
        <div className="flex justify-end p-2">
          <IoIosCloseCircleOutline
            size={28}
            className="text-orange-500 cursor-pointer"
            onClick={handleClose}
          />
        </div>
        {currentMedia && (
          <div className="w-full h-full flex justify-center items-center bg-black">
            <video
              ref={videoRef}
              src={currentMedia.url}
              controls
              autoPlay
              className="max-w-full max-h-full"
              onPlay={handlePlay}
              onPause={() => handlePauseOrEnd(false)}
              onEnded={() => handlePauseOrEnd(true)}
            />
            <div className="absolute bottom-4 right-4 text-sm text-white bg-black/60 px-3 py-1 rounded-full">
              <GrView className="inline-block mr-1" />
              {videoViews[currentMedia.public_id] ?? 0} views
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default FeedVideo;
