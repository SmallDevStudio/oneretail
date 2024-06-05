"use client";
import { AppLayout } from "@/themes";
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LeaderBoard() {
    const { data, error } = useSWR('/api/leaderboard', fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const topThree = data?.data?.slice(0, 3);
    const others = data?.data?.slice(3);

    return (
        <div className="flex flex-col w-full mb-20">
            <div>
                <div className="flex items-center text-center justify-center mt-5 w-full">
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1">
                        <h1 className="text-[35px] font-black text-[#0056FF]" style={{ fontFamily: "Ekachon", fontSmoothing: "auto", fontWeight: "black" }}>
                            Leaderboard
                        </h1>
                    </div>
                </div>

                <div className="flex bg-[#0056FF] mb-5 p-5 justify-center">
                    <ul className="flex flex-col items-center">
                        {topThree.length > 1 && (
                            <li key={topThree[1].userId} className="flex flex-col text-white text-center items-center">
                                <span className="font-bold" style={{ fontSize: "12px" }}>
                                    {topThree[1].fullname}
                                </span>
                                <span className="font-bold" style={{ fontSize: "22px" }}>
                                    {topThree[1].totalPoints}
                                </span>
                                <span>2</span>
                                {topThree[1].pictureUrl ? (
                                    <Image 
                                        src={topThree[1].pictureUrl} 
                                        alt={topThree[1].fullname} 
                                        width="60" 
                                        height="60"
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white"
                                    />
                                ) : (
                                    <div 
                                        style={{ width: '50px', height: '50px' }} 
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300"
                                    />
                                )}
                            </li>
                        )}
                    </ul>
                    
                    <ul className="flex flex-col items-center">
                        {topThree.length > 0 && (
                            <li key={topThree[0].userId} className="flex flex-col text-white text-center items-center">
                                <span className="font-bold" style={{ fontSize: "12px" }}>
                                    {topThree[0].fullname}
                                </span>
                                <span className="font-bold" style={{ fontSize: "22px" }}>
                                    {topThree[0].totalPoints}
                                </span>
                                <span>1</span>
                                {topThree[0].pictureUrl ? (
                                    <Image 
                                        src={topThree[0].pictureUrl} 
                                        alt={topThree[0].fullname} 
                                        width="80" 
                                        height="80"
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white mt-[-28px]"
                                    />
                                ) : (
                                    <div 
                                        style={{ width: '50px', height: '50px' }} 
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300"
                                    />
                                )}
                            </li>
                        )}
                    </ul>

                    <ul className="flex flex-col items-center">
                        {topThree.length > 2 && (
                            <li key={topThree[2].userId} className="flex flex-col text-white text-center items-center">
                                <span className="font-bold" style={{ fontSize: "12px" }}>
                                    {topThree[2].fullname}
                                </span>
                                <span className="font-bold" style={{ fontSize: "22px" }}>
                                    {topThree[2].totalPoints}
                                </span>
                                <span>3</span>
                                {topThree[2].pictureUrl ? (
                                    <Image 
                                        src={topThree[2].pictureUrl} 
                                        alt={topThree[2].fullname} 
                                        width="60" 
                                        height="60"
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white"
                                    />
                                ) : (
                                    <div 
                                        style={{ width: '50px', height: '50px' }} 
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300"
                                    />
                                )}
                            </li>
                        )}
                    </ul>
                </div>

                <div className="flex-row w-full p-2">
                    <div className="w-full">
                        {others.map((user, index) => (
                            <div key={user.userId} className="flex flex-row bg-white rounded-full shadow-md border-2 p-2.5 pz-2 px-2 m-5 space-x-10 justify-start">
                                <span className="text-[#0056FF] font-bold text-2xl ml-4">
                                    {index + 4}
                                </span>
                                <div>
                                    {user.pictureUrl ? (
                                        <Image 
                                            src={user.pictureUrl} 
                                            alt={user.fullname} 
                                            width="50" 
                                            height="50"
                                            className="rounded-full border-3 border-[#0056FF] dark:border-white"
                                        />
                                    ) : (
                                        <div 
                                            style={{ width: '50px', height: '50px' }} 
                                            className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300"
                                        />
                                    )}
                                </div>
                                <div className="text-left font-semibold text-[#0056FF] inline-block min-w-[100px]">
                                    {user.fullname}
                                </div>
                                <div className="font-semibold bg-[#0056FF] text-white h-6 w-16 text-center rounded-full inline-block mr-2">
                                    {user.totalPoints}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

LeaderBoard.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
}

LeaderBoard.auth = true;