import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import Qrcode from "@/components/forms/Qrcode";
import { Dialog, Slide, Divider } from "@mui/material";
import { FaShareFromSquare } from "react-icons/fa6";

const SuccessFeed = ({ contents, tab }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { group } = router.query;

  // Get unique group names and add "NewFeed"
  const groups = [
    "NewFeed",
    ...new Set(
      contents
        .map((content) =>
          content.groups && content.groups.name ? content.groups.name : null
        )
        .filter(Boolean)
    ),
  ];

  // Set default selectedGroup to "NewFeed"
  const [selectedGroup, setSelectedGroup] = useState("NewFeed");
  const [selectedSubGroup, setSelectedSubGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [openShare, setOpenShare] = useState(false);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // Treat "NewFeed" like "All"
    const isNewsFeed = selectedGroup === "NewFeed";

    const filteredContents = isNewsFeed
      ? contents
      : contents.filter(
          (content) => content.groups && content.groups.name === selectedGroup
        );

    const uniqueSubGroups = [
      ...new Set(
        filteredContents
          .map((content) =>
            content.subgroups && content.subgroups.name
              ? content.subgroups.name
              : null
          )
          .filter(Boolean)
      ),
    ];
    setSubGroups(uniqueSubGroups);

    if (filteredContents.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredContents.length);
      setVideoUrl(filteredContents[randomIndex].slug);
    } else {
      setVideoUrl(null);
    }
  }, [selectedGroup, contents]);

  useEffect(() => {
    if (group) {
      setSelectedGroup(group);
    } else {
      setSelectedGroup("NewFeed");
      window.history.pushState(null, "", `?tab=${tab}&group=NewFeed`);
    }
  }, [group, tab]);

  const filteredContents = contents.filter(
    (content) =>
      // Treat "NewFeed" like "All"
      (selectedGroup === "NewFeed" ||
        (content.groups && content.groups.name === selectedGroup)) &&
      (!selectedSubGroup ||
        (Array.isArray(content.subgroups)
          ? content.subgroups.some(
              (subgroup) => subgroup.name === selectedSubGroup
            )
          : content.subgroups && content.subgroups.name === selectedSubGroup))
  );

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedSubGroup(null);
    window.history.pushState(null, "", `?tab=${tab}&group=${group}`);
  };

  const handleOpenShare = (group) => {
    const url = `${window.location.origin}/learning/?tab=${tab}&group=${group}`;
    setUrl(url);
    setOpenShare(!openShare);
  };

  const handleCloseShare = () => {
    setOpenShare(!openShare);
    setUrl(null);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative">
        <ul
          className="flex flex-row w-full rounded-xl p-1 gap-5 overflow-x-auto overflow-hidden text-sm mb-2 scrollbar-hide px-6"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {groups.map((group) => (
            <li
              key={group}
              className={`cursor-pointer px-2 py-1 rounded-xl text-nowrap font-bold ${
                selectedGroup === group
                  ? "bg-[#0056FF] text-white"
                  : "bg-[#0056FF]/20 text-black"
              }`}
              onClick={() => handleSelectGroup(group)}
            >
              {group}
            </li>
          ))}
        </ul>
        <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white"></div>
      </div>
      {selectedGroup !== "NewFeed" && subGroups.length > 0 && (
        <div className="flex px-5 justify-center w-full">
          <select
            name="subgroup"
            id="subgroup"
            className="w-1/2 rounded-xl p-0.5 text-black mb-2 border text-xs font-semibold bg-gray-200"
            onChange={(e) => {
              setSelectedSubGroup(e.target.value);
            }}
            value={selectedSubGroup || ""}
          >
            <option value="">All Subgroups</option>
            {subGroups.map((subgroup) => (
              <option key={subgroup} value={subgroup}>
                {subgroup}
              </option>
            ))}
          </select>
          <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white"></div>
        </div>
      )}
      {videoUrl && (
        <div className="justify-center flex min-w-[100vw]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoUrl}`}
            loop={true}
            width="100%"
            height="250px"
            playing={true}
            controls
          />
        </div>
      )}
      <div className="flex flex-col w-full mb-20 p-2">
        {/* Share */}
        <div className="flex justify-start items-center gap-2 mb-2">
          <h2 className="text-lg font-bold text-[#0056FF]">{selectedGroup}</h2>
          <FaShareFromSquare
            className="text-lg cursor-pointer text-gray-500"
            onClick={() => handleOpenShare(selectedGroup)}
          />
        </div>
        {filteredContents.map((content) => {
          const hasViewed = content.contentviews.some(
            (view) => view.userId === session?.user?.id
          );
          return (
            <div
              key={content._id}
              className="flex flex-row bg-gray-200 mb-2 rounded-md p-2"
            >
              {/* thumbnail */}
              <div className="flex flex-col justify-center items-center max-h-[150px] min-w-[150px]">
                <Link href={`/stores/${content._id}`}>
                  <Image
                    src={content.thumbnailUrl}
                    alt="Avatar"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                    style={{ width: "auto", height: "auto" }}
                    loading="lazy"
                  />
                </Link>
              </div>
              {/* content */}
              <div className="flex flex-col text-left ml-2">
                {/* title and description */}
                <div className="flex flex-col max-w-[200px] w-[200px]">
                  <Link href={`/learning/${content._id}`}>
                    <p className="text-sm font-bold text-[#0056FF] line-clamp-2">
                      {content.title}
                    </p>
                    <p className="text-xs font-light text-black line-clamp-2">
                      {content.description}
                    </p>
                  </Link>
                </div>
                {/* icon container */}
                <div className="flex flex-row justify-between items-center mt-auto pt-2">
                  <span className="font-light text-black text-xs">
                    การดู {content.views} ครั้ง
                  </span>
                  {hasViewed && (
                    <span className="bg-green-500 font-bold text-xs text-white rounded-full px-2">
                      ดูแล้ว
                    </span>
                  )}
                </div>
              </div>
              {/* end content */}
            </div>
          );
        })}
      </div>
      {openShare && (
        <Qrcode
          open={openShare}
          onClose={handleCloseShare}
          url={url}
          title="แชร์คอนเทนต์"
        />
      )}
    </div>
  );
};

export default SuccessFeed;
