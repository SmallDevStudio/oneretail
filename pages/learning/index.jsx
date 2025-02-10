// learning
import { AppLayout } from "@/themes";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import useSWR from "swr";
import Loading from "@/components/Loading";
import LearnFeed2 from "@/components/learning/LearnFeed2";
import LearnSkeleton from "@/components/SkeletonLoader/LearnSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import ArticleList from "@/components/article/ArticleList";
import SearchBar from "@/components/SearchBar";


const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Learning() {
    const category = "665c561146d171292cbda9eb";
    const subcategory = "665c565a46d171292cbda9f7";
    const subcategory2 = "665c566846d171292cbda9fb";
    const [activeTab, setActiveTab] = useState("learn");
    const [contents, setContents] = useState([]);
    const [contents2, setContents2] = useState([]);
    const [contents3, setContents3] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const tab = router.query.tab || "learn";
        setActiveTab(tab);
    }, [router.query.tab]);



    const { data: contentsData, error: contentsError } = useSWR(`/api/content/category?categoryId=${category}`, fetcher, {
        onSuccess: (data) => {
            setContents(data?.data);
        }
    });

    const { data: contentsData1, error: contentsError1 } = useSWR(`/api/content/subcategory?subcategoryId=${subcategory}`, fetcher, {
        onSuccess: (data) => {
            setContents2(data?.data);
        }
    });

    const { data: contentsData2, error: contentsError2 } = useSWR(`/api/content/subcategory?subcategoryId=${subcategory2}`, fetcher, {
        onSuccess: (data) => {
            setContents3(data?.data);
        }
    });

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    };

    if (!contents || !contents2 || !contents3 ) return <Loading />;
    if (contentsError || contentsError1 || contentsError2 ) return <p>Error: {contentsError || contentsError1 || contentsError2 || videoError}</p>;

    return (
        <div className="flex flex-col bg-gray-10 justify-between items-center text-center">
            <div>
                <div className="flex items-center text-center justify-center p-2">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Learning</span>
                </div>
            </div>
            {/* Search */}
            <SearchBar page={category}/>
        

            {/* Tabs */}
            <div className="flex justify-center mb-4 text-sm">
                <ul className="flex flex-wrap gap-6">
                
                    <li className="me-2">
                        <Link
                            href="#learn"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn')}
                        >
                            เรื่องน่าเรียน
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href="#learn2"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn2' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn2')}
                        >
                            เรื่องน่ารู้
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href="#article"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'article' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('article')}
                        >
                            เรื่องน่าอ่าน
                        </Link>
                    </li>

                    
                </ul>
            </div>

            {/* Tabs Content */}
            <div className="flex flex-col items-center w-full">
                    {activeTab === 'learn' && (
                        <>
                        {contents2.length > 0 ? <LearnFeed2 contents={contents2} /> : <LearnSkeleton />}
                        </>
                    )}

                    {activeTab === 'learn2' && (
                        <>
                        {contents3.length > 0 ? <LearnFeed2 contents={contents3} /> : <LearnSkeleton />}
                        </>
                    )}

                    {activeTab === 'article' && (
                        <ArticleList />
                            
                        
                    )}
            </div>
        </div>
    )
}

