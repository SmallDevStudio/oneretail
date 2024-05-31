import { useState, useEffect } from "react";
import Image from "next/image";
import ProgressBar from 'react-bootstrap/ProgressBar';
import AppMenu from "@/components/menu/AppMenu";
import CoinPointIcon from "@/resources/icons/CoinPointIcon";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import RequireAuth from "@/components/RequireAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/profile.module.css";
import Loading from "@/components/Loading";

export default function Profile() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const [Loading, setLoading] = useState(false);

    console.log('session:', session);
    console.log('profile:', profile);

    useEffect(() => {
        setLoading(true);
        if (session) {
            const userId = session.user.id;
            const fetchUser = async () => {
                const res = await fetch(`/api/users/${userId}`);
                if (!res) {
                    return;
                }
                const data = await res.json();
                setProfile(data);
                setLoading(false);
            };
            fetchUser();
        }
    }, []);


    return (
        <>
        <main className="flex flex-col w-[100vw] overflow-x-scroll dark:bg-gray-900 mt-5" style={{
            fontFamily: "ttb"
        }}>

            <div className="flex pl-5 pr-5 pb-5 w-[100vw]">
                <div className="flex flex-col">
                    {/* profile card */}
                    <div className="flex flew-row mt-1 w-full">
                        <div className="items-center justify-center flex flex-1">
                            <Image
                                src={session?.user?.image}
                                alt="profile"
                                width={80}
                                height={80}
                                className="rounded-full border-3 border-[#0056FF] dark:border-white"
                            />
                        </div>
                        <div className="flex flex-col ml-3 flex-1">
                            <div className="flex flex-row justify-between">
                                <h1 className="text-lg font-black mb-[-5px] text-[#0056FF] dark:text-white">{profile.user.fullname}</h1>
                                <h1 className="text-lg font-semibold text-[#F2871F]">Level.1</h1>
                            </div>
                            <ProgressBar 
                                animated 
                                now={10} 
                                variant="warning"
                                className="w-[290px] h-2 rounded-3xl"
                            />
                            <div className="flex flex-row justify-end mt-1">
                                <span className="text-sm font-semibold text-[#0056FF] dark:text-white">
                                    Next: 60 Point
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
                            <CoinPointIcon 
                                className="w-10 h-10 mb-1 mt-1"
                            />
                            <span className="text-sm font-black text-black dark:text-white">
                                Total Point
                            </span>
                            <span className="text-xl font-black text-black dark:text-white">
                                0
                            </span>
                        </button>

                        <button 
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold dark:bg-white text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 110, height: 110 }}
                        >
                            <CoinPointIcon 
                                className="w-10 h-10 mb-1 mt-1"
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

                <div className="flex flex-col justify-center items-center w-full ml-5 mr-7">
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

                <div className="flex flex-col items-center justify-center w-full ml-3 mt-3">
                    <div className="flex justify-center items-center w-full " style={{
                        width: 350,
                        height: 350
                    }}>
                        <CircularProgressbar 
                            value={60}
                            circleRatio={0.5}
                            strokeWidth={10}
                            styles={{
                                root: {
                                    transform: 'rotate(-90deg)',

                                },
                                path: {
                                    stroke: '#FFCA0C',
                                    strokeLinecap: 'round',
                                },
                                trail: {
                                    stroke: '#C4C4C4',
                                    strokeLinecap: 'round',
                                    
                                },
                                trailColor: "#C4C4C4",
                                text: {
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    textAnchor: 'middle',
                                    dominantBaseline: 'middle',
                                    fontFamily: 'ttb',
                                    transformBox: 'fill-box',
                                    transform: 'rotate(90deg)',
                                    transformOrigin: '60% 80%',
                                    fill: '#000000',       
                                },
                            }}
                            text="60.00%"
                            initialAnimation
                        />
                    </div>
                        <div className="flex relative justify-center items-center w-full top-[-130px]">
                            <div className="flex flex-col justify-center items-center">
                                <span className="text-xl font-black text-[#0056FF] dark:text-white">
                                    ภาพรวมอุณหภูมิความสุข 
                                </span>
                                <span className="text-xl font-black text-[#0056FF] dark:text-white">
                                    ในการทำงานของคุณ
                                </span>
                            </div>
                        </div>
                </div>

                

            
        </main>
        <nav>
            <AppMenu />
        </nav>
        </>
    );
}

Profile.auth = true