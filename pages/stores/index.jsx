// Stores
import { AppLayout } from "@/themes";
import React, { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player/youtube";
import useSWR from "swr";
import Loading from "@/components/Loading";
import SuccessFeed from "@/components/success/SuccessFeed";
import ShareYourStory from "@/components/success/ShareYourStory";
import SuccessSkeleton from "@/components/SkeletonLoader/SuccessSkeleton";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";
import useUserActivity from "@/lib/hook/useUserActivity"; // Import hook

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Stores() {
  const category = "665c4c51013c2e4b13669c90";
  const [activeTab, setActiveTab] = useState("secret-sauce");
  const [videoUrl, setVideoUrl] = useState("");
  const [contents, setContents] = useState([]);

  const router = useRouter();
  const { tab } = router.query;

  useUserActivity(activeTab); // ใช้ useUserActivity พร้อมกับ activeTab

  const { data: video, error: videoError } = useSWR(
    `/api/content/video?categoryId=${category}`,
    fetcher,
    {
      onSuccess: (data) => {
        setVideoUrl(data?.data?.slug);
      },
    }
  );

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("secret-sauce");
      window.history.pushState(null, "", `?tab=secret-sauce`);
    }
  }, [router.query.tab, tab]);

  const {
    data: contentsData,
    error: contentsError,
    isLoading,
  } = useSWR(`/api/content/category?categoryId=${category}`, fetcher, {
    onSuccess: (data) => {
      setContents(data?.data);
    },
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
  };

  if (!contents || !video) return <Loading />;
  if (contentsError) return <p>Error: {contentsError.message}</p>;
  if (videoError) return <p>Error: {videoError.message}</p>;

  return (
    <div className="flex flex-col bg-gray-10 justify-between items-center text-center">
      <div>
        <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
          <span className="text-[35px] font-black text-[#0056FF] dark:text-white">
            Success
          </span>
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
              href=""
              className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${
                activeTab === "secret-sauce"
                  ? "text-[#0056FF] border-[#F2871F]"
                  : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
              }`}
              onClick={() => handleTabClick("secret-sauce")}
            >
              Secret Sauce
            </a>
          </li>
          <li className="me-2">
            <a
              href=""
              className={`inline-block p-2 border-b-2 rounded-t-lg ml-5 font-bold ${
                activeTab === "share-your-story"
                  ? "text-[#0056FF] border-[#F2871F]"
                  : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
              }`}
              onClick={() => handleTabClick("share-your-story")}
            >
              Share your story
            </a>
          </li>
        </ul>
      </div>

      {/* Search Bar */}
      {activeTab === "secret-sauce" && <SearchBar page={category} />}

      {/* Tabs Content */}
      <div className="flex flex-col items-center w-full">
        {activeTab === "secret-sauce" &&
          (isLoading ? (
            <SuccessSkeleton />
          ) : (
            <SuccessFeed contents={contents} tab={activeTab} />
          ))}
        {activeTab === "share-your-story" && (
          <div className="w-full">
            <ShareYourStory active={activeTab === "share-your-story"} />
          </div>
        )}
      </div>
    </div>
  );
}
