import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GrLike } from "react-icons/gr";
import { LuMessageCircle } from "react-icons/lu";
import { Suspense } from "react";
import LoadingFeed from "@/components/LoadingFeed";

const SuccessFeed = ({ contents }) => {

    return (
        <div className="flex flex-col w-full mb-20">
    {contents.map(content => (
        <>
            <Suspense fallback={<LoadingFeed />}>
                <div className="flex flex-row bg-gray-200 m-2 rounded-md p-2">
                    <Link href={`/stores/${content._id}`}>
                        <div className="flex min-h-[120px] min-w-[120px]">
                            <Image
                                src={content.thumbnailUrl}
                                alt="Avatar"
                                width={150}
                                height={150}
                                className="rounded-lg"
                                style={{
                                    objectFit: "cover",
                                    width: "auto",
                                    height: "auto",
                                }}
                            />
                        </div>
                    </Link>
                    
                    
                    <div className="flex flex-col w-full text-left ml-2">
                    <Link href={`/stores/${content._id}`}>
                        <div>
                            <span className="inline-block text-sm font-bold text-[#0056FF]">{content.title}</span>
                        </div>
                        <div className="mr-2">
                            <span className="font-light text-black leading-tight inline-block min-h-[55px]" style={{
                                fontSize: "11px"
                            }}>
                                {content.description}
                            </span>
                        </div>
                        </Link>

                        <div className="flex flex-row justify-between space-x-5">
                            <div className="flex flex-row items-center">
                                <span className="font-light text-black" style={{
                                        fontSize: "12px"
                                    }}>การดู {content.views} ครั้ง
                                </span>
                            </div>
                            <div className="flex flex-row items-center">
                                <GrLike className="mr-1" />
                                <span className="text-xs">{content.like}</span>
                            </div>
                            <div className="flex flex-row items-center">
                                <LuMessageCircle className="mr-1" />
                                <span className="text-xs">{content.comment ? content.comment.length : 0}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </Suspense>
        </>
        ))}
        </div>
    )
}

export default SuccessFeed;