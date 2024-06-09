"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import axios from "axios";
import Loading from "@/components/Loading";
import LearningContent from "@/components/learning/LearningContent";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const SlugPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [content, setContent] = useState({});
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("All");
    const { data: session } = useSession();
    const userId = session?.user?.id;

    
    const { data, error: swrError } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
        onSuccess: (data) => {
          setUser(data.user);
        },
      });

      useEffect(() => {
        const tab = router.query.tab || "secret-sauce";
        setActiveTab(tab);
    }, [router.query.tab]);

      useEffect(() => {
        if (id) {
          const fetchContent = async () => {
            try {
              const res = await axios.get(`/api/content/${id}`);
              setContent(res.data.data);
            } catch (error) {
              setError(error.response ? error.response.data.error : error.message);
            } finally {
              setLoading(false);
            }
          };
    
          fetchContent();
        }
      }, [id]);
    
      if (loading) return <Loading />;
      if (error) return <p>Error: {error}</p>;
    
      const handleTabClick = (tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    };
      
    return (
        <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center h-full mb-[100px]">
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
                            href={"#"}
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'All' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('All')}
                        >
                            ทั้งหมด
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href={"/learning"}
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn')}
                        >
                            เรื่องน่าเรียน
                        </Link>
                    </li>
                    <li className="me-2">
                        <a
                            href={"/learning"}
                            className={`inline-block p-4 border-b-2 rounded-t-lg font-bold ${activeTab === 'learn2' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('learn2')}
                        >
                            เรื่องน่ารู้
                        </a>
                    </li>

                    
                </ul>
            </div>
            {/* Tabs Content */}
            <div className="flex flex-col items-center">
                
                {activeTab === 'All' && (
                    <LearningContent content={content} user={user} />
                )}
                {activeTab === 'learn' && (
                    <></>
                )}

                {activeTab === 'learn2' && (
                    <></>
                )}
            </div>
        </main>
    )
}


export default SlugPage;

SlugPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SlugPage.auth = true;