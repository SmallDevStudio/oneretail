import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR, { SWRConfig, mutate } from "swr";
import dynamic from "next/dynamic";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlinePostAdd } from "react-icons/md";
import "@/styles/profile.module.css";
import { AppLayout } from "@/themes";
import Loading from "@/components/Loading";
import UserModal from "@/components/UserModal";
import axios from "axios";

const fetcher = (url) => fetch(url).then((res) => res.json());

const HalfCircleProgressBar = dynamic(() => import('@/components/main/HalfCircleProgressBar'), { ssr: false });
const LineProgressBar = dynamic(() => import("@/components/ProfileLineProgressBar"), { ssr: false });

const ProfileContent = ({ session }) => {
    const [userLevels, setUserLevels] = useState({});
    const [users, setUsers] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(users?.user?.pictureUrl);

    const { data: user, error: userError } = useSWR(session ? `/api/users/${session.user.id}` : null, fetcher, {
        onSuccess: (data) => setUsers(data),
    });
    const { data: level, error: levelError } = useSWR(session ? `/api/level/user?userId=${session.user.id}` : null, fetcher, {
        onSuccess: (data) => setUserLevels(data),
    });
    const { data: survey, error: surveyError } = useSWR(session ? `/api/survey/user?userId=${session.user.id}` : null, fetcher, {
        onSuccess: (data) => setPercentage(parseFloat(data?.percent)),
    });
    const { data: coins, error: coinsError } = useSWR(session ? `/api/coins/user?userId=${session.user.id}` : null, fetcher);
    const { data: points, error: pointsError } = useSWR(session ? `/api/points/user?userId=${session.user.id}` : null, fetcher);

    if (levelError || surveyError || coinsError || pointsError) return <div>Error loading data</div>;
    if (!level || !survey || !coins || !points) return <Loading />;

    const percent = userLevels.nextLevelRequiredPoints
        ? parseFloat((userLevels.totalPoints / userLevels.nextLevelRequiredPoints ) * 100)
        : 0;

    
    const onRequestClose = async () => {
        setIsModalOpen(false);
    };


    const onSubmit = async (formData) => {
        try {
            await axios.put(`/api/users?userId=${session.user.id}`, formData);
            mutate(`/api/users/${session.user.id}`);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    return (
        <main className="flex flex-col mb-20">
            <div style={{ position: "fixed", top: 0, left: '38%', zIndex: 10, cursor: "pointer", minWidth: "100%", justifyItems: "end" }}>
                <div className="flex p-2 flex-row items-center justify-center gap-1">
                    {level?.user?.role === "admin" && (
                        <div className="flex items-center justify-center rounded-full p-1">
                            <Link href="/send">
                                <MdOutlinePostAdd size={22} className="text-gray-400 cursor-pointer" />
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center justify-center rounded-full p-1 ml-[-5px]">
                        <HiOutlineDotsVertical size={20} className="text-gray-400 cursor-pointer" />
                    </div>
                </div>
            </div>
            <div className="flex p-2 flex-row items-center justify-center mt-5">
                <div className="flex flex-col" style={{ width: "auto", height: "auto" }} onClick={() => setIsModalOpen(true)}>
                    <div className="items-center text-center" style={{ width: "auto", height: "140px" }}>
                        <div className="mt-4 ml-5">
                            <Image
                                src={profileImage || users?.user?.pictureUrl}
                                alt="User Avatar"
                                width={100}
                                height={100}
                                className="rounded-full"
                                priority
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                        </div>
                        <div className="absolute top-0 mt-5 z-0">
                            <Image
                                src="/images/profile/Badge.svg"
                                alt="Badge"
                                width={140}
                                height={140}
                            
                            />
                        </div>
                        <span className="absolute z-50 text-white font-bold mt-2.5 ml-[-5px] text-[10px]">LEVEL {level?.level + 1}</span>
                    </div>
                </div>
                <div className="flex-1 flex-col items-center justify-center ml-10 mr-5">
                    <span className="text-lg font-semibold text-[#0056FF] truncate">{users?.user?.fullname}</span>
                    <div className="relative">
                        <div className="relative mt-3">
                            <LineProgressBar percent={percent} />
                        </div>
                        <div style={{ width: "auto", height: "auto", position: "absolute", top: "-10px", left: "-10px" }}>
                            <Image
                                src="/images/profile/Point.svg"
                                alt="Coin"
                                width={30}
                                height={30}
                                style={{ objectFit: "cover", objectPosition: "center", width: "30px", height: "30px" }}
                            />
                        </div>
                    </div>
                    <span className="flex text-sm font-semibold text-[#0056FF] justify-end mt-2">
                        {level?.totalPoints} / {level?.nextLevelRequiredPoints}
                    </span>
                </div>
            </div>
            <div className="flex p-2 flex-col items-center justify-center text-center mt-3">
                <span className="text-xl font-black text-[#0056FF] mb-2">
                    ข้อมูลทั้งหมด
                </span>
                <div>
                    <button
                        className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl border-4 border-blue-700"
                        style={{ width: 110, height: 110 }}
                    >
                        <Image
                            src="/images/profile/Point.svg"
                            alt="point"
                            width={30}
                            height={30}
                            priority
                            style={{ objectFit: "cover", objectPosition: "center", width: "32px", height: "32px" }}
                        />
                        <span className="text-sm font-black text-[#0056FF] dark:text-white">
                            Total Points
                        </span>
                        <span className="text-xl font-black text-[#0056FF] dark:text-white">
                            {points?.point || 0}
                        </span>
                    </button>
                    <button
                        className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl border-4 border-blue-700"
                        style={{ width: 110, height: 110 }}
                    >
                        <Image
                            src="/images/profile/Coin.svg"
                            alt="coin"
                            width={32}
                            height={32}
                            style={{ objectFit: "cover", objectPosition: "center", width: "32px", height: "32px" }}
                        />
                        <span className="text-sm font-black text-[#0056FF] dark:text-white">
                            Coins
                        </span>
                        <span className="text-xl font-black text-[#0056FF] dark:text-white">
                            {coins?.coins || 0}
                        </span>
                    </button>
                </div>
            </div>
            <UserModal isOpen={isModalOpen} onRequestClose={onRequestClose} user={user} onSubmit={onSubmit} />
            <div className="flex p-2 flex-col items-center justify-center text-center mt-3 w-full">
                <Link href="/redeem">
                    <button className="w-40 h-10 bg-[#F2871F] text-white rounded-3xl font-semibold text-xl mb-5 mt-3">
                        <span>
                            Redeem
                        </span>
                    </button>
                </Link>
                <div className="flex p-2 flex-col items-center justify-center text-center mb-3">
                    <span className="text-2xl font-bold text-[#0056FF] mb-2" style={{
                        fontFamily: "Ekachon",
                    }}>
                        Learning Badge
                    </span>
                    <div className="flex flex-row gap-2 bg-gray-200 rounded-xl p-1 w-[100vw] h-[80px]">

                    </div>
                </div>
                <button className="bg-[#0056FF] text-white rounded-3xl font-semibold text-lg mb-3" style={{ width: 320, height: 50 }}>
                    <span>
                        ข้อมูลความสุขในการทำงานของคุณ
                    </span>
                </button>
            </div>
            <div className="items-center justify-center text-center mt-3"
                style={{ width: 300, height: 'auto', position: "relative", alignItems: "center", justifyContent: "center", display: "block", margin: "auto" }}
            >
                <HalfCircleProgressBar percentage={percentage} />
            </div>
            <div className="flex p-2 flex-col items-center justify-center text-center">
                <span className="relative text-xl text-center font-black text-black w-2/3">
                    ภาพรวมอุณหภูมิความสุข<br />
                    ในการทำงานของคุณ
                </span>
            </div>
            <div className="flex p-2 flex-row items-center justify-center text-center mt-3">
                <span className="flex text-sm font-semibold text-[#0056FF]">มีปัญหาการใช้งาน ติดต่อ</span>
                <Link href="https://lin.ee/SFfMbhs" target="_blank">
                <div className="bg-[#06C755] p-1 rounded-full text-white font-bold ml-2 w-20"><span>Line</span></div>
                </Link>
            </div>
        </main>
    );
}

export default function Profile() {
    const { data: session, status } = useSession();

    if (status === "loading") return <Loading />;
    if (!session) return <div>Please login to view your profile.</div>;

    return (
        <SWRConfig
            value={{
                fetcher: fetcher,
                onError: (error) => {
                    console.error(error);
                },
            }}
        >
            <ProfileContent session={session} />
        </SWRConfig>
    );
}

Profile.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Profile.auth = true;
