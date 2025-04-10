import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function NewsPopup({ news, onClose }) {
  const handleLink = async (url) => {
    if (url) {
      try {
        await axios.post("/api/perf360/news/activity", {
          newsId: news._id,
          userId,
          activity: "click",
        });
      } catch (err) {
        console.error("Click tracking error:", err);
      }
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row bg-[#0056FF] text-white items-center p-2 gap-4 w-full justify-between">
        <h2 className="text-lg font-bold">{news.category}</h2>
        <IoClose className="text-lg cursor-pointer" onClick={onClose} />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-bold">{news.title}</h2>
        {news?.image?.url && (
          <div className="flex flex-row gap-4 w-full justify-center p-4">
            <div className="flex w-[300px] h-auto relative">
              <Image
                src={news.image.url}
                alt="news"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        )}
        <div
          className="tiptap w-full"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
      <div className="flex flex-row gap-4 w-full justify-center p-4">
        {news.url && (
          <button
            className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-md"
            onClick={() => handleLink(news.url)}
          >
            ดูรายละเอียด
          </button>
        )}
        <button>
          <button
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-md"
            onClick={onClose}
          >
            ปิดหน้าต่างนี้
          </button>
        </button>
      </div>
    </div>
  );
}
