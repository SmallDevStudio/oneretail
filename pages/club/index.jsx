import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/themes/Layout/AppLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import Announce from "@/components/club/Announce";
import LeaderBoard from "@/components/club/Leaderboard";
import Rules from "@/components/club/Rules";
import Experience from "@/components/club/Experience";

export default function Club() {
    const [activeTab, setActiveTab] = useState('experience');

    const router = useRouter();

    useEffect(() => {
        const tab = router.query.tab || "experience";
        setActiveTab(tab);
    }, [router.query.tab]);


    const handleTabClick = useCallback((tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    }, []);

    return (
        <div className="flex flex-col w-[100%] min-h-[100vh] bg-[#120d0f] mb-10 py-5">
            <div className="w-full flex justify-center">
                <Image
                    src="/images/club/logo-club.png"
                    alt="one Retail club Logo"
                    width={60}
                    height={60}
                    style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        height: "60px",
                        width: "auto",
                    }}
                />
            </div>
            <div className="w-full flex justify-center mt-4">
                {/* Tabs */}
                <div className="flex justify-center mb-4 text-sm">
                    <ul className="flex flex-wrap text-white">
                        <li className="me-2">
                            <a
                                href="#"
                                className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'experience' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                                onClick={() => handleTabClick('experience')}
                            >
                                Experience
                            </a>
                        </li>
                        <li className="me-2">
                            <a
                                href="#"
                                className={`inline-block p-2 border-b-2 rounded-t-lg ml-5 font-bold ${activeTab === 'leaderboard' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                                onClick={() => handleTabClick('leaderboard')}
                            >
                                LeaderBoard
                            </a>
                        </li>
                        <li className="me-2">
                            <a
                                href="#"
                                className={`inline-block p-2 border-b-2 rounded-t-lg ml-5 font-bold ${activeTab === 'rules' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                                onClick={() => handleTabClick('rules')}
                            >
                                กติกา
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="p-2">
                {activeTab === 'experience' && <Experience id="experience" />}
                {activeTab === 'leaderboard' && <LeaderBoard id="leaderboard"/>}
                {activeTab === 'rules' && <Rules id="rules"/>}
            </div>
        </div>
    );
}
