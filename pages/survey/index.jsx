import React from "react";
import { AppLayout } from "@/themes";


const Survey = () => {
    

    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-center items-center gap-2 mt-5 w-full">
                <h2 className="text-3xl font-bold text-[#0056FF]">รายงานอุณหภูมิ
                    <span className="text-[#F2871F]">
                        ความสุข
                    </span>
                </h2>
            </div>

            <div className="flex flex-col justify-center items-center gap-5 mt-10 w-full">
                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl">
                        BBD
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl">
                        AL
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl">
                        PB
                    </span>
                </div>

                <div className="flex justify-center items-center p-4 bg-[#0056FF] rounded-xl w-4/6">
                    <span className="font-bold text-white text-3xl">
                        TCON
                    </span>
                </div>
            </div>
            
           
            
        </div>
    );
};

export default Survey;

Survey.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Survey.auth = true;
