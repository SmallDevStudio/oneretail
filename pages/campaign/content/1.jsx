import React from "react";
import Image from "next/image";
import { AppLayout } from "@/themes";
import Link from "next/link";
import VoteName from "@/components/campaign/VoteName";
import { useSession } from "next-auth/react";

export default function Campaign1() {
    const { data: session } = useSession();

    return (
        <div className="mb-20">
            <div className="flex justify-center items-center w-full mt-5 mb-3">
                <h1 className="text-3xl font-bold text-[#0056FF] uppercase">Campaign</h1>
            </div>
            <div className="absolute top-0 left-0 mt-5">
                <Link href="/campaign" className="text-white">
                    <div className="flex mb-5 w-5 h-5 text-gray-500 mt-2 ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.31 117.25">
                        <path fill="currentColor" d="M58.62,117.25c-2.74,0-5.47-1.04-7.56-3.13L3.13,66.18c-4.17-4.17-4.17-10.94,0-15.12L51.07,3.13c4.17-4.17,10.94-4.17,15.11,0,4.17,4.17,4.17,10.94,0,15.12L25.8,58.62l40.38,40.38c4.17,4.17,4.17,10.94,0,15.12-2.09,2.09-4.82,3.13-7.56,3.13Z"/>
                    </svg>
                    </div>
                </Link>
            </div>
            <Image
                src="/images/campaign/1.jpg"
                alt="Campaign"
                width={600}
                height={600}
                priority
                className="w-full mb-2"
            />
            <div className="flex flex-col p-5">
                <span className="font-bold text-[#0056FF] text-xl">ประกวดตั้งชื่อมาสคอต</span>
                <p className="text-md">ขอชวนเพื่อนๆ ทุกคนมาช่วยกันตั้งชื่อมาสคอตสุดน่ารักของ One Retail Society ชื่อของใครโดนใจกรรมการ รับรางวัลพิเศษไปเล้ย หมดเขต 20 กรกฎาคมนี้นะ </p>
                <span className="text-md font-bold text-[#0056FF] mt-2">มารู้จักมาสคอตกันก่อน</span>
                <div className="flex flex-row justify-center items-center mt-2">
                    <Image src={"/images/campaign/campaign1.png"} alt="Campaign" width={150} height={150} className="w-full" style={{width: 'auto', height: 'auto'}}/>
                    <span className="text-sm ml-4">น้องเป็นมิตรกับทุกคน เป็นสัญลักษณ์แห่งการเรียนรู้และเติบโต โดยออกแบบให้เป็นคนที่มีผมเหมือนต้นไม้และต้นอ่อนบนหัว เปรียบเหมือนการเรียนรู้ตลอดชีวิต (Lifelong Learning) ที่เริ่มตั้งแต่เด็กจนโต 
                            น้องจะเป็นตัวแทนของการเรียนรู้ การสื่อสารและการมีส่วนร่วมของเราชาว Retail ที่มีความเป็น Trusted Advisor อยู่ในตัวทุกคน 
                    </span>
                </div>
            </div>
            <div className="flex flex-col p-5">
                <h2 className="text-md font-bold text-[#0056FF]">กติการ่วมสนุก</h2>
                <p className="text-sm">ทุกคนสามารถส่งชื่อเข้าประกวด โดย 1 คน มี 1 สิทธิ์ ตั้งชื่อของน้องมาสคอต พร้อมคำอธิบายเหตุผล ได้ที่ด้านล่างนี้เลย </p>
            </div>

            <VoteName userId={session?.user?.id}/>
            
        </div>
    );
}

Campaign1.getLayout = (page) => <AppLayout>{page}</AppLayout>;

Campaign1.auth = true;