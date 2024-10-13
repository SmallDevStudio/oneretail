import { useState } from "react";
import axios from 'axios';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from "next/dynamic";
import { AppLayout } from "@/themes";
import { Divider } from '@mui/material';
import { MdOutlineOndemandVideo } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { IoIosArrowBack } from "react-icons/io";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CYC = () => {
    const [user, setUser] = useState(null);

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const LineProgressBar = dynamic(() => import("@/components/GenLineProgressBar"), { ssr: false });

    const { data: users, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher, {
        onSuccess: (data) => {
            setUser(data?.user);
        }
    });

    return (
        <div className="flex flex-col min-h-[80vh] mb-20">
            <div className="flex flex-col px-4 mt-5">
                <div className="flex flex-row items-center gap-4 w-full">
                    <IoIosArrowBack 
                        className="text-xl inline text-gray-700"
                        onClick={() => router.back()}
                    />
                    <span className="text-lg font-bold text-[#0056FF]">CYC</span>
                </div>
            </div>
            {/* User Panel */}
            <div className="flex flex-row justify-evenly items-center px-8 mt-4 gap-4 w-full">
                <div className="flex w-[120px]">
                    <Image
                        src={user?.pictureUrl}
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="bg-gray-300"
                        style={{
                            width: "80px",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                        }}
                    />
                </div>

                <div className='flex flex-col items-center w-full'>
                    <span className='text-xl text-[#0056FF] font-bold'>{user?.fullname}</span>
                    <span className='text-xl text-[#F2871F] font-bold'>{user?.position}</span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col px-8 mt-5">

                <Divider className="mb-1 border-[#0056FF]"/>
                {/* progress bar */}
                <div className="flex flex-row items-center w-full gap-2 mb-2 mt-2">
                    <span className="text-sm font-bold text-gray-400">Progress</span>
                    <div className="flex flex-col w-full">
                        <LineProgressBar percent={25} />
                    </div>
                    <span className="text-sm text-gray-400">1/4</span>
                </div>

                <span className="text-xs text-gray-400">
                    ค้นหาว่าอะไรที่ทำให้พนักงานขายประสบความสำเร็จและเรียนรู้กลยุทธ์ 
                    เฉพาะสำหรับการหาลูกค้าการวางตำแหน่งผลิตภัณฑ์ และการพัฒนา
                    กระบวนการขาย
                </span>

                <div className="flex flex-col w-full gap-1 mt-4">
                    <span className="text-sm font-bold">{"WHAT'S INCLUDED"}</span>
                    <div className="flex flex-row item-center gap-2">
                        <MdOutlineOndemandVideo 
                            className="inline text-[#0056FF]"
                            size={20}
                        />
                        <span className="text-sm text-gray-700">: 3 Video</span>
                    </div>
                    <div className="flex flex-row item-center gap-2">
                        <PiExam 
                            className="inline text-[#0056FF]"
                            size={20}
                        />
                        <span className="text-sm text-gray-700">: 2 Quiz</span>
                    </div>
                </div>

                {/* Content */}
                
                <div className="flex flex-col w-full gap-4 mt-5 text-sm">
                    <button className="flex items-center w-full text-left">
                        <div className="grid grid-cols-5 items-center w-full gap-1">
                            <div className="col-span-1">
                                <Image
                                    src="/images/gen/quiz-icon.png"
                                    alt="Quiz Icon"
                                    width={80}
                                    height={80}
                                    style={{
                                        width: "50px",
                                        height: "auto",
                                    }}
                                />
                            </div>

                            <div className="col-span-3 font-bold pr-8">
                                <span>Pre test</span>
                            </div>
                            
                            <div className="col-span-1 font-bold">
                                <span>10 Point</span>
                            </div>
                        </div>
                   </button>
                    {/* video */}
                    <button className="flex items-center w-full text-left">
                        <div className="grid grid-cols-5 w-full gap-1">
                            <div className="col-span-1">
                                <Image
                                    src="/images/gen/video-icon.png"
                                    alt="Quiz Icon"
                                    width={80}
                                    height={80}
                                    style={{
                                        width: "50px",
                                        height: "auto",
                                    }}
                                />
                            </div>

                            <div className="col-span-3 font-bold pr-8">
                                <span>ความแตกต่างระหว่าง CYB และ CYC</span>
                            </div>
                            
                            <div className="col-span-1 font-bold">
                                <span>10 Point</span>
                            </div>
                        </div>
                    </button>

                    <button className="flex items-center w-full text-left">
                        <div className="grid grid-cols-5 items-center w-full gap-1">
                            <div className="col-span-1">
                                <Image
                                    src="/images/gen/video-icon.png"
                                    alt="Quiz Icon"
                                    width={80}
                                    height={80}
                                    style={{
                                        width: "50px",
                                        height: "auto",
                                    }}
                                />
                            </div>

                            <div className="col-span-3 font-bold pr-8">
                                <span>เจาะลึก CYB</span>
                            </div>
                            
                            <div className="col-span-1 font-bold">
                                <span>10 Point</span>
                            </div>
                        </div>
                    </button>

                    <button className="flex items-center w-full text-left">
                        <div className="grid grid-cols-5 items-center w-full gap-1">
                            <div className="col-span-1">
                                <Image
                                    src="/images/gen/video-icon.png"
                                    alt="Quiz Icon"
                                    width={80}
                                    height={80}
                                    style={{
                                        width: "50px",
                                        height: "auto",
                                    }}
                                />
                            </div>

                            <div className="col-span-3 font-bold pr-8">
                                <span>รถแบบไหนกันที่ทำ CYB ได้และไม่ได้</span>
                            </div>
                            
                            <div className="col-span-1 font-bold">
                                <span>10 Point</span>
                            </div>
                        </div>
                    </button>

                    <button className="flex items-center w-full text-left">
                        <div className="grid grid-cols-5 items-center w-full gap-1">
                            <div className="col-span-1">
                                <Image
                                    src="/images/gen/quiz-icon.png"
                                    alt="Quiz Icon"
                                    width={80}
                                    height={80}
                                    style={{
                                        width: "50px",
                                        height: "auto",
                                    }}
                                />
                            </div>

                            <div className="col-span-3 font-bold pr-8">
                                <span>Post test</span>
                            </div>
                            
                            <div className="col-span-1 font-bold">
                                <span>10 Point</span>
                            </div>
                        </div>
                    </button>

                </div>

            </div>

        </div>
    )
}

export default CYC;

CYC.getLayout = (page) => <AppLayout>{page}</AppLayout>
CYC.auth = true