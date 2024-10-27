import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import Loading from "@/components/Loading";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

export default function Ads() {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [timer, setTimer] = useState(5); // ตั้งเวลาถอยหลังเริ่มต้นที่ 5 วินาที
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const { data: ads, error, mutate, isLoading } = useSWR('/api/ads/page', fetcher);

    const handleNextAd = () => {
        if (currentAdIndex + 1 < ads.data.length) {
            setCurrentAdIndex(currentAdIndex + 1);
            setTimer(5); // ตั้งเวลาใหม่เมื่อเปลี่ยนไปยังโฆษณาถัดไป
        } else {
            router.push('main');; // ปิด modal ถ้าโฆษณาครบแล้ว
        }
    };

    useEffect(() => {
        setLoading(true);
        if (ads.data.length === 0) {
            setLoading(false);
            router.push('/main');
            return;
        }
        setLoading(false);
    }, [ads.data.length, router]);

    useEffect(() => {
        let interval;
        if (ads?.data?.[currentAdIndex]) {
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
    }, [currentAdIndex, ads]);

    const handleSkipAd = () => {
        handleNextAd();
    };


    if (error) return <div>Failed to load</div>;
    if (isLoading || !ads || loading) return <Loading />;

    return (
        <div>
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
                        src={ads?.data[currentAdIndex]?.media?.url}
                        width={350}
                        height={350}
                        alt="Ads"
                        style={{ width: '100%', height: 'auto' }}
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
}

Ads.auth = true;