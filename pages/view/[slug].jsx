"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import axios from "axios";
import Loading from "@/components/Loading";
import ShareYourStory from "@/components/ShareYourStory";
import SecretSauce from "@/components/success/SecretSauce";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const SlugPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("secret-sauce");
    const { data: session } = useSession();
    const userId = session?.user?.id;
    
    const { data, error: swrError } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
        onSuccess: (data) => {
          setUser(data.user);
        },
      });

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
                    <SecretSauce content={content} user={user} />
                )}
                {activeTab === 'share-your-story' && (
                    <ShareYourStory />
                )}
            </div>
        </main>
    )
}


export default SlugPage;

SlugPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SlugPage.auth = true;