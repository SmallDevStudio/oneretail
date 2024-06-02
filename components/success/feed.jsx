import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GrLike } from "react-icons/gr";
import { LuMessageCircle } from "react-icons/lu";

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
        <>
    {contents &&
        contents.map((contents, i) => (
        <>
        <div className="flex flex-row bg-gray-200 m-3 rounded-md p-2">
            <div className="flex flex-row ">
                <div className="relative w-5/6">
                    <Image
                        src={contents.thumbnailUrl}
                        alt="Avatar"
                        width={150}
                        height={150}
                        className="rounded-md"
                    />
                </div>
        
                <div className="flex flex-col ml-2">
                    <div className="flex flex-col" key={i}>
                        <span className="text-md font-bold text-[#0056FF] inline">{contents.title}</span>
                        <span className="font-light text-black leading-tight inline-block" style={{
                            fontSize: "10px"
                        }}>
                            {contents.description}
                        </span>
                    </div>

                        <div className="ralative flex flex-row gap-10 px-2 items-end w-full mt-2">
                            <div className="flex ml-2">
                                <span className="font-light text-black" style={{
                                    fontSize: "10px"
                                }}>การดู 300 ครั้ง</span>
                            </div>
                            
                            <div className="flex ml-2">
                                <GrLike />
                                <span className="font-light text-black ml-1" style={{
                                    fontSize: "10px"
                                }}>
                                   2
                                </span>
                            </div>

                            <div className="flex ml-2">
                                <LuMessageCircle />
                                <span className="font-light text-black ml-1" style={{
                                    fontSize: "10px"
                                }}>
                                     2
                                </span>
                            </div>
                    </div>
                </div>
              
            </div>
        </div>
        </>
        ))}
        </>
    )
}

export default Feed;