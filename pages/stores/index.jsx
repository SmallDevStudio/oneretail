import { AppLayout } from "@/themes";
import React from "react";
import YouTube from "react-youtube";
import Link from "next/link";
export default function Stores() {
    const opts = {
        height: "250px",
        width: "100%",
        playerVars: {
            autoplay: 1,
            loop: 1,
            autohide: 1,
            modestbranding: 1,
            controls: 0,
            showinfo: 0,
        },
    };

    return (
        <main className="flex flex-col dark:bg-gray-900">
        
            <div className="relative p-3top-[-40px]">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Success</span>
                    <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">
                        Story
                    </span>
                </div>
            </div>
            <div className="flex flex-row justify-between w-[100vw] px-20 font-bold">
                <span>Secret Sauce</span>
                <span>Share your story</span>
            </div>

            <div className="flex flex-col justify-center items-center w-[100vw] p-2">
                <div className="flex flex-col w-[100vw]">
                    <div className="relative w-full justify-center items-center">
                        <YouTube videoId="PjLrrwuGYoU" opts={opts} />
                    </div>
                        
                </div>
            </div>
        </main>
    )
}

Stores.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Stores.auth = true;