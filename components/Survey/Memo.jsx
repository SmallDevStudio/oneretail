import React from "react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { IoIosArrowBack } from "react-icons/io";
import { LuMessageSquarePlus } from "react-icons/lu";
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import { useRouter } from "next/router";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Memo = ({ memoData }) => {
    
    const router = useRouter();
    const { cheif_th, position, group, department, branch } = router.query;
    const teamGrop = 'Retail';

    const handleClick = (surveyId) => {
        router.push(`/survey/panel?surveyId=${surveyId}`);
    }

    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => router.back()}
                    size={25}
                />
                <h2 className="text-3xl font-bold text-[#0056FF]">
                    Verbatim ({memoData.length})
                </h2>
                <div></div>
            </div>

            <div className="flex flex-col justify-center items-center gap-1 mt-2 w-full">
                <span className="font-bold text-lg text-[#F2871F]">{branch || department || group || position || cheif_th || teamGrop}</span>
            </div>

            <div className="flex flex-col mt-5 w-full">
            {memoData ? (
                <div>
                    {memoData.map((memo, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col p-2 bg-gray-200 rounded-3xl text-sm w-full mb-2"
                            onClick={() => handleClick(memo.id)}
                        >
                            {/* Display memo data */}
                            <div className="flex flex-row gap-4 mb-2 w-full ">
                                <div className="flex flex-col w-[40px]">
                                    <Image
                                        src="/images/survey/3.svg"
                                        alt="Profile"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                </div>
                                <div className="flex flex-row justify-between px-1 w-full">
                                    <span className="text-sm">{memo.memo}</span>
                                    <span className="text-xs">{moment(memo.createdAt).locale("th").format("lll")}</span>
                                </div>
                            </div>

                            <Divider className="w-full mb-2"/>

                            <div className="flex flex-row justify-end items-center px-2 w-full">
                                <div className="flex flex-row gap-2 items-center">
                                    <LuMessageSquarePlus className="text-gray-700" size={15}/>
                                    <div className="flex flex-row gap-1 items-center">
                                        <span>ความคิดเห็น</span>
                                        <span>{memo?.comments?.length ? memo.comments.length : 0}</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    ไม่มีข้อมูล
                </div>
            )}
            </div>

        </div>
    );
}

export default Memo;
