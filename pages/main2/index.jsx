import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Loading from "@/components/Loading";
import MainIconMenu from "@/components/main/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";
import RecheckUser from "@/components/RecheckUser";
import UserPanel from "@/components/main/UserPanel";
import MenuPanel from "@/components/main/MenuPanel";
import LinkModal from "@/components/LinkModal";
import Image from "next/image";
import BirthDayModal from "@/components/BirthDayModal";
import AdsModal from "@/components/AdsModal";

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
        const [openAds, setOpenAds] = useState(false);
        const [currentAdIndex, setCurrentAdIndex] = useState(0);
        const [timer, setTimer] = useState(5); // ตั้งเวลาถอยหลังเริ่มต้นที่ 5 วินาที
        const [loading, setLoading] = useState(false);
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
                setOpenAds(false); // ปิด modal ถ้าโฆษณาครบแล้ว
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
                        <div className="flex-grow flex items-center justify-center">
                            <MainIconMenu />
                        </div>
                        <div className="flex w-full mb-10 px-5">
                            <div className="flex flex-row justify-center w-full border-4 p-4 border-[#0056FF] rounded-xl gap-2"
                                onClick={() => setLinkModal(true)}
                            >
                                <Image
                                    src="/images/Link-01.svg"
                                    width={40}
                                    height={40}
                                    alt="Link"
                                    style={{ width: '30px', height: 'auto' }}
                                />
                                <span className="text-[#0056FF] font-bold">
                                    รวม Link
                                </span>
                            </div>
                        </div>
                        <div className="w-full">
                            <Carousel />
                        </div>
                        <div className="relative w-full footer-content">
                            <FooterContant />
                            <div className="text-center text-xs text-gray-300 mb-10">
                                <p>Copyright © 2024. All Rights Reserved.</p>
                                <span className=""> Powered by <span className="text-[#0056FF]/50 font-bold">One Retail</span></span>
                                <span className="ml-2">v.1.6.0</span>
                            </div>

                        </div>
                        
                        <LinkModal isOpen={linkModal} onRequestClose={() => setLinkModal(false)} />
                        <BirthDayModal isOpen={openModal} onRequestClose={() => setOpenModal(false)} name={user.user.fullname} />
                        {openAds && ads?.data?.[currentAdIndex] && (
                            <AdsModal isOpen={openAds} onRequestClose={handleCloseAds}>
                                <div className="flex-col w-full h-full flex">
                                    <div className="flex relative justify-end items-center">
                                        <div
                                            className="flex bg-gray-300 rounded-full px-3 py-1 cursor-pointer"
                                            onClick={handleSkipAd}
                                        >
                                            <span className="text-xs font-bold">
                                                ข้ามโฆษณา ({timer}s)
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
                                        />
                                    </div>
                                </div>
                            </AdsModal>
                        )}
                    </main>
                </RecheckUser>
            </React.Fragment>
        );
    };
    
    MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
    
    MainPage.auth = true;
    
    export default MainPage;
