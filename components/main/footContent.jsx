import React, { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FooterContant() {

    const { data, error } = useSWR("/api/contents", fetcher);
    const router = useRouter();

    const handleClick = (categories, id ) => {
        if (categories === "Learning") {
            router.push(`/learning/${id}`);
        } else {
            router.push(`/stores/${id}`);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div className="relative w-full footer-content mt-4">
            <div className="flex flex-col items-start px-2">
                <span className="text-xl text-[#0056FF] font-bold">
                    วีดีโอแนะนำ
                </span>
                <div className="flex flex-row flex-wrap justify-between gap-2">
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
                <div>
                    
                </div>
            </div>
        </div>
    );
}
