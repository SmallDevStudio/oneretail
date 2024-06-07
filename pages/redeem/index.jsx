import { useState } from "react";
import Image from "next/image"
import { AppLayout } from "@/themes"
import { Suspense } from "react";
import LoadingFeed from "@/components/LoadingFeed";

export default function Redeem() {
    const [activeTab, setActiveTab] = useState("redeem1");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <main className="flex flex-col bg-white min-w-[100vw]">
            {/* Header */}
            <div>
                {/* Avatar */}
                <div></div>
                {/* Point & Coins */}
                <div></div>
            </div>
            {/* Tabs */}
            <div className="flex items-center justify-center">
                <ul className="flex flex-row w-[300px] font-bold">
                    <li>
                        <div className={`flex  w-[150px] h-[50px] items-center justify-center text-center rounded-l-3xl ${activeTab === 'redeem1' ? 'hover:bg-[#0056FF] text-white' : 'bg-gray-300 text-black'}`}
                            onClick={() => handleTabClick('redeem1')}
                        >
                            <span>แลกของรางวัล</span>
                        </div>
                    </li>
                    <li>
                    <div className={`flex  w-[150px] h-[50px] items-center justify-center text-center rounded-r-3xl ${activeTab === 'redeem2' ? 'bg-[#F68B1F] text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => handleTabClick('redeem2')}
                    >
                            <span>ของที่แลกแล้ว</span>
                        </div>
                    </li>
                </ul>
            </div>
            {/* Content */}
            {activeTab === 'redeem1' && (
                <Suspense fallback={<LoadingFeed />}>
                    <div>
                        Redeem 1
                    </div>
                </Suspense>
                )}

            {activeTab === 'redeem2' && (
                <Suspense fallback={<LoadingFeed />}>
                    <div>
                        Redeem 2
                    </div>
                </Suspense>
                )}
           
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