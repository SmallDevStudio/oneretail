import { AppLayout } from "@/themes";
import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import Link from "next/link";
import { Suspense } from "react";
import LoadingFeed from "@/components/LoadingFeed";
import dynamic from 'next/dynamic';

// Dynamically import ShareYourStory component
const ShareYourStory = dynamic(() => import('@/components/ShareYourStory'), {
    suspense: true,
    ssr: false
});
const Feed = dynamic(() => import('@/components/success/feed'), {
    suspense: true,
    ssr: false
})
export default function Stores() {
    const category = "665c4c51013c2e4b13669c90";
    const [activeTab, setActiveTab] = useState("secret-sauce");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center h-full">
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
            <div className="flex flex-col items-center w-full">
                {activeTab === 'secret-sauce' && (
                    <>
                        <div className="justify-center flex min-w-[100vw]">
                            <ReactPlayer
                                url="https://www.youtube.com/watch?v=nrBdA4mNJpQ"
                                loop={true}
                                width="100%"
                                height="250px"
                                playing={true}
                                
                            />
                        </div>
                        <div>
                            <Suspense fallback={<LoadingFeed />}>
                                <Feed />
                            </Suspense>
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

Stores.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Stores.auth = true;