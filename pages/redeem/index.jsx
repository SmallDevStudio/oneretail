import { useState } from "react";
import Image from "next/image"
import { AppLayout } from "@/themes"
import { Suspense } from "react";
import LoadingFeed from "@/components/LoadingFeed";
import useSWR from "swr";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ExchangeModal from "@/components/ExchangeModal";

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Redeem() {
    const [activeTab, setActiveTab] = useState("redeem1");
    const { data: session } = useSession();
    const {image, id} = session?.user;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [conversionRate, setConversionRate] = useState(25);
    const [userPoints, setUserPoints] = useState(0);
    const [userCoins, setUserCoins] = useState(0);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const { data: level } = useSWR('/api/level/user?userId='+session?.user?.id, fetcher, );
    const { data: coins } = useSWR('/api/coins/user?userId='+session?.user?.id, fetcher, );
    const { data: points } = useSWR('/api/points/user?userId='+session?.user?.id, fetcher, );
    

    const handleRedeem = (event) => {
        event.preventDefault();
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <main className="flex flex-col bg-white min-w-[100vw]">
            {/* Header */}
            <div className="flex flex-col items-center justify-center mt-10">
                {/* Avatar */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <Image
                        src={image}
                        alt="User Avartar"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                    <Image
                        src="/images/profile/Badge.svg"
                        alt="Badge"
                        width={140}
                        height={140}
                        className="absolute z-12 mb-5"
                    />
                    <span className="relative z-12 text-white font-bold mt-3 text-[10px]"
                    >LEVEL {level?.level}
                    </span>  
                </div>
                {/* Point & Coins */}
                <div className="flex items-center justify-between w-full px-5 pz-5">
                    <div className="flex items-end">
                        <div className="flex flex-row items-end gap-2" style={{
                                fontFamily: "Ekachon",
                                fontSmoothing: "auto",
                                fontWeight: "black",
                                alignItems: "end",
                            }}>
                            <Image 
                                src="/images/profile/Coin.svg"
                                alt="point"
                                width={32}
                                height={32}
                                className="flex"
                            />

                            <span className="text-xl text-[#0056FF] font-black" >
                                {coins?.coins? coins?.coins : 0}
                            </span>
                            <span className="text-lg text-[#0056FF] font-black">
                                Coins
                            </span>

                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="flex flex-row items-end gap-2" style={{
                                fontFamily: "Ekachon",
                                fontSmoothing: "auto",
                                fontWeight: "black",
                                alignItems: "end",
                            }}>
                            <Image 
                                src="/images/profile/Point.svg"
                                alt="point"
                                width={30}
                                height={30}
                                className="flex"
                            />
                            <span className="text-lg text-[#0056FF] font-bold">
                                Total Point
                            </span>
                            <span className="text-lg text-[#0056FF] font-bold">
                                {points?.point? points?.point : 0}
                            </span>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="flex items-center justify-end mr-5 mb-2">
                <span className="text-[10px] text-[#1E3060] font-bold">
                    เปลี่ยนคะแนน เป็น คอยล์ 
                    <button>
                        <span className="text-[#F68B1F] font-bold ml-1" onClick={openModal}>คลิก</span>
                    </button>
                </span>
            </div>
            {/* Tabs */}
            <div className="flex items-center justify-center">
                <ul className="flex flex-row w-[340px] font-bold">
                    <li>
                        <div className={`flex  w-[170px] h-[40px] items-center justify-center text-center rounded-l-3xl ${activeTab === 'redeem1' ? 'bg-[#0056FF] text-white' : 'bg-gray-300 text-black'}`}
                            onClick={() => handleTabClick('redeem1')}
                        >
                            <span>แลกของรางวัล</span>
                        </div>
                    </li>
                    <li>
                    <div className={`flex  w-[170px] h-[40px] items-center justify-center text-center rounded-r-3xl ${activeTab === 'redeem2' ? 'bg-[#F68B1F] text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => handleTabClick('redeem2')}
                    >
                            <span>ของที่แลกแล้ว</span>
                        </div>
                    </li>
                </ul>
            </div>
            <ExchangeModal 
                isOpen={modalIsOpen} 
                onRequestClose={closeModal} 
                points={""} 
                conversionRate={conversionRate} 
            />
            {/* Content */}
            <div className="flex flex-col items-center justify-center p-5 gap-2 mb-20">
                
            {activeTab === 'redeem1' && (
                <Suspense fallback={<LoadingFeed />}>
                    <div className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                        <div className="flex flex-col items-center justify-center">
                            <Image 
                                src="/images/redeem/1.png"
                                alt="point"
                                width={150}
                                height={150}
                                className="flex p-2"
                                style={{
                                    minWidth: "150px",
                                    maxHeight: "120px",
                                    objectFit: "contain",
                                }}
                            />
                            <div style={{
                                position: "relative",
                                bottom: "10px",
                                left: "35px",
                            }}>
                                <div className="flex bg-[#0056FF] rounded-full text-white font-bold h-6 w-[70px] p-1 text-center justify-center items-center">
                                    <span>50</span>
                                </div>
                            </div>
                        </div>
                    <div className="flex-col">
                        <div className="text-lg font-bold text-[#0056FF]">
                            Test
                        </div>
                        <div>
                            <span className="text-[12px] line-clamp-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </span>
                        </div>
                        <div className="flex flex-row justify-between pt-2 pr-2">
                            <div className="flex flex-col ">
                                <span className="text-[0.7em]">
                                    คงเหลือ
                                </span>
                                <span className="font-bold">
                                    50 สิทธิ์
                                </span>
                            </div>
                            <button className="bg-[#F68B1F] rounded-full text-white font-medium w-2/4 h-8">
                                redeem
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                    <div className="flex flex-col items-center justify-center">
                        <Image 
                            src="/images/redeem/2.png"
                            alt="point"
                            width={150}
                            height={150}
                            className="flex p-2"
                            style={{
                                minWidth: "150px",
                                maxHeight: "120px",
                                objectFit: "contain",
                            }}
                        />
                        <div style={{
                                position: "relative",
                                bottom: "10px",
                                left: "35px",
                            }}>
                                <div className="flex bg-[#0056FF] rounded-full text-white font-bold h-6 w-[70px] p-1 text-center justify-center items-center">
                                    <span>300 🪙 </span>
                                </div>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-lg font-bold text-[#0056FF]">
                            Test
                        </div>
                        <div>
                            <span className="text-[12px] line-clamp-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </span>
                        </div>
                        <div className="flex flex-row justify-between pt-2 pr-2">
                            <div className="flex flex-col ">
                                <span className="text-[0.7em]">
                                    คงเหลือ
                                </span>
                                <span className="font-bold">
                                    50 สิทธิ์
                                </span>
                            </div>
                            <button className="bg-[#F68B1F] rounded-full text-white font-medium w-2/4 h-8">
                                redeem
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                        <Image 
                            src="/images/redeem/3.png"
                            alt="point"
                            width={150}
                            height={150}
                            className="flex p-2"
                            style={{
                                minWidth: "150px",
                                maxHeight: "120px",
                                objectFit: "contain",
                            }}
                        />
                    <div className="flex-col">
                        <div className="text-lg font-bold text-[#0056FF]">
                            Test
                        </div>
                        <div>
                            <span className="text-[12px] line-clamp-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </span>
                        </div>
                        <div className="flex flex-row justify-between pt-2 pr-2">
                            <div className="flex flex-col ">
                                <span className="text-[0.7em]">
                                    คงเหลือ
                                </span>
                                <span className="font-bold">
                                    50 สิทธิ์
                                </span>
                            </div>
                            <button className="bg-[#F68B1F] rounded-full text-white font-medium w-2/4 h-8">
                                redeem
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                        <Image 
                            src="/images/redeem/4.png"
                            alt="point"
                            width={150}
                            height={150}
                            className="flex p-2"
                            style={{
                                minWidth: "150px",
                                maxHeight: "120px",
                                objectFit: "contain",
                            }}
                        />
                    <div className="flex-col">
                        <div className="text-lg font-bold text-[#0056FF]">
                            Test
                        </div>
                        <div>
                            <span className="text-[12px] line-clamp-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </span>
                        </div>
                        <div className="flex flex-row justify-between pt-2 pr-2">
                            <div className="flex flex-col ">
                                <span className="text-[0.7em]">
                                    คงเหลือ
                                </span>
                                <span className="font-bold">
                                    50 สิทธิ์
                                </span>
                            </div>
                            <button className="bg-[#F68B1F] rounded-full text-white font-medium w-2/4 h-8">
                                redeem
                            </button>
                        </div>
                    </div>
                </div>

                
                </Suspense>
                )}

            {activeTab === 'redeem2' && (
                <Suspense fallback={<LoadingFeed />}>
                    <div className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                        <Image 
                            src="/images/redeem/2.png"
                            alt="point"
                            width={150}
                            height={150}
                            className="flex p-2"
                            style={{
                                minWidth: "150px",
                                maxHeight: "120px",
                                objectFit: "contain",
                            }}
                        />
                    <div className="flex-col">
                        <div className="text-lg font-bold text-[#0056FF]">
                            Test
                        </div>
                        <div>
                            <span className="text-[12px] line-clamp-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </span>
                        </div>
                        
                    </div>
                </div>
                </Suspense>
                )}
            </div>
           
        </main>
    )
}

Redeem.getLayout = function getLayout(page) {
    return (
        <AppLayout>
            {page}
        </AppLayout>
    )
}

Redeem.auth = true;