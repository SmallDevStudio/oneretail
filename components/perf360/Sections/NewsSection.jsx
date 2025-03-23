import React, { useState } from "react";
import moment from "moment";
import Image from "next/image";
import { Divider, Slide, Dialog } from "@mui/material";
import NewsPopup from "./NewsPopup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewsSection({ data }) {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeTab, setActiveTab] = useState(Object.keys(data)[0] || "News");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLink = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleOpenPopup = (news) => {
    setSelectedNews(news);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedNews(null);
    setOpenPopup(false);
  };

  const handleClick = (news) => {
    console.log("news", news);
    if (news.display === "popup") {
      handleOpenPopup(news);
    } else {
      handleLink(news.url);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 w-full">
      {/* Header */}
      <div className="flex flex-col bg-gray-200 rounded-t-lg px-4 py-2 shadow-sm w-full">
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="w-[60px] h-[60px] relative">
            <Image src="/dist/img/mic.png" alt="News" width={60} height={60} />
          </div>
          <h2 className="text-xl font-bold">Incentive Communication</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 justify-around items-center px-2 py-2 gap-1">
        {Object.keys(data).map((tab) => (
          <button
            key={tab}
            className={`text-md px-6 py-2 rounded-t-lg border-b-8 font-semibold ${
              activeTab === tab
                ? "bg-[#0056FF]/50 border-[#0056FF] text-white font-bold"
                : "bg-gray-200 border-gray-400 text-gray-400"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* News Items */}
      <div className="flex flex-col gap-2 mt-2">
        <h3 className="font-bold text-md px-2 text-center mb-2">
          ข่าวสารเกี่ยวกับ {activeTab}
        </h3>
        {data[activeTab]?.map((item) => (
          <div
            key={item._id}
            className="flex flex-col bg-gray-100 rounded-lg px-4 py-2 shadow"
            onClick={() => handleClick(item)}
          >
            <p className="font-semibold">{item.title}</p>
            <div
              className="tiptap w-full line-clamp-3 text-gray-500"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <div className="text-xs text-gray-500 mt-2">
              Date: {moment(item.start_date).format("DD/MM/YYYY")} | View:{" "}
              {item.views?.length || 0} | Comment: {item.Comment?.length || 0}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={openPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosePopup}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "100vw",
            maxWidth: "95vw", // ป้องกันไม่ให้มันจำกัดความกว้าง
            margin: 0,
            padding: 0,
            borderRadius: 2,
          },
        }}
      >
        {selectedNews && (
          <NewsPopup news={selectedNews} onClose={handleClosePopup} />
        )}
      </Dialog>
    </div>
  );
}
