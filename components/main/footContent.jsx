import React, { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";

moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FooterContant() {

    const { data, error } = useSWR("/api/contents", fetcher);
    const { data: article, error: articleError } = useSWR("/api/articles/main", fetcher);
    const router = useRouter();

    console.log(article);

    const handleClick = (categories, id ) => {
        if (categories === "Learning") {
            router.push(`/learning/${id}`);
        } else {
            router.push(`/stores/${id}`);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!data || !article) return <div>Loading...</div>;

    return (
        <div className="relative w-full footer-content mt-4">
            <div className="flex flex-col items-start px-2">
                <span className="text-xl text-[#0056FF] font-bold">
                    วีดีโอแนะนำ
                </span>
                <div className="flex flex-row flex-wrap justify-evenly gap-2">
                    {Array.isArray(data) && data.map((content, index) => (
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
                            <div className="flex flex-row mt-2">
                                <span 
                                    className={`text-[9px] px-2 rounded-2xl text-white font-bold
                                    ${content.categories.title === "Learning"? "bg-[#0056FF]" : "bg-[#F2871F]"}`
                                    }>
                                    {content.categories.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-start px-4 mt-4">
                <span className="text-xl text-[#0056FF] font-bold">
                    บทความแนะนำ
                </span>

                <div className="flex bg-gray-200 rounded-lg p-2 mt-2 w-full">
                    {Array.isArray(article.data) && article.data.map((article, index) => (
                        <div key={index} 
                            className="flex flex-col items-center w-full mb-2 divide-y divide-gray-700"
                            onClick={() => router.push(`/article/${article._id}`)}
                        >
                            <div className="flex flex-row justify-between items-center p-1 w-full">
                            <p className="flex text-sm text-[#0056FF] font-bold line-clamp-2">
                                {article.title}
                            </p>
                            <p className="flex text-xs text-gray-400">
                                {article.updatedAt && moment(article.updatedAt).fromNow()}
                            </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
