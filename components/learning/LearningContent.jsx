"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { GrLike } from "react-icons/gr";
import { LuMessageCircle } from "react-icons/lu";
import axios from "axios";
import TimeDisplay from "@/components/TimeDisplay";
import CommentList from "@/components/content/CommentList";
import InputComment from "@/components/content/InputComment";
import useSWR, { mutate } from "swr";
import Loading from "../Loading";
import VideoModal from "../VideoModal";
import { useRouter } from "next/router";
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

const LearningContent = ({ content, user }) => {
  const userId = user?.userId;
  const [countdown, setCountdown] = useState(0);
  const [seen60Percent, setSeen60Percent] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [likes, setLikes] = useState(content.likes || []);
  const [userHasLiked, setUserHasLiked] = useState(Array.isArray(likes) && likes.includes(userId));
  const [showInput, setShowInput] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playerRef = useRef(null);
  const contentId = content?._id;
  const router = useRouter();

  const { data , error, isLoading } = useSWR(`/api/content/comments?contentId=${contentId}`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 1000
  });

  const handleCommentAdded = async () => {
      // Refresh comments
      mutate(`/api/content/comments?contentId=${contentId}`);
      // Close comment box
      setShowInput(false);
    };
 
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

  const handleProgress = (state) => {
      const duration = playerRef.current.getDuration();
      const viewed = state.playedSeconds;
      if (viewed / duration >= 0.6 && !seen60Percent) {
          axios.post('/api/views/update', { contentId: content._id});
          setSeen60Percent(true); // set a flag to avoid multiple calls
        }
  
        if (viewed >= duration - 2 && !completed) { // Check if the video is almost complete
          if (content.point !== 0) {
            axios.post('/api/points/earn', {
              userId,
              description: `views video ${content._id}`,
              type: 'earn',
              points: content.point,
            });
          }
          if (content.coins !== 0) {
            axios.post('/api/coins/earn', {
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
      router.push('/learning');
    };

    if (isLoading || !data || !content || !user) return <Loading />;
    if (error) return <div>Error loading comments</div>;

    
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
                            <span className="text-[15px] font-bold text-[#0056FF]" >
                                {content?.title}
                            </span>
                            <span className="text-[12px] font-light text-black">
                                <TimeDisplay time={content?.createdAt} />
                            </span>
                        </div>
                        <div className="inline-block text-left text-[13px] font-light ">
                            {content?.description}
                        </div>

                        <div className="flex flex-row mt-2 justify-left items-baseline space-x-4 h-8" style={{ textSizeAdjust: '100%', fontSize: '12px'}}>
                            <div className="relative inline-flex items-center columns-2 justify-center p-3 bg-[#F2871F] text-white rounded-full h-6 w-15"
                                 onClick={handleLike}
                            >
                                <GrLike className="mr-2"/>
                                {Array.isArray(likes) ? likes.length : 0}
                            </div>
                            <span>การดู {content?.views ? content?.views : 0} ครั้ง</span>
                            <div className="relative inline-flex columns-2 p-3 justify-center h-8 items-baseline" onClick={() => setShowInput(!showInput)}>
                                    <LuMessageCircle className="mr-2"/>
                                    <span>แสดงความคิดเห็น {data?.data ? data?.data.length : 0} ครั้ง</span>
                            </div>
                            
                        </div>
                    </div>
                <div>
                    {showInput && <InputComment contentId={content._id} userId={userId} onCommentAdded={handleCommentAdded} />}
                    <CommentList comments={data?.data} contentId={content._id} user={user} />
                </div>
            </div>
            <VideoModal isOpen={isModalOpen} onRequestClose={handleCloseModal} point={content.point} />
        </div>
    )
}


export default LearningContent;
