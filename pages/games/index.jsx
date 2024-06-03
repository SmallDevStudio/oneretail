import React from "react";
import { AppLayout } from "@/themes";
import Image from "next/image";
import Link from "next/link";

export default function Games() {
    return (
        <>
            <div className="relative p-3 w-full h-full">
                <div className="flex flex-col items-center text-center justify-center p-2 px-1 pz-1">
                    <div className="relative p-3 ">
                        <div className="flex items-center text-center justify-center p-2 px-1 pz-1">
                            <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Games Center</span>
                        </div>
                    </div>
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1 mt-10">
                        <Link href="/games/quiz">
                            <Image 
                                src="/dist/img/banner/quiz_game_banner.jpg" 
                                alt="games" 
                                width={300} 
                                height={300} 
                                className="w-full h-full z-10 rounded-xl shadow-lg"
                                priority
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </>  
    );
}


Games.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
}

Games.auth = true;

