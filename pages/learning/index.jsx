import { AppLayout } from "@/themes";
import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { Suspense } from "react";
import LoadingFeed from "@/components/LoadingFeed";
import dynamic from 'next/dynamic';
import useSWR from "swr";

// Dynamically import ShareYourStory component
const ShareYourStory = dynamic(() => import('@/components/ShareYourStory'), {
    suspense: true,
    ssr: false
});
const Feed = dynamic(() => import('@/components/learning/feed'), {
    suspense: true,
    ssr: false
});

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Learning() {
    const category = "665c561146d171292cbda9eb";
    const [activeTab, setActiveTab] = useState("All");

    const { data: video, error } = useSWR(`/api/content/video?categories=${category}`, fetcher);
    const videoUrl = 'https://www.youtube.com/watch?v='+video?.data?.slug

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center h-full">
            <div>
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Learning</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-4 text-sm">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'All' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('All')}
                        >
                            ทั้งหมด
                        </a>
                    </li>
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn')}
                        >
                            เรื่องน่าเรียน
                        </a>
                    </li>
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn2' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn2')}
                        >
                            เรื่องน่ารู้
                        </a>
                    </li>

                    
                </ul>
            </div>

            {/* Tabs Content */}
            <div className="flex flex-col items-center w-full">
                <div className="justify-center flex min-w-[100vw]">
                    <ReactPlayer
                        url={videoUrl}
                        loop={true}
                        width="100%"
                        height="250px"
                        playing={true}
                                
                    />
                </div>
                {activeTab === 'All' && (
                    <>
                        
                        <div>
                            <Suspense fallback={<LoadingFeed />}>
                                <Feed />
                            </Suspense>
                        </div>
                    </>
                )}
                {activeTab === 'learn' && (
                    <Suspense fallback={<LoadingFeed />}>
                        <div>
                            เรื่องน่าเรียน
                        </div>
                    </Suspense>
                )}

                {activeTab === 'learn2' && (
                    <Suspense fallback={<LoadingFeed />}>
                        <div>
                            เรื่องน่ารู่
                        </div>
                    </Suspense>
                )}
            </div>
        </main>
    )
}


Learning.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Learning.auth = true;