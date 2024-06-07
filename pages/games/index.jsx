import React, { useEffect} from "react";
import { AppLayout } from "@/themes";
import Image from "next/image";
import Link from "next/link";

export default function Games() {
    return (
        <>
            <div className="relative p-3 w-full h-full mb-20">
                <div className="flex flex-col items-center text-center justify-center p-2 px-1 pz-1">
                    <div className="relative p-3 ">
                        <div className="flex items-center text-center justify-center p-2 px-1 pz-1">
                            <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Games Center</span>
                        </div>
                    </div>
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1 mt-5">
                        <Link href="/games/quiz">
                            <Image 
                                src={'/images/gamecenter/Asset 25.svg' }
                                alt="games" 
                                width={300} 
                                height={300} 
                                className="relative w-full h-full"
                                priority
                            />
                            <div style={{
                                position: "absolute",
                                top: "35%",
                                left: "20%",
                                zIndex: "1",

                            }} > 
                                <span className="text-xl font-black text-white">
                                    ตอบคำถามรับพอยท์ประจำวัน
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1 mt-3">
                        <Link href="#">
                            <Image 
                                src={'/images/gamecenter/Asset 24.svg'}
                                alt="games" 
                                width={300} 
                                height={300} 
                                className="relative w-full h-full"
                                priority
                            />
                            <div style={{
                                position: "absolute",
                                top: "62%",
                                left: "37%",
                                zIndex: "1",

                            }} > 
                                <span className="text-xl font-black text-white">
                                    จับคู่รับพอยท์ 
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1 mt-3">
                        <Link href="#">
                            <Image 
                                src={'/images/gamecenter/Asset 23.svg'} 
                                alt="games" 
                                width={300} 
                                height={300} 
                                className="relative w-full h-full"
                                priority
                            />
                            <div style={{
                                position: "absolute",
                                top: "90%",
                                left: "45%",
                                zIndex: "1",

                            }} > 
                                <span className="text-xl font-black text-white">
                                    เร็วๆนี้ 
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>  
    );
}

Games.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Games.auth = true;

