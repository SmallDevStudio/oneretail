import React, { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";
import { FaUserPlus, FaRegPlayCircle } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import { LuDot } from "react-icons/lu";

moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FooterContant() {

    const { data, error } = useSWR("/api/contents/list", fetcher);
    const { data: articles, error: articleError } = useSWR("/api/articles/recommend", fetcher);
    const router = useRouter();

    const handleClick = (categories, id ) => {
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
                <span className="text-xl text-[#0056FF] font-bold">
                    วีดีโอแนะนำ
                </span>
                <Divider className="w-full mb-1"/>
                <div className="flex flex-row flex-wrap gap-2">
                    {Array.isArray(data.data) && data.data.map((content, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col bg-gray-200 rounded-lg p-2 mt-2 max-w-[180px] min-w-[150px]"
                            onClick={() => handleClick(content.categories.title, content._id)}
                        >
                            <Image
                                src={content.thumbnailUrl}
                                alt={content.title}
                                width={150}
                                height={100}
                                loading="lazy"
                                style={{
                                    width: "auto",
                                    height: "90px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                            <div className="flex flex-col mt-2 text-left line-clamp-2">
                                <p className="flex text-xs text-[#0056FF] font-bold line-clamp-2">
                                    {content.title}
                                </p>
                            </div>
                            <div className="flex flex-row justify-between mt-2">
                                <span 
                                    className={`text-[9px] px-2 rounded-2xl text-white font-bold
                                    ${content.categories.title === "Learning"? "bg-[#0056FF]" : "bg-[#F2871F]"}`
                                    }>
                                    {content.categories.title}
                                </span>

                                {content.pinned && (
                                    
                                    <LuDot 
                                        className="text-[#F2871F] font-bold"
                                    />
                                    
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {articles.data.length > 0 && (
                <div className="flex flex-col items-start px-2 mt-4">
                    <span className="text-xl text-[#0056FF] font-bold">
                        บทความแนะนำ
                    </span>
                    <Divider className="w-full mb-1"/>
                    <div className="flex flex-row flex-wrap justify-between gap-1 px-1">
                    {Array.isArray(articles.data) && articles.data.map((article, index) => (
                        <div 
                        key={index} 
                        className="flex flex-col bg-gray-200 rounded-lg p-2 mt-2 max-w-[180px] min-w-[150px]"
                        onClick={() => router.push(`/articles/${article._id}`)}
                    >
                        {article.thumbnail ? (
                            <Image
                            src={article.thumbnail.url}
                            alt={article.title}
                            width={150}
                            height={100}
                            loading="lazy"
                            className="rounded-xl"
                            style={{
                                width: "auto",
                                height: "90px",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                        ): (
                            article.medias.length > 0 && (
                                article.medias[0].type === 'image' ? (
                                    <Image
                                        src={article.medias[0].url}
                                        alt={article.title}
                                        width={150}
                                        height={100}
                                        loading="lazy"
                                        className="rounded-xl"
                                        style={{
                                            width: "auto",
                                            height: "90px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}
                                    />
                                ) : (
                                    <div className="relative">
                                        <video width="150" height="90" controls style={{
                                            width: "auto",
                                            height: "90px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}>
                                            <source src={article.medias[0].url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                        </video>
                                            <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-3xl" />
                                    </div>
                                )
                            )
                        )}
                        <div className="flex flex-col mt-2 text-left line-clamp-2">
                            <p className="flex text-xs text-[#0056FF] font-bold line-clamp-2">
                                {article.title}
                            </p>
                        </div>
                        <div className="flex flex-row mt-2">
                            <span 
                                className={`text-[9px] px-2 rounded-2xl text-white font-bold`}>
                            </span>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}
