import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


export default function Login() {
 
    return (
        <div className="releative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center justify-center w-full">
                <Image
                    src="/dist/img/logo-one-retail.png"
                    alt="One Retail Logo"
                    width={200}
                    height={200}
                    className="inline"
                    priority
                    style={{
                        width: "auto",
                        height: "auto",
                    }}
                />

                <div className="flex flex-col justify-center mt-5">
                    <span className="text-xl font-bold">พบกัน วันที่ 1 กรกฎาคม 2567</span>
                    <Link href="https://lin.ee/SFfMbhs" target="_blank" className="flex flex-col w-full justify-center items-center mt-2">
                    <span className="font-bold mb-1">ติดตามข่าวสารเพิ่มเติม</span>
                    <div className=" bg-[#06C755] p-1 rounded-full text-white font-bold ml-2 w-20"><span>Line</span></div>
                    </Link>
                </div>
            </div>
        </div>
    );
}