"use client"
import { useEffect, useState } from "react";
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
import { IoEyeSharp } from "react-icons/io5";
import Loading from "@/components/Loading";
import ModalPersonalized from "@/components/ModalPersonalized";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const PersonalizedID = () => {
    const [score, setScore] = useState(0);
    const [PersonalizedData, setPersonalizedData] = useState([]);
    const [contents, setContents] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
    const { id } = router.query;

    const LineProgressBar = dynamic(() => import("@/components/GenLineProgressBar"), { ssr: false });

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
    const { data: pretest, error: pretestError, isLoading: pretestLoading } = useSWR(`/api/personal/pretest/${userId}?contentGenId=${id}`, fetcher);
    const { data: posttest, error: posttestError, isLoading: posttestLoading } = useSWR(`/api/personal/posttest/${userId}?contentGenId=${id}`, fetcher);

    useEffect(() => {
        setLoading(true);
            const fetchPersonalizedData = async () => {
                try {
                    const res = await axios.get(`/api/personalized/contents?id=${id}`);
                    setPersonalizedData(res.data.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchPersonalizedData();
            setLoading(false);
    }, [id]);

    useEffect(() => {
        setLoading(true);
        if (userId) {
            const fetchContents = async () => {
                try {
                    const res = await axios.get(`/api/personal/content/${userId}?contentGenId=${id}`);
                    setContents(res.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchContents();
            setLoading(false);
        } else {
            return;
        }
    }, [id, userId]);

    useEffect(() => {
        let newScore = 0;
      
        // เช็ค pretest ถ้ามี data ให้เพิ่ม score เป็น 1
        if (pretest?.data) {
          newScore += 1;
        }
      
        // เช็ค contents ถ้ามี data ให้เพิ่ม score ตามจำนวน content.data.length
        if (contents?.data) {
          newScore += contents.data.length;
        }
      
        // เช็ค posttest ถ้ามี data ให้เพิ่ม score เป็น 1
        if (posttest?.data) {
          newScore += 1;
        }
      
        // อัพเดทค่า score
        setScore(newScore);
    }, [pretest, contents, posttest]); // รัน effect เมื่อค่าเหล่านี้เปลี่ยนแปลง

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        router.push('/main');
    }

    if ( pretestLoading || posttestLoading || loading ) return <Loading />;
    if (!PersonalizedData || !contents) return <Loading />;
    if (userError) return <div>Error loading user data</div>;
    if (pretestError) return <div>Error loading pretest data</div>;
    if (posttestError) return <div>Error loading posttest data</div>;

    const total = PersonalizedData?.contents?.length + 2;
    const percentage = (score / total) * 100;
    
    return (
        <div className="flex flex-col min-h-[80vh] mb-20">
            <div className="flex flex-col px-4 mt-5">
                <div className="flex flex-row items-center gap-4 w-full">
                    <IoIosArrowBack 
                        className="text-xl inline text-gray-700"
                        onClick={() => router.back()}
                    />
                    <span className="text-lg font-bold text-[#0056FF]">{PersonalizedData?.name}</span>
                </div>
            </div>
            {/* User Panel */}
            <div className="flex flex-row justify-evenly items-center px-8 mt-4 gap-4 w-full">
                <div className="flex w-[120px]">
                    <Image
                        src={user?.user?.pictureUrl}
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
                    <span className='text-xl text-[#0056FF] font-bold'>{user?.user?.fullname}</span>
                    <span className='text-xl text-[#F2871F] font-bold'>{user?.user?.position}</span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col px-8 mt-5">

                <Divider className="mb-1 border-[#0056FF]"/>
                {/* progress bar */}
                <div className="flex flex-row items-center w-full gap-2 mb-2 mt-2">
                    <span className="text-sm font-bold text-gray-400">Progress</span>
                    <div className="flex flex-col w-full">
                        <LineProgressBar percent={percentage} />
                    </div>
                    <span className="text-sm text-gray-400">
                        {score}/{PersonalizedData?.contents?.length + 2}</span>
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
                        <span className="text-sm text-gray-700">: {PersonalizedData?.contents?.length} Video</span>
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
                    <button 
                        className="flex items-center w-full text-left"
                        onClick={() => router.push(`/personalized/pretest?id=${PersonalizedData._id}`)}
                        disabled={pretest?.data === null ? false : true}
                    >
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
                    {PersonalizedData.contentsData?.map((content, index) => (
                        <div key={index}>
                            <button 
                                className="flex items-center w-full text-left"
                                onClick={() => router.push(`/personalized/content/${content._id}?contentGenId=${PersonalizedData._id}`)}
                                disabled={contents.data?.some(item => item.contentId === content._id) ? true : false}
                            >
                                <div className="grid grid-cols-5 items-center w-full gap-1">
                                    <div className="relative flex items-center col-span-1">
                                        <Image
                                            src="/images/gen/video-icon.png"
                                            alt="Quiz Icon"
                                            width={80}
                                            height={80}
                                            style={{
                                                width: "50px",
                                                height: "auto",
                                                filter: `${pretest.data ? '' : 'grayscale(100%)'}`,
                                            }}
                                        />

                                        {contents.data?.some(item => item.contentId === content._id) && (
                                            <IoEyeSharp 
                                                size={20} 
                                                className="absolute top-[31px] left-7 text-[#F2871F]"
                                            />
                                        )}

                                    </div>

                                    <div className="col-span-3 font-bold pr-8">
                                        <span>{content.title}</span>
                                    </div>
                                    
                                    <div className="col-span-1 font-bold">
                                        <span>10 Point</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}

                    <button 
                        className="flex items-center w-full text-left"
                        disabled={contents.data?.length !== PersonalizedData?.contents?.length ? true : 
                            posttest?.data?.finished ? true : false
                        }
                        onClick={() => router.push(`/personalized/posttest?id=${PersonalizedData._id}`)}
                    >
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
                                        filter: `${PersonalizedData?.contents?.length === contents.data?.length ? '' : 'grayscale(100%)'}`,
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
                {posttest?.data?.finished && (
                    <ModalPersonalized
                        open={open}
                        onClose={handleClose}
                        title="Congratulations!"
                        description="คุณได้ทำข้อสอบถูกทุกข้อแล้ว"
                    >
                        <div
                            className="flex flex-col gap-2 w-full" 
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: "url('/images/bg.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                padding: "5px",
                            }}>
                                <div className="flex flex-col justify-center items-center gap-2 bg-white/80 p-2.5 w-full">
                                    <h1 className="text-3xl font-bold">Congratulations!</h1>
                                    <p className="text-md font-bold">ยินดีด้วยคุณได้ผ่านการทดสอบแล้ว</p>
                                    <p className="text-md">คุณได้ Point ทั้งหมด <span className="text-[#F2871F] text-lg font-bold">{total *10} </span> Point</p>
                                    <div className="flex justify-center items-center mt-4">
                                        <button
                                            onClick={() => router.push('/main')}
                                            className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            กลับไปหน้าหลัก
                                        </button>
                                    </div>
                                </div>
                        </div>
                    </ModalPersonalized>
                    )}
        </div>
    )
}

export default PersonalizedID;

PersonalizedID.getLayout = (page) => <AppLayout>{page}</AppLayout>
PersonalizedID.auth = true