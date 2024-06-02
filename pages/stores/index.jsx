import { AppLayout } from "@/themes";
import React from "react";
import ReactPlayer from "react-player/youtube";
import Feed from "@/components/success/feed";
import Link from "next/link";
export default function Stores() {

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
            <div className="flex text-sm font-medium text-center items-center justify-center text-gray-500 border-b border-gray-200" >
            <ul class="flex flex-wrap -mb-px">
                <li class="me-2">
                    <a href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-[#0056FF] hover:border-[#F2871F] font-bold">
                        Secret Sauce
                    </a>
                </li>
                <li class="me-2">
                    <a href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-[#0056FF] hover:border-[#F2871F] font-bold">
                        Share your story
                    </a>
                </li>
            </ul>
            </div>

            <div className="flex flex-col justify-center items-center w-[100vw] p-2">
                <div className="flex flex-col w-[100vw]">
                    <div className="relative justify-center items-center">
                       <ReactPlayer url="https://www.youtube.com/watch?v=nrBdA4mNJpQ" loop={true} width={430} height={250} playing={true}/>
                    </div>

                    <div className="relative w-full justify-center items-center mt-2">
                        <Feed />
                    </div>
                        
                </div>
            </div>
        </main>
    )
}

Stores.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Stores.auth = true;