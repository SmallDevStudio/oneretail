import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { AppLayout } from "@/themes";
import ReactPlayer from "react-player";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "@/components/Loading";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Content = () => {
    const [countdown, setCountdown] = useState(0);
    const [seen60Percent, setSeen60Percent] = useState(false);
    const [completed, setCompleted] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { id, contentGenId } = router.query;
    const playerRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
          if (playerRef.current) {
            const duration = playerRef.current.getDuration();
            const playedSeconds = playerRef.current.getCurrentTime();
            const remainingTime = Math.max(duration - playedSeconds, 0);
            setCountdown(remainingTime);
          }
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);

    const { data, error } = useSWR(`/api/content/${id}`, fetcher);

    if (error) return <div>{error}</div>;
    if (!data) return <Loading />;

    const handleProgress = async (state) => {
        const duration = playerRef.current.getDuration();
        const viewed = state.playedSeconds;
    
        if (viewed / duration >= 0.6 && !seen60Percent) {
          await axios.post('/api/views/update', { contentId: data.data._id, userId });
          setSeen60Percent(true); // set a flag to avoid multiple calls
        };
    
        if (viewed >= duration - 2 && !completed) { // Check if the video is almost complete
            setCompleted(true);
            await axios.post('/api/personal/content', { 
                userId, 
                contentGenId,
                contentId: data.data._id 
            });
            await axios.post('/api/points/earn', {
                userId,
                description: `views video ${data.data._id}`,
                contentId: data.data._id,
                path: 'personalized',
                subpath: 'content',
                type: 'earn',
                points: 10,
            });
        };

        if (completed) {
            setCountdown(0);
            setSeen60Percent(false);
            setCompleted(false);
            router.back();
        };
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
    <div className="flex flex-col items-center">
        <div className="flex flex-row items-center w-full py-4 px-2">
            <IoIosArrowBack 
                onClick={() => router.back()} 
                className="text-xl text-gray-700 font-bold" 
                size={25}
            />
            <span className="text-lg font-bold text-[#0056FF] ml-2">
                {data.data.title}
            </span>
        </div>
        <div className="w-full">
            <div className="justify-center flex min-w-[100vw]">
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${data.data.slug}&modestbranding=1&rel=0`}
                loop={false}
                width="100%"
                height="250px"
                playing={true}
                ref={playerRef}
                onProgress={handleProgress}
            />
            </div>
            <div className="flex flex-col p-4 w-full mt-[-15px]">
            <div className="flex flex-row text-left items-center justify-between w-full text-sm font-bold text-[#0056FF]">
                <div className="relative h-6 w-20 rounded-full">
                <span className="relative inline-flex items-center justify-center px-2 gap-2">
                    <Image 
                        src="/images/other/clock-01.svg" 
                        alt="clock" 
                        width={15} 
                        height={15} 
                    />
                    {formatTime(countdown)}
                </span>
                </div>
                <div className="flex flex-row">
                <span className="flex ">ดูจบ </span>
                <span className="flex text-lg ml-1">
                    <Image 
                        src="/images/other/clock-01.svg" 
                        alt="clock" 
                        width={15} 
                        height={15} 
                    />
                </span>
                <span className="flex ml-1">+ {10} Point</span>
                </div>
            </div>
            <div className="flex flex-col text-left mb-2">
                <span className="text-[15px] font-bold text-[#0056FF]">
                    {data?.data?.title}
                </span>
                <span className="text-[12px] font-light text-black">
                    {moment(data?.data?.createdAt).format('lll')}
                </span>
            </div>
            <div className="inline-block text-left text-[13px] font-light">
                {data?.data?.description}
            </div>
            </div>
        </div>
    </div>
    );
};

export default Content;

Content.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Content.auth = true;

