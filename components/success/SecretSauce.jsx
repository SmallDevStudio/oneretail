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

const SecretSauce = ({ content, user, onCommentAdded, setShowInput, showInput, comments }) => {
  const userId = user?.userId;
  const [countdown, setCountdown] = useState(0);
  const [seen60Percent, setSeen60Percent] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [likes, setLikes] = useState(content.likes || []);
  const [userHasLiked, setUserHasLiked] = useState(Array.isArray(likes) && likes.includes(userId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoVideoModalOpen, setIsNoVideoModalOpen] = useState(false);
  const playerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const userId = user?.userId;
    setUserHasLiked(Array.isArray(likes) && likes.includes(userId));
  }, [likes, user?.userId, userId]);

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

  const handleLike = async () => {
    try {
      const res = await axios.put(`/api/content/${content._id}`, { userId: user.userId });
      if (res.data.success) {
        setLikes(res.data.data.likes || []);
      }
    } catch (error) {
      console.error('Error liking content:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/stores');
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
          <div className="flex flex-row mt-2 justify-left items-baseline space-x-4 h-8" style={{ textSizeAdjust: '100%', fontSize: '12px'}}>
            <div className="relative inline-flex items-center columns-2 justify-center p-3 bg-[#F2871F] text-white rounded-full h-6 w-15" onClick={handleLike}>
              <svg className={`w-4 h-4 mr-1 ${userHasLiked ? 'text-red-500' : 'text-black'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275.26 275.28">
                <path fill='currentColor' d="M215.39,275.28H10.87c-6.01,0-10.87-4.87-10.87-10.88V113.14c0-6.01,4.87-10.87,10.87-10.87h56.27L143.42,14.33c10.29-11.86,26.19-16.88,41.49-13.09l.73.18c13.15,3.25,23.89,12.69,28.73,25.24,4.79,12.43,3.19,26.46-4.27,37.53l-25.69,38.08h49.35c12.57,0,24.32,5.55,32.23,15.23,7.81,9.55,10.89,21.94,8.45,33.99l-18.37,90.75c-3.88,19.14-20.98,33.04-40.68,33.04ZM82.98,253.53h132.41c9.39,0,17.53-6.56,19.36-15.6l18.37-90.75c1.14-5.63-.31-11.43-3.97-15.9-3.77-4.61-9.38-7.25-15.4-7.25h-69.81c-4.02,0-7.71-2.22-9.6-5.77s-1.66-7.85.59-11.19l37.13-55.04c3.54-5.26,4.28-11.65,2.01-17.55-2.32-6.02-7.29-10.37-13.65-11.94l-.73-.18c-7.34-1.81-14.94.58-19.85,6.23l-76.87,88.62v136.32ZM21.75,253.53h39.48V124.02H21.75v129.51Z"/>
              </svg>
              {Array.isArray(likes) ? likes.length : 0}
            </div>
            <span>การดู {content?.views ? content?.views : 0} ครั้ง</span>
            <div className="relative inline-flex columns-2 p-3 justify-center h-8 items-baseline" onClick={() => setShowInput(!showInput)}>
              <svg className='w-4 h-4 mr-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.04 277.04">
                <path fill='currentColor' d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"/>
                <path fill='currentColor' d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                <path fill='currentColor' d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"/>
                <path fill='currentColor' d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"/>
              </svg>
              <span>แสดงความคิดเห็น {comments ? comments.length : 0} ครั้ง</span>
            </div>
          </div>
        </div>
        <div>
          {showInput && <InputComment contentId={content._id} userId={userId} onCommentAdded={onCommentAdded} />}
        </div>
      </div>
      <VideoModal isOpen={isModalOpen} onRequestClose={handleCloseModal} point={content.point} />
      <NoVideoModal isOpen={isNoVideoModalOpen} onRequestClose={handleCloseModal} />
    </div>
  );
};

export default SecretSauce;
