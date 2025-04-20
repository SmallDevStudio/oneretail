import React, { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";
import { FaUserPlus, FaRegPlayCircle } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import { LuDot } from "react-icons/lu";

moment.locale("th");

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FooterContant() {
  const { data, error } = useSWR("/api/contents/list", fetcher);
  const { data: articles, error: articleError } = useSWR(
    "/api/articles/recommend",
    fetcher
  );
  const router = useRouter();

  const handleClick = (categories, id) => {
    if (categories === "Learning") {
      router.push(`/learning/${id}`);
    } else {
      router.push(`/stores/${id}`);
    }
  };

  if (error || articleError) return <div>Failed to load</div>;
  if (!data || !articles) return <div>Loading...</div>;

  return (
    <div className="relative w-full footer-content mt-4">
      <div className="flex flex-col items-start px-2">
        <span className="text-xl text-[#0056FF] font-bold">วีดีโอแนะนำ</span>
        <Divider className="w-full mb-1" />
        <div className="flex w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.isArray(data.data) &&
              data.data.map((item, index) => {
                const isVideo = item?.medias?.[0]?.type === "video";
                const imageUrl =
                  item?.thumbnail?.url ||
                  item?.thumbnailUrl ||
                  (item?.medias?.[0]?.url ?? "/placeholder.jpg");

                return (
                  <div
                    key={index}
                    onClick={() =>
                      handleClick(
                        item.categories?.title || "learning",
                        item._id
                      )
                    }
                    className="bg-gray-100 rounded-lg overflow-hidden shadow-sm flex flex-col h-[200px] cursor-pointer"
                  >
                    {/* IMAGE/VIDEO THUMBNAIL */}
                    <div className="flex relative w-full h-[100px] bg-white">
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        width={700}
                        height={700}
                        className="object-cover"
                      />
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FaRegPlayCircle className="text-white text-3xl drop-shadow" />
                        </div>
                      )}
                    </div>

                    {/* TEXT + TAG */}
                    <div className="p-2 flex flex-col justify-between flex-1">
                      <p className="text-sm text-[#0056FF] font-semibold line-clamp-3 leading-tight text-left">
                        {item.title}
                      </p>

                      <div className="flex justify-between items-end mt-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold
                        ${
                          item?.categories?.title === "Learning"
                            ? "bg-[#0056FF]"
                            : "bg-[#F2871F]"
                        }`}
                        >
                          {item?.categories?.title || "บทความ"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {articles.data.length > 0 && (
        <div className="flex flex-col items-start px-2 mt-4">
          <span className="text-xl text-[#0056FF] font-bold">บทความแนะนำ</span>
          <Divider className="w-full mb-1" />
          <div className="flex items-center justify-center w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.isArray(articles.data) &&
                articles.data.map((item, index) => {
                  const isVideo = item?.medias?.[0]?.type === "video";
                  const imageUrl =
                    item?.thumbnail?.url ||
                    item?.thumbnailUrl ||
                    (item?.medias?.[0]?.url ?? "/placeholder.jpg");

                  return (
                    <div
                      key={index}
                      onClick={() => router.push(`/articles/${item._id}`)}
                      className="bg-gray-100 rounded-lg overflow-hidden shadow-sm flex flex-col h-[200px] cursor-pointer"
                    >
                      {/* IMAGE/VIDEO THUMBNAIL */}
                      <div className="flex relative w-full h-[100px] bg-white">
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          width={700}
                          height={700}
                          className="object-cover"
                        />
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaRegPlayCircle className="text-white text-3xl drop-shadow" />
                          </div>
                        )}
                      </div>

                      {/* TEXT + TAG */}
                      <div className="p-2 flex flex-col justify-between flex-1">
                        <p className="text-sm text-[#0056FF] font-semibold line-clamp-3 leading-tight text-left">
                          {item.title}
                        </p>

                        <div className="flex justify-between items-end mt-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold
                            ${
                              item?.categories?.title === "Learning"
                                ? "bg-[#0056FF]"
                                : "bg-[#F2871F]"
                            }`}
                          >
                            {item?.categories?.title || "บทความ"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
