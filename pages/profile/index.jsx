import { useState, useEffect } from "react";
import Image from "next/image";
import ProgressBar from 'react-bootstrap/ProgressBar';
import CoinPointIcon from "@/resources/icons/CoinPointIcon";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/profile.module.css";
import Loading from "@/components/Loading";
import { AppLayout } from "@/themes";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { BsQrCodeScan } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Profile() {
    const { data: session } = useSession();
    const { data: user } = useSWR('/api/users/'+session?.user?.id, fetcher);
    const { data: level } = useSWR('/api/level/'+session?.user?.id, fetcher);
    const { data: levelup } = useSWR('/api/level/state/'+level?.level, fetcher);
    const nextPoint = (levelup?.requiredPoints - level?.points);
    const percent = (level?.points / levelup?.requiredPoints) * 100;
    const [percentage, setPercentage] = useState(50);
    const HalfCircleProgressBar = dynamic(() => import('@/components/main/HalfCircleProgressBar'), { ssr: false });

    return (
        <> 
        <main className="flex flex-col overflow-x-scroll mt-2 mb-20" style={{
            fontFamily: "ttb"
        }}>

            <div className="flex pl-5 pr-5 pb-5">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-end space-x-3 text-gray-500 text-sm">
                        <IoCreateOutline />
                        <IoMdNotificationsOutline />
                        <BsQrCodeScan />
                    </div>
                    {/* profile card */}
                    <div className="flex flew-row mt-1 w-full">
                        <div className="relative" style={{ width: "50px", height: "50px" }}>
                            <Image
                                src={session?.user?.image}
                                alt="profile"
                                width={200}
                                height={200}
                                className="rounded-full border-2 border-[#0056FF] dark:border-white"
                            />
                        </div>
                        <div className="flex flex-col ml-3 flex-1">
                            <div className="flex flex-row justify-between">
                                <h1 className="text-lg font-black mb-[-5px] text-[#0056FF] dark:text-white">{user?.user?.fullname}</h1>
                                <h1 className="text-lg font-semibold text-[#F2871F]">Level.{level?.level}</h1>
                            </div>
                            <ProgressBar 
                                animated 
                                now={percent} 
                                variant="warning"
                                className="w-[22em] h-2 rounded-3xl"
                            />
                            <div className="flex flex-row justify-end mt-1">
                                <span className="text-sm font-semibold text-[#0056FF] dark:text-white">
                                    Next: {nextPoint} Point
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* End profile card */}
                </div>
            </div>

            <div className="flex flex-col justify-center items-center mt-[-20px]">
                <h1 className="text-xl font-black text-[#0056FF] dark:text-white">ข้อมูลทั้งหมด</h1>
            </div>

            <div className="flex flex-row items-center justify-center w-full">
                    <div className="items-center p-2 ">
                       
                        <button 
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl dark:bg-white dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 110, height: 110 }}
                        >
                            <Image 
                                src="/images/profile/Point.svg"
                                alt="point"
                                width={30}
                                height={30}
                            />
                            <span className="text-sm font-black text-black dark:text-white">
                                Total Point
                            </span>
                            <span className="text-xl font-black text-black dark:text-white">
                                {level?.points ? level?.points : 0}
                            </span>
                        </button>

                        <button 
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold dark:bg-white text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 110, height: 110 }}
                        >
                            <Image 
                                src="/images/profile/Coin.svg"
                                alt="point"
                                width={32}
                                height={32}
                            />
                            <span className="text-sm font-black text-black dark:text-white">
                                Coin
                            </span>
                            <span className="text-xl font-black text-black dark:text-white">
                                0
                            </span>
                        </button>

                    </div>
                </div>

                <div className="relative flex flex-col justify-center items-center">
                    <Link href="/redeem">
                        <button className="w-40 h-10 bg-[#F2871F] text-white rounded-3xl font-semibold text-xl mb-4 mt-3">
                            <span>
                                Redeem
                            </span>
                        </button>
                    </Link>

                    <button className="bg-[#0056FF] text-white rounded-3xl font-semibold text-xl mb-3" style={{
                        width: 320,
                        height: 50
                    }}>
                        <span>
                            ข้อมูลความสุขในการทำงานของคุณ
                        </span>
                    </button>

                </div>

                <div className="relative p-5 mb-3">
                    <HalfCircleProgressBar percentage={percentage} style={{ height: 200 }}/>
                </div>
              
            
        </main>
       
          
        </>
    );
}

Profile.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Profile.auth = true