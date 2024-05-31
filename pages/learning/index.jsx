import React from "react";
import YouTube from "react-youtube";
import { AppLayout } from "@/themes";
export default function Learning() {
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
            <div className="flex items-center text-center justify-center mt-5">
                <div className="flex items-center text-center justify-center p-2 px-1 pz-1">
                    <h1 className="text-[35px] font-black text-[#0056FF]" style={{ fontFamily: "Ekachon", fontSmoothing: "auto", fontWeight: "black" }}>Learning</h1>
                </div>
            </div>
            <div className="flex flex-row justify-between w-[100vw] px-10 font-bold">
                <span>ทั้งหมด</span>
                <span>เรื่องน่าเรียน</span>
                <span>เรื่องน่ารู้</span>
            </div>

            <div className="flex flex-col justify-center items-center w-[100vw] p-2">
                <div className="flex flex-col w-[100vw]">
                    <div className="relative w-full justify-center items-center">
                        <YouTube videoId="YzEGodXLdxA" opts={opts} />
                    </div>
                        
                </div>
            </div>
            
        </main>
    )
}

Learning.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Learning.auth = true;