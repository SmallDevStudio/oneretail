import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import Loading from "@/components/Loading";
import { IoClose } from "react-icons/io5";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

export default function Ads() {
    const [ads, setAds] = useState(null);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [timer, setTimer] = useState(5); // ตั้งเวลาถอยหลังเริ่มต้นที่ 5 วินาที
    const [loading, setLoading] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false); // สถานะเวลาหมด
    const [showButton, setShowButton] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if(!ads) {
            const fetchAds = async () => {
                try {
                    const response = await axios.get('/api/ads/page');
                    setAds(response.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAds();
        }
    }, [ads]);
 
    console.log(ads);
    const handleNextAd = () => {
        if (currentAdIndex + 1 < ads.data.length) {
            setCurrentAdIndex(currentAdIndex + 1);
            setTimer(5); // ตั้งเวลาใหม่เมื่อเปลี่ยนไปยังโฆษณาถัดไป
            setIsTimeUp(false); // ตั้งสถานะเวลาหมดเป็น false
        } else {
            setShowButton(true);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (ads?.data?.length === 0) {
            setLoading(false);
            router.push('/main');
            return;
        }
        setLoading(false);
    }, [ads, router]);

    useEffect(() => {
        let interval;
        if (ads?.data?.[currentAdIndex]) {
            // ถ้ามีโฆษณาเปิดอยู่ให้เริ่มนับเวลาถอยหลัง
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        setIsTimeUp(true); // ตั้งสถานะเวลาหมดเป็น true
                        handleNextAd();
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval); // เคลียร์ interval เมื่อเปลี่ยนโฆษณาหรือปิด
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAdIndex, ads]);

    const handleSkipAd = () => {
        handleNextAd();
    };

    const handleButtonClick = () => {
        setShowButton(false);
        router.push('/main');
    };

    if (!ads || loading) return <Loading />;

    return (
        <div>
            <div className="flex-col w-full h-full flex">
                <div className="flex relative justify-end items-center">
                    <div
                        className="absolute top-2 right-2 bg-[#F2871F] items-center rounded-full px-3 py-1 cursor-pointer"
                        onClick={handleSkipAd}
                    >
                        {showButton ? (
                            <button
                                className="text-white font-bold text-xs"
                                onClick={handleButtonClick}
                            >
                               <div className="flex-row items-center">
                                    <IoClose className="inline text-sm mr-1 font-bold"/>
                                    กลับสู่หน้าหลัก
                               </div>
                            </button>
                        ) : (
                            <span className="text-xs font-bold">
                                {isTimeUp ? 'ไปหน้าถัดไป' : `ข้ามโฆษณา (${timer}s)`}
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
                        style={{ width: '100%', height: 'auto' }}
                        loading="lazy"
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

Ads.auth = true;
