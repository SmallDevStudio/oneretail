import { AppLayout } from "@/themes";
import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import dynamic from 'next/dynamic';
import useSWR from "swr";
import Loading from "@/components/Loading";
import AllFeed from "@/components/learning/AllFeed";
import LearnFeed1 from "@/components/learning/learnFeed";
import LearnFeed2 from "@/components/learning/LearnFeed2";
import Link from "next/link";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Learning() {
    const category = "665c561146d171292cbda9eb";
    const subcategory = "665c565a46d171292cbda9f7";
    const subcategory2 = "665c566846d171292cbda9fb";
    const [activeTab, setActiveTab] = useState("All");
    const [videoUrl, setVideoUrl] = useState('');
    const [contents, setContents] = useState([]);
    const [contents2, setContents2] = useState([]);
    const [contents3, setContents3] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const tab = router.query.tab || "All";
        setActiveTab(tab);
    }, [router.query.tab]);

    const { data: video, error: videoError } = useSWR(`/api/content/video?categoryId=${category}`, fetcher, {
        onSuccess: (data) => {
            setVideoUrl(data?.data?.slug);
        }
    });

    const { data: contentsData, error: contentsError, isLoading } = useSWR(`/api/content/category?categoryId=${category}`, fetcher, {
        onSuccess: (data) => {
            setContents(data?.data);
        }
    });

    const { data: contentsData1, error: contentsError1, isLoading: isLoading1 } = useSWR(`/api/content/subcategory?subcategoryId=${subcategory}`, fetcher, {
        onSuccess: (data) => {
            setContents2(data?.data);
        }
    });

    const { data: contentsData2, error: contentsError2, isLoading: isLoading2 } = useSWR(`/api/content/subcategory?subcategoryId=${subcategory2}`, fetcher, {
        onSuccess: (data) => {
            setContents3(data?.data);
        }
    });



    const handleTabClick = (tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    };

    if (isLoading) return <Loading />;

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
                        <Link
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'All' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('All')}
                        >
                            ทั้งหมด
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn')}
                        >
                            เรื่องน่าเรียน
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href="#"
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn2' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn2')}
                        >
                            เรื่องน่ารู้
                        </Link>
                    </li>

                    
                </ul>
            </div>

            {/* Tabs Content */}
            <div className="flex flex-col items-center w-full">
                <div className="justify-center flex min-w-[100vw]">
                    <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoUrl}`}
                        loop={true}
                        width="100%"
                        height="250px"
                        playing={true}
                                
                    />
                </div>
                {activeTab === 'All' && (
                    <>
                    {contents.length > 0 ? <AllFeed contents={contents} /> : <p>No content available.</p>}
                    </>
                )}
                {activeTab === 'learn' && (
                    <>
                    {contents2.length > 0 ? <LearnFeed1 contents={contents2} /> : <p>No content available.</p>}
                    </>
                )}

                {activeTab === 'learn2' && (
                    <>
                    {contents3.length > 0 ? <LearnFeed2 contents={contents3} /> : <p>No content available.</p>}
                    </>
                )}
            </div>
        </main>
    )
}


Learning.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Learning.auth = true;