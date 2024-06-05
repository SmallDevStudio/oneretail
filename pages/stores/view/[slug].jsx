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

const SlugPage = () => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [seen60Percent, setSeen60Percent] = useState(false);
    const router = useRouter();

    const { slug } = router.query;
    const id = content?._id;
    const youtube = 'https://www.youtube.com/watch?v='+slug

    const playerRef = useRef(null);
    const userStore = localStorage.getItem('user');
    const userId = JSON.parse(userStore).userId;
    console.log (userId);
    console.log (id);
   

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

    return (
        <main className="flex flex-col bg-gray-200" style={{
            height: "100%",
            width: "100%",
        }}>
        
            <div className="flex p-3 w-full bg-white">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Success</span>
                    <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">
                        Story
                    </span>
                </div>
            </div>
            <div className="flex text-sm font-medium text-center items-center justify-center text-gray-500 border-b border-gray-200 bg-white" >
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-[#0056FF] hover:border-[#F2871F] font-bold">
                        Secret Sauce
                    </a>
                </li>
                <li className="me-2">
                    <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-[#0056FF] hover:border-[#F2871F] font-bold">
                        Share your story
                    </a>
                </li>
            </ul>
            </div>

            <div className="flex flex-col justify-center items-center p-2 bg-white">
                <div className="flex flex-col">
                    <div className="relative justify-center items-center">
                       <ReactPlayer url={youtube} loop={false} width={430} height={250} playing={true} ref={playerRef} onProgress={handleProgress}/>
                    </div>
                    <div className="relative w-full p-4">
                        <h1 className="text-[16px] font-bold text-[#0056FF]" style={{ fontFamily: "Ekachon", fontSmoothing: "auto", fontWeight: "black" }}>{content?.title}</h1>
                        <p className="text-[13px] font-light" >{content?.description}</p>
                        <div >
                            <div className="w-full p-2 h-10">
                                <button type="button" className="text-white bg-[#F2871F] hover:bg-gray-100 border border-gray-200 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-1 mb-1">
                                    <GrLike className="w-5 h-3 me-2 -ms-1"/>
                                    {content?.like}
                                </button>
                                <div className="text-gray-900 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-1 mb-1 ms-3">
                                    <span>การดู {content?.views ? content?.views : 0} ครั้ง</span>
                                </div>
                                <div className="text-gray-900 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-1 mb-1 ms-3">
                                    <LuMessageCircle className="w-5 h-3 me-2 -ms-1"/>
                                    <span>แสดงความคิดเห็น</span>
                                </div>
                            </div>
                        </div>
                        Remaining Time: {formatTime(countdown)}
                    </div>
                    <hr />

                    <div className="flex w-full justify-center items-center mt-3 mb-[120px]">
                        <Comments id={content._id}/>
                    </div>
                        
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <CommentBar id={content._id}/>
            </div>
        </main>
    )
}

export default SlugPage;

SlugPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SlugPage.auth = true;