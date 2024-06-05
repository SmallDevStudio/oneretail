import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GrLike } from "react-icons/gr";
import { LuMessageCircle } from "react-icons/lu";
import { Suspense } from "react";
import LoadingFeed from "@/components/LoadingFeed";

const Feed = () => {

    const [contents, setContents] = useState([]);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        const res = await fetch('/api/contents');
        const data = await res.json();
        setContents(data);
    }

    return (
        <div className="flex flex-col w-full mb-20">
    {contents &&
        contents.map((contents, i) => (
        <>
            <Suspense fallback={<LoadingFeed />}>
                <div className="flex flex-row bg-gray-200 m-2 rounded-md p-2">
                    <Link href={{
                                pathname: '/stores/view/[slug]',
                                query: { slug: contents.slug },
                            }}>
                        <div className="flex w-[150px]" key={i}>
                            <Image
                                src={contents.thumbnailUrl}
                                alt="Avatar"
                                width={150}
                                height={150}
                                className="rounded-lg"
                            />
                        </div>
                    </Link>
                    
                    <Link href={{
                        pathname: '/stores/view/[slug]',
                        query: { slug: contents.slug },
                    }}>
                    <div className="flex flex-col w-full text-left ml-2">
                        <div>
                            <span className="inline-block text-sm font-bold text-[#0056FF]">{contents.title}</span>
                        </div>
                        <div className="mr-2">
                            <span className="font-light text-black leading-tight inline-block min-h-[55px]" style={{
                                fontSize: "11px"
                            }}>
                                {contents.description}
                            </span>
                        </div>

                        <div className="flex flex-row justify-end mt-2 mr-4 space-x-5">
                            <div className="flex flex-row items-center">
                                <span className="font-light text-black" style={{
                                        fontSize: "12px"
                                    }}>การดู {contents.views} ครั้ง
                                </span>
                            </div>
                            <div className="flex flex-row items-center">
                                <GrLike className="mr-1" />
                                <span className="text-xs">{contents.like}</span>
                            </div>
                            <div className="flex flex-row items-center">
                                <LuMessageCircle className="mr-1" />
                                <span className="text-xs">{contents.comment ? contents.comment.length : 0}</span>
                            </div>
                        </div>
                    </div>
                    </Link>
                </div>
            </Suspense>
        </>
        ))}
        </div>
    )
}

export default Feed;