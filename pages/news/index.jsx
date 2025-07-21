import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { Divider } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

moment.locale("th");

export default function NewsPage() {
  const [newsData, setNewsData] = useState({});
  const [activeTab, setActiveTab] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("/api/news");
        const data = res.data.data;
        setNewsData(data);
        const defaultTab = Object.keys(data)[0];
        setActiveTab(defaultTab);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-[#0056FF] p-5 min-h-screen">
      {/* Header */}
      <div className="text-[#F2871F] text-5xl font-black flex justify-center p-4 mb-2">
        News
      </div>

      {/* Tabs */}
      <div>
        <ul className="flex items-center gap-2 overflow-x-auto">
          {Object.keys(newsData).map((tab) => (
            <li
              key={tab}
              className={`px-4 py-1 cursor-pointer rounded-t-lg ${
                activeTab === tab
                  ? "bg-white text-[#0056FF] font-bold"
                  : "bg-gray-100 border-b border-gray-300 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl min-h-[70vh] p-4">
        {newsData[activeTab]?.map((groupObj, idx) => {
          const groupName = Object.keys(groupObj)[0];
          const groupNews = groupObj[groupName];

          return (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-bold text-[#0056FF] mb-2">
                {groupName}
              </h2>

              <div className="flex flex-col gap-4">
                {groupNews.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-3 shadow-md bg-white"
                    onClick={() => router.push(`/news/${item._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      {/* รูปปก */}
                      <Image
                        src={item?.cover?.url || "/images/news/sample.jpg"}
                        alt={item.title}
                        width={200}
                        height={200}
                        className="rounded-md object-cover w-[120px] max-h-[80px]"
                        onClick={() => router.push(`/news/${item._id}`)}
                      />

                      {/* หัวข้อและเนื้อหา */}
                      <div className="">
                        <h3
                          className="text-md font-semibold text-[#0056FF]"
                          onClick={() => router.push(`/news/${item._id}`)}
                        >
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          วันที่เผยแพร่: {moment(item.createdAt).format("ll")}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {item.content}
                        </p>
                      </div>
                    </div>
                    <Divider sx={{ my: 1 }} />
                    {/* Toolbox */}
                    <div className="flex items-center justify-end gap-4 px-4">
                      <div className="flex items-center gap-1">
                        <AiOutlineHeart />
                        <span className="text-xs">{item.likeCount}</span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <svg
                          className="w-3 h-3"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 277.04 277.04"
                        >
                          <path
                            fill="currentColor"
                            d="M138.52,277.04c-24.29,0-48.18-6.38-69.11-18.45-.2-.12-.4-.23-.6-.35-.12.04-.25.08-.37.12l-32.61,10.87c-.08.03-.15.05-.23.08-8.66,2.89-13.89,4.63-19.67,2.57-5.05-1.8-8.98-5.73-10.78-10.78-2.06-5.77-.33-10.98,2.54-19.59.01-.04.02-.07.03-.1l10.92-32.76c.03-.08.05-.15.08-.23.02-.06.04-.13.06-.19-.1-.18-.21-.36-.31-.53C6.38,186.71,0,162.81,0,138.52,0,62.14,62.14,0,138.52,0s138.52,62.14,138.52,138.52-62.14,138.52-138.52,138.52ZM25.64,256.03h0s0,0,0,0ZM69.24,236.54c1.58,0,3.13.21,4.71.65,2.17.6,3.83,1.55,6.13,2.88,17.69,10.2,37.9,15.59,58.44,15.59,64.59,0,117.14-52.55,117.14-117.14S203.11,21.38,138.52,21.38,21.38,73.93,21.38,138.52c0,20.54,5.39,40.75,15.59,58.43,1.35,2.33,2.29,3.97,2.89,6.14.55,1.97.74,3.92.6,5.96-.15,2.25-.75,4.03-1.5,6.29-.03.08-.06.16-.08.24l-10.85,32.54s-.02.07-.03.09c-.14.41-.27.82-.41,1.24.36-.12.71-.24,1.07-.36.07-.03.15-.05.22-.08l32.8-10.93c2.26-.76,4.06-1.35,6.32-1.51.42-.03.83-.04,1.24-.04Z"
                          />
                          <path
                            fill="currentColor"
                            d="M196.75,109.47h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"
                          />
                          <path
                            fill="currentColor"
                            d="M196.75,149.21h-113.16c-5.9,0-10.69-4.79-10.69-10.69s4.79-10.69,10.69-10.69h113.16c5.9,0,10.69,4.79,10.69,10.69s-4.78,10.69-10.69,10.69Z"
                          />
                          <path
                            fill="currentColor"
                            d="M150.02,188.95h-66.43c-5.9,0-10.69-4.79-10.69-10.69s4.78-10.69,10.69-10.69h66.43c5.9,0,10.69,4.79,10.69,10.69s-4.79,10.69-10.69,10.69Z"
                          />
                        </svg>
                        <span className="text-xs cursor-pointer">
                          {item.commentCount}
                        </span>
                      </div>
                    </div>
                    {/* end panel */}
                  </div>
                ))}
              </div>

              {idx < newsData[activeTab].length - 1 && (
                <Divider className="my-6" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
