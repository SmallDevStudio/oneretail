import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import LineLogoIcon from "@/resources/icons/LineLogoIcon";
import Loading from "@/components/Loading";
import moment from "moment";
import "moment/locale/th";
import { toast } from "react-toastify";
import { FaHome } from "react-icons/fa";

moment.locale("th");

const fetcher = url => axios.get(url).then(res => res.data);

export default function CheckIn() {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasCheckIn, setHasCheckIn] = useState(false);

    const router = useRouter();
    const { data: session, status } = useSession();

    const { data, error } = useSWR(() => router.query.id ? `/api/events/eventcheckin/${router.query.id}` : null, fetcher, {
        onSuccess: (data) => {
            setEvent(data.data);
            setLoading(false);
        },
    });

    const { data: checkIn } = useSWR(() => router.query.id ? `/api/check-in/join?eventCheckinId=${router.query.id}&userId=${session?.user.id}` : null, fetcher);

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            signIn("line", { callbackUrl: `/check-in?id=${router.query.id}` });
        }  
    }, [router.query.id, session, status]);

    useEffect(() => {
        if (checkIn && checkIn?.data?.length > 0) {
            setHasCheckIn(true);
        }
    }, [checkIn]);

    console.log(checkIn);


    if (loading) return <Loading />;

    const handleCheckIn = async () => {
        setLoading(true);

        try {
            const res = await axios.post(`/api/check-in`, {
                eventCheckinId: router.query.id,
                user: { userId: session.user.id },
            });

            if (res.status === 200 || res.status === 201) {
                setLoading(false);
                setHasCheckIn(true);
                toast.success('Check-in สําเร็จ');
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col items-center">
            {!session ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center justify-center w-full">
                    <Image
                        src="/dist/img/logo-one-retail.png"
                        alt="One Retail Logo"
                        width={200}
                        height={200}
                        sizes="100vw"
                        className="inline"
                        loading="lazy"
                        style={{
                            width: "200px",
                            height: "auto",
                        }}
                    />

                    <div className="mt-5">
                        <button type="button" 
                                className="text-white bg-[#06C755] hover:bg-[#06C755]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center font-semibold dark:focus:ring-[#06C755]/55 me-2 mb-2"
                                onClick={() => signIn("line", { callbackUrl: "/check-in" })}
                                >
                            <LineLogoIcon className="w-6 h-6 me-2 mr-5 "/>
                            Sign in with Line
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/dist/img/logo-one-retail.png"
                            alt="One Retail Logo"
                            width={200}
                            height={200}
                            sizes="100vw"
                            className="inline"
                            loading="lazy"
                            style={{
                                width: "200px",
                                height: "auto",
                            }}
                        />
                    </div>
                    <div className="flex flex-col bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex flex-col text-sm px-4 w-full p-2">
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-row gap-2">
                                    <span className="font-bold">ชื่อกิจกรรม:</span>
                                    <span className="">{event?.title}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <span className="font-bold">รุ่นที่</span>
                                    <span className="">{event?.No}</span>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="font-bold">รายละเอียด:</span>
                                <span className="">{event?.description}</span>
                            </div>
                        
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-row gap-2">
                                    <span className="font-bold">Channel:</span>
                                    <span className="">{event?.channel}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <span className="font-bold">Position:</span>
                                    <span className="">{event?.position}</span>
                                </div>
                            </div>
                        
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-row gap-2">
                                    <span className="font-bold">วันที่เริ่ม:</span>
                                    <span className="">{moment(event?.startDate).format("ll")}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <span className="font-bold">วันที่สิ้นสุด:</span>
                                    <span className="">{moment(event?.endDate).format("ll")}</span>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="font-bold">เวลา:</span>
                                <span className="">{event?.startTime} - {event?.endTime}</span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="font-bold">สถานที่:</span>
                                <span className="">{event?.place}</span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="font-bold">หมายเหตุ:</span>
                                <span className="">{event?.remark || "-"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full mt-4">
                        {hasCheckIn && <span className="text-center text-green-500 font-bold">Check-in สําเร็จแล้ว</span>}
                        {hasCheckIn ? (
                            <button
                               className="flex flex-col items-center gap-2 p-2 bg-[#0056FF] font-bold text-white rounded-lg"
                               onClick={() => router.push("/")}
                            >
                              <div className="flex flex-row items-center gap-2">
                                <FaHome size={20} />
                                กลับหน้าแรก
                              </div>
                           </button>
                       ): (
                            <button
                                className="flex flex-col items-center gap-2 p-2 bg-[#0056FF] font-bold text-white rounded-lg"
                                onClick={handleCheckIn}
                            >
                                Check-In
                            </button>
                       )}
                    </div>
                </div>
            )}
        </div>
    );
}