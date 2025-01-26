import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Loading from "@/components/Loading";
/*import MainIconMenu from "@/components/MainIconMenu";*/
import MainIconMenu from "@/components/main/MainIconMenuNew";
import FooterContant from "@/components/main/footContent";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";
import RecheckUser from "@/components/RecheckUser";
import ManagerModal from "@/components/ManagerModal";
import UserPanel from "@/components/main/UserPanel";
import MenuPanel from "@/components/main/MenuPanel";
import LinkModal from "@/components/LinkModal";
import Image from "next/image";
import BirthDayModal from "@/components/BirthDayModal";
import AdsModal from "@/components/AdsModal";
import RandomModal from "@/components/RandomModal";
import Swal from "sweetalert2";

const Carousel = dynamic(() => import("@/components/Carousel"), {
    ssr: false,
    loading: () => <Loading />,
});

const fetcher = (url) => fetch(url).then((res) => res.json());


    const MainPage = () => {
        const { data: session, status } = useSession();
        const [showModal, setShowModal] = useState(false);
        const [linkModal, setLinkModal] = useState(false);
        const [openModal, setOpenModal] = useState(false);
        const [hasRandom, setHasRandom] = useState(false);
        const [showRandom, setShowRandom] = useState(false);
        const [openAds, setOpenAds] = useState(false);
        const [currentAdIndex, setCurrentAdIndex] = useState(0);
        const [timer, setTimer] = useState(5); // ตั้งเวลาถอยหลังเริ่มต้นที่ 5 วินาที
        const [loading, setLoading] = useState(false);
        const [showSticky, setShowSticky] = useState(false);
        const [showBtn, setShowBtn] = useState(false);

        const router = useRouter();
        const userId = session?.user?.id;
    
        const { data: user, error: userError, mutate: mutateUser } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
        const { data: level, error: levelError, mutate } = useSWR(session ? `/api/level/user?userId=${userId}` : null, fetcher);
        const { data: coins, error: coinsError, mutate: mutateCoins } = useSWR('/api/coins/user?userId=' + session?.user?.id, fetcher);
        const { data: ads, error: adsError, mutate: mutateAds } = useSWR('/api/ads/main', fetcher);
    
        useEffect(() => {
            if (status === "loading" || !session || !user) return;
            if (userError || !user || user?.user === null) {
                router.push('/register');
                return;
            }

            // Check if today is the user's birthday and set modal to open
            if (user?.user?.birthdate) {
                const today = new Date();
                const birthdate = new Date(user.user.birthdate);

                if (today.getDate() === birthdate.getDate() && today.getMonth() === birthdate.getMonth()) {
                    setOpenModal(true);
                }
            }

        }, [router, session, status, user, userError]);

        useEffect(() => {
            if (ads?.data?.length > 0) {
                setOpenAds(true);
            }
        }, [ads]);
    
        useEffect(() => {
            let interval;
            if (openAds && ads?.data?.[currentAdIndex]) {
                // ถ้ามีโฆษณาเปิดอยู่ให้เริ่มนับเวลาถอยหลัง
                interval = setInterval(() => {
                    setTimer((prev) => {
                        if (prev === 1) {
                            handleNextAd();
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
    
            return () => clearInterval(interval); // เคลียร์ interval เมื่อเปลี่ยนโฆษณาหรือปิด
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [openAds, currentAdIndex, ads]);


        useEffect(() => {
            const fetchRandom = async () => {
                await axios.get(`/api/randoms/${userId}?campaign=newyear`).then((res) => {
                    if (res.data.data.length > 0) {
                        setHasRandom(true);
                    }
                });
            };
            fetchRandom();
        }, [userId]);

        useEffect(() => {
            const checkDate = () => {
                const currentDate = new Date();
                const startDate = new Date("2025-01-01T00:00:00");
                const endDate = new Date("2025-01-01T23:59:59");
    
                if (currentDate >= startDate && currentDate <= endDate) {
                    setShowSticky(true);
                } else {
                    setShowSticky(false);
                }
            };
    
            checkDate();
            const interval = setInterval(checkDate, 60000); // ตรวจสอบทุก 1 นาที
            return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
        }, []);

        const handleRandom = async() => {
            // สุ่มค่าในช่วง 1-100
            const point = 25;
    
            const res = await axios.post(`/api/randoms`, 
                { 
                    userId, 
                    point,
                    campaign: 'newyear'
                });
            if (res.data) {
                setHasRandom(true);
                setShowRandom(false);
                await Swal.fire({
                    title: 'ได้รับเรียบร้อย',
                    icon: 'success',
                    text: `คุณได้รับ ${point} คะแนน`,
                    confirmButtonText: 'ตกลง'
                });
            }
        };

        const onRequestClose = () => {
            setShowModal(false);
        };
    
        const onExchangeAdd = async () => {
            mutate();
            mutateCoins();
        };

        const onUplad = () => {
            mutateUser();
        };

        const handleNextAd = () => {
            if (currentAdIndex + 1 < ads.data.length) {
                setCurrentAdIndex(currentAdIndex + 1);
                setTimer(5); // ตั้งเวลาใหม่เมื่อเปลี่ยนไปยังโฆษณาถัดไป
            } else {
                setShowBtn(true);
            }
        };
    
        const handleSkipAd = () => {
            handleNextAd();
        };
    
        const handleCloseAds = () => {
            setOpenAds(false); // ปิด modal เมื่อกดปิด
        };

        if (status === "loading" || !user || !level || loading ) return <Loading />;
        if (userError) return <div>Error loading data</div>;
    
        return (
            <React.Fragment>
                <RecheckUser>
                    <main className="flex flex-col bg-gray-10 justify-between items-center text-center min-h-screen">
                        <div className="flex justify-end mt-2 mr-3 w-full">
                            <MenuPanel user={user} />
                        </div>
                        <div className="w-full px-5 py-5">
                            <UserPanel 
                                user={user} 
                                level={level} 
                                onExchangeAdd={onExchangeAdd} 
                                setLoading={setLoading} 
                                loading={loading} 
                                coins={coins}
                                onUplad={onUplad}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full px-6 pb-2 max-w-[100vw]">
                            <MainIconMenu 
                                setLinkModal={setLinkModal}
                            />
                        </div>
                        
                        <div className="w-full mt-4">
                            <Carousel />
                        </div>
                        <div className="relative w-full footer-content">
                            <FooterContant />
                            <div className="text-center text-xs text-gray-300 mb-10">
                                <p>Copyright © 2024. All Rights Reserved.</p>
                                <span className=""> Powered by <span className="text-[#0056FF]/50 font-bold">One Retail</span></span>
                                <span className="ml-2">v.1.5.0</span>
                            </div>

                            {/* Sticky */}
                           {showSticky && hasRandom  === false && !showRandom && (
                                <div 
                                    className="fixed right-0 top-[72%] left-[60%] w-full z-10"
                                    onClick={() => setShowRandom(true)}
                                >
                                    <div className="flex flex-col items-center justify-center absolute">
                                            <Image
                                                src="/images/1212/HNY-25-Points.gif"
                                                width={100}
                                                height={100}
                                                alt="Link"
                                                style={{ width: '150px', height: 'auto' }}
                                            />
                                    </div>
                                </div>
                           )}


                        </div>

                        <ManagerModal isOpen={showModal} onRequestClose={onRequestClose} score={100} />
                        <LinkModal isOpen={linkModal} onRequestClose={() => setLinkModal(false)} />
                        <BirthDayModal isOpen={openModal} onRequestClose={() => setOpenModal(false)} name={user.user.fullname} />
                        {openAds && ads?.data?.[currentAdIndex] && (
                            <AdsModal 
                                isOpen={openAds} 
                                onClose={handleCloseAds}
                            >
                                <div className="flex-col w-full h-full flex">
                                    <div className="flex relative justify-end items-center">
                                        <div
                                            className="flex bg-gray-300 rounded-full px-3 py-1 cursor-pointer"
                                            onClick={showBtn ? handleCloseAds : handleSkipAd}
                                        >
                                            <span className="text-xs font-bold">
                                                {showBtn ? "ปิด" : `ข้ามโฆษณา (${timer}s)`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-col w-full h-full flex justify-center items-center">
                                        <Image
                                            src={ads.data[currentAdIndex].media.url}
                                            width={350}
                                            height={350}
                                            alt="Ads"
                                            style={{ width: '100%', height: 'auto' }}
                                            onClick={() => ads.data[currentAdIndex].url ? router.push(ads.data[currentAdIndex].url) : null}
                                        />
                                    </div>
                                </div>
                            </AdsModal>
                        )}

                        {showRandom && 
                            <RandomModal isOpen={showRandom} onClose={() => setShowRandom(false)}>
                                <div className="flex flex-col items-center justify-center">
                                    <Image
                                        src="/images/1212/HNY-25-Points.gif"
                                        width={300}
                                        height={300}
                                        alt="Link"
                                        style={{ width: '350px', height: 'auto' }}
                                    />

                                    <button
                                        className="bg-[#ED1C24] text-white font-bold py-2 px-4 rounded-full mt-[-10px] border-2 border-white"
                                        onClick={() => handleRandom()}
                                    >
                                        กดรับรางวัล
                                    </button>
                                </div>
                            </RandomModal>
                        }

                        
                    </main>
                </RecheckUser>
            </React.Fragment>
        );
    };
    
    MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
    
    MainPage.auth = true;
    
    export default MainPage;
