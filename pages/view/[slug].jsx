"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import Comments from "@/components/success/coments";
import { useRouter } from "next/router";
import { GrLike } from "react-icons/gr";
import { LuMessageCircle } from "react-icons/lu";
import { AppLayout } from "@/themes";
import CommentBar from "@/components/CommentBar";
import axios from "axios";
import Loading from "@/components/Loading";
import ShareYourStory from "@/components/ShareYourStory";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingFeed from "@/components/LoadingFeed";
import { IoMdTimer } from "react-icons/io";
import TimeDisplay from "@/components/TimeDisplay";

const SlugPage = () => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("secret-sauce");
    const [countdown, setCountdown] = useState(0);
    const [seen60Percent, setSeen60Percent] = useState(false);
    const router = useRouter();

    const { slug } = router.query;
    const id = content?._id;
    const youtube = 'https://www.youtube.com/watch?v='+slug

    const playerRef = useRef(null);
    const userStore = localStorage.getItem('user');
    const userId = JSON.parse(userStore).userId;

    const fetchVideo = async () => {
        setLoading(true);
        const res = await fetch(`/api/content/slug/${slug}`);
        const data = await res.json();
        setContent(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

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

    if (loading) {
        return <Loading />
    }

    const handleProgress = (state) => {
        const duration = playerRef.current.getDuration();
        const viewed = state.playedSeconds;
    
        if (viewed / duration >= 0.6 && !seen60Percent) {
            axios.post('/api/views/update', { contentId: content._id});
            setSeen60Percent(true); // set a flag to avoid multiple calls
          }
    
        if (viewed === duration) {
          if (content.points !== 0 ) {
                axios.post('/api/points/earn', {
                userId,
                description: `views video ${id}`,
                type: 'earn',
                points: content.point,
              });
          }
          if (content.coins !== 0 ) {
                axios.post('/api/coins/earn', {
                userId,
                description: `views video ${id}`,
                type: 'earn',
                coins: content.coins,
              });
            }
        }
      };

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      };

      const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
      


    return (
        <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center h-full mb-[100px]">
            <div>
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Success</span>
                    <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">
                        Story
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-4 text-sm">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'secret-sauce' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('secret-sauce')}
                        >
                            Secret Sauce
                        </a>
                    </li>
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'share-your-story' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('share-your-story')}
                        >
                            Share your story
                        </a>
                    </li>
                </ul>
            </div>

            {/* Tabs Content */}
            <div className="flex flex-col items-center">
                
                {activeTab === 'secret-sauce' && (
                    <>
                        <div className="justify-center flex min-w-[100vw]">
                            <ReactPlayer
                                url={youtube}
                                loop={false}
                                width="100%"
                                height="250px"
                                playing={true}
                                ref={playerRef} 
                                onProgress={handleProgress}
                                
                            />
                        </div>
                        <div className="absolute right-0 top-80 mt-20 mb-20 bg-[#0056FF] text-white h-6 w-20 rounded-full">
                            <span className="relative inline-flex items-center justify-center">
                                <IoMdTimer className="mr-2"/>
                                {formatTime(countdown)}
                            </span>
                        </div>
                        
                        <div className="flex flex-col p-4 w-full">
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
                                <div className="relative inline-flex items-center columns-2 justify-center p-3 bg-[#F2871F] text-white rounded-full h-6 w-15">
                                    <GrLike className="mr-2"/>
                                    {content?.like}
                                </div>
                                <span>การดู {content?.views ? content?.views : 0} ครั้ง</span>
                                <div className="relative inline-flex columns-2 p-3 justify-center h-8 items-baseline">
                                    <LuMessageCircle className="mr-2"/>
                                    <span>แสดงความคิดเห็น</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col p-4 w-full">
                            <Suspense fallback={<LoadingFeed />}>
                                <Comments id={content._id}/>
                            </Suspense>
                        </div>
                        <div className="flex flex-col w-full">
                            <CommentBar id={content._id}/>
                        </div>
                    </>
                )}
                {activeTab === 'share-your-story' && (
                    <Suspense fallback={<LoadingFeed />}>
                        <ShareYourStory />
                    </Suspense>
                )}
            </div>
        </main>
    )
}


export default SlugPage;

SlugPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SlugPage.auth = true;