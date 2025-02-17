import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import Loading from "@/components/Loading";
import { IoClose } from "react-icons/io5";

moment.locale("th");

export default function Ads() {
    const [ads, setAds] = useState(null);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [timer, setTimer] = useState(5);
    const [loading, setLoading] = useState(true);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [showButton, setShowButton] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get("/api/ads/page");
                setAds(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    const handleNextAd = () => {
        if (currentAdIndex + 1 < ads.data.length) {
            setCurrentAdIndex((prevIndex) => prevIndex + 1);
            setTimer(5); 
            setIsTimeUp(false); 
        } else {
            setShowButton(true);
        }
    };

    useEffect(() => {
        if (ads?.data?.length === 0) {
            router.push("/main");
            return;
        }

        let interval;
        if (!showButton) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setIsTimeUp(true); 
                        handleNextAd();
                        return 5; 
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAdIndex, ads, showButton]);


    
    const handleSkipAd = () => {
        handleNextAd();
    };

    const handleButtonClick = () => {
        setShowButton(false);
        router.push("/main");
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="flex-col w-full h-full flex">
                <div className="flex relative justify-end items-center">
                    <div
                        className="absolute top-2 right-2 bg-[#F2871F] items-center rounded-full px-3 py-1 cursor-pointer"
                        onClick={handleSkipAd}
                    >
                        {showButton ? (
                            <button className="text-white font-bold text-xs" onClick={handleButtonClick}>
                                <div className="flex-row items-center">
                                    <IoClose className="inline text-sm mr-1 font-bold" />
                                    กลับสู่หน้าหลัก
                                </div>
                            </button>
                        ) : (
                            <span className="text-xs font-bold">
                                {isTimeUp ? "ไปหน้าถัดไป" : `ข้ามโฆษณา (${timer}s)`}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex-col w-full h-full flex justify-center items-center">
                    <Image
                        src={ads?.data[currentAdIndex]?.media?.url}
                        width={400}
                        height={400}
                        alt="Ads"
                        style={{ width: "100%", height: "auto" }}
                        loading="lazy"
                        className="object-cover"
                        onClick={() => router.push(ads.data[currentAdIndex].url ? ads.data[currentAdIndex].url : null)}
                    />
                </div>
            </div>
        </div>
    );
}

