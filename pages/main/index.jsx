import AppMenu from "@/components/menu/AppMenu";
import MainCarouel from "@/components/main/MainCarouel";
import JoyStickIcon from "@/resources/icons/JoyStickIcon";
import CalendarIcon from "@/resources/icons/CalendarIcon";
import GiftBoxIcon from "@/resources/icons/GiftBoxIcon";
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import LeaderIcon from "@/resources/icons/LeaderIcon";
import CampaignIcon from "@/resources/icons/CampaignIcon";
import FooterContant from "@/components/main/footContent";
import { Suspense } from "react";
import Loading from "@/components/Loading";
export default function MainPage() {
   
    return (
        <div className="flex flex-col bg-white dark:bg-gray-900">
            <div className="w-full h-full">
                <div className="static z-10 mt-[-30px]">
                    <Suspense fallback={<Loading />}>
                        <MainCarouel />
                    </Suspense>
                </div>
            </div>

            <div className="absolute w-full h-full top-1/3">
                <div className="flex w-full mt-1 justify-center items-center">
                    <div className="grid grid-cols-3 gap-4">
                            <button 
                                className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                                style={{ width: 95, height: 95 }}
                                onClick={() => window.location.href = "/games"}
                            >
                                <JoyStickIcon 
                                    style={{ 
                                        width: 40,
                                        color: "#F68B1F",
                                    }}
                                />
                                <span>
                                    Games
                                </span>
                            </button>

                        <button
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 95, height: 95 }}
                            onClick={() => window.location.href = "/training"}
                        >
                            <CalendarIcon
                                style={{ 
                                    width: 40,
                                    color: "#F68B1F",
                                }}
                            />
                            <span>ตารางอบรม</span>
                        </button>

                        <button
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 95, height: 95 }}
                            onClick={() => window.location.href = "/redeem"}
                        >
                            <GiftBoxIcon
                                style={{ 
                                    width: 40,
                                    color: "#F68B1F",
                                }}
                            />
                            <span>Redeem</span>
                        </button>

                        <button
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 95, height: 95 }}
                            onClick={() => window.location.href = "/learning"}
                        >
                            <OndemandVideoOutlinedIcon
                                style={{ 
                                    fontSize: 40,
                                    color: "#F68B1F",
                                }}
                            />
                            <span className="text-xs text-bold text-nowrap">Learn มันส์</span>
                            <span className="text-xs text-bold text-nowrap" >จันทร์ พุธ ศุกร์</span>
                        </button>

                        <button
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-xs font-bold text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 95, height: 95 }}
                            onClick={() => window.location.href = "/leaderboard"}
                        >
                            <LeaderIcon
                                style={{ 
                                    width: 40,
                                    color: "#F68B1F",
                                }}
                            />
                            <span className="text-nowrap" >Leader Board</span>
                        </button>

                        <button
                            className="flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden text-sm font-bold text-gray-900 rounded-2xl dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 hover:text-white border-4 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                            style={{ width: 95, height: 95 }}
                            onClick={() => window.location.href = "/campaign"}
                        >
                            <CampaignIcon
                                style={{ 
                                    width: 40,
                                    color: "#F68B1F",
                                }}
                            />
                            <span>Campaign</span>
                        </button>

                    </div>
                </div>
            </div>

            <div className="flex absolute w-full top-1/2 mt-[80px]">
                <FooterContant />
            </div>
            <AppMenu />
        </div>
    );
}