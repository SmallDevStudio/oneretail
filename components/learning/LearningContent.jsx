"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import axios from "axios";
import TimeDisplay from "@/components/TimeDisplay";
import InputComment from "@/components/content/InputComment";
import Loading from "../Loading";
import Image from "next/image";
import VideoModal from "../VideoModal";
import NoVideoModal from "../NoVideoModal";
import { useRouter } from "next/router";

const LearningContent = ({ content, user, onCommentAdded, setShowInput, showInput, comments }) => {
  const userId = user?.userId;
  const [countdown, setCountdown] = useState(0);
  const [seen60Percent, setSeen60Percent] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoVideoModalOpen, setIsNoVideoModalOpen] = useState(false);
  const playerRef = useRef(null);
  const router = useRouter();


  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const duration = playerRef.current.getDuration();
        const playedSeconds = playerRef.current.getCurrentTime();
        const remainingTime = Math.max(duration - playedSeconds, 0);
        setCountdown(remainingTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hasReceivedPoints = async (userId, contentId) => {
    try {
      const response = await axios.get(`/api/points/check?userId=${userId}&contentId=${contentId}`);
      return response.data.hasReceivedPoints;
    } catch (error) {
      console.error('Error checking points:', error);
      return false;
    }
  };

  const handleProgress = async (state) => {
    const duration = playerRef.current.getDuration();
    const viewed = state.playedSeconds;

    if (viewed / duration >= 0.6 && !seen60Percent) {
      await axios.post('/api/views/update', { contentId: content._id, userId });
      setSeen60Percent(true); // set a flag to avoid multiple calls
    }

    if (viewed >= duration - 2 && !completed) { // Check if the video is almost complete
      const alreadyReceivedPoints = await hasReceivedPoints(userId, content._id);
      if (alreadyReceivedPoints) {
        setIsNoVideoModalOpen(true);
        setCompleted(true);
        return;
      }

      if (content.point !== 0) {
        await axios.post('/api/points/earn', {
          userId,
          description: `views video ${content._id}`,
          contentId: content._id,
          type: 'earn',
          points: content.point,
        });
      }
      if (content.coins !== 0) {
        await axios.post('/api/coins/earn', {
          userId,
          description: `views video ${content._id}`,
          type: 'earn',
          coins: content.coins,
        });
      }
      setIsModalOpen(true);
      setCompleted(true); // set a flag to avoid multiple calls
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/learning');
  };

  if (!content || !user || !comments ) return <Loading />;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <div className="justify-center flex min-w-[100vw]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${content.slug}&modestbranding=1&rel=0`}
            loop={false}
            width="100%"
            height="250px"
            playing={true}
            ref={playerRef}
            onProgress={handleProgress}
          />
        </div>
        <div className="flex flex-col p-4 w-full mt-[-15px]">
          <div className="flex flex-row text-left items-center justify-between w-full text-sm font-bold text-[#0056FF]">
            <div className="relative h-6 w-20 rounded-full">
              <span className="relative inline-flex items-center justify-center px-2 gap-2">
                <Image src="/images/other/clock-01.svg" alt="clock" width={15} height={15} />
                {formatTime(countdown)}
              </span>
            </div>
            <div className="flex flex-row">
              <span className="flex ">ดูจบ </span>
              <span className="flex text-lg ml-1">
                <Image src="/images/other/clock-01.svg" alt="clock" width={15} height={15} />
              </span>
              <span className="flex ml-1">+ {content?.point} Point</span>
              {content?.coins !== 0 && <span className="flex ml-1">+ {content?.coins} Coin</span>}
            </div>
          </div>
          <div className="flex flex-col text-left mb-2">
            <span className="text-[15px] font-bold text-[#0056FF]">
              {content?.title}
            </span>
            <span className="text-[12px] font-light text-black">
              <TimeDisplay time={content?.createdAt} />
            </span>
          </div>
          <div className="inline-block text-left text-[13px] font-light">
            {content?.description}
          </div>
        </div>
      </div>
      <VideoModal isOpen={isModalOpen} onRequestClose={handleCloseModal} point={content.point} />
      <NoVideoModal isOpen={isNoVideoModalOpen} onRequestClose={handleCloseModal} />
    </div>
  );
};

export default LearningContent;
