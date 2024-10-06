import React from "react";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import { IoIosArrowBack } from "react-icons/io";
const SurveyTeams = () => {

    const router = useRouter();
    
    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => router.push("/main")}
                    size={25}
                />
                <h2 className="text-3xl font-bold text-[#0056FF]">
                    รายงานอุณหภูมิ <span className="text-[#F2871F]">ความสุข</span>
                </h2>
                <div></div>
            </div>

            <div className="flex flex-col justify-center items-center gap-5 mt-10 w-full">
                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl"
                        onClick={() => router.push("/survey/BBD")}
                    >
                        BBD
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl"
                        onClick={() => router.push("/survey/BBDSERVICE")}
                    >
                        BBD (Service)
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl"
                        onClick={() => router.push("/survey/AL")}
                    >
                        AL
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl"
                        onClick={() => router.push("/survey/PB")}
                    >
                        PB
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl"
                        onClick={() => router.push("/survey/TCON")}
                    >
                        TCON
                    </span>
                </div>
            </div>
            
        </div>
    );
};

export default SurveyTeams;

SurveyTeams.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyTeams.auth = true;
