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
        <div>
            <div>
                <div className="flex items-center text-center justify-center mt-5 w-full">
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1">
                        <h1 className="text-[35px] font-black text-[#0056FF]" style={{ fontFamily: "Ekachon", fontSmoothing: "auto", fontWeight: "black" }}>
                            Leaderboard
                        </h1>
                    </div>
                </div>

                <ul className="flex bg-[#0056FF] mb-5 p-5">
                    {topThree.map((user, index) => (
                    <li key={user.userId} className="flex flex-col text-white text-center items-center">
                        <span className="font-bold" style={{ fontSize: "12px" }}>
                            {user.fullname}
                        </span>
                        <span className="font-bold" style={{ fontSize: "22px" }}>
                            {user.totalPoints}
                        </span>
                        <span>#{index + 1}</span>
                        <Image 
                            src={user.pictureUrl} 
                            alt={user.fullname} 
                            width="50" 
                            height="50"
                            className="rounded-full border-3 border-[#0056FF] dark:border-white"
                        />
                        
                    </li>
                    ))}
                </ul>

                <table className="flex-row w-full">
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Picture</th>
                        <th>Fullname</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {others.map((user, index) => (
                        <tr key={user.userId}>
                        <td>#{index + 4}</td>
                        <td><Image src={user.pictureUrl} alt={user.fullname} width="50" height="50"/></td>
                        <td>{user.fullname}</td>
                        <td>{user.totalPoints}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
  );
}

LeaderBoard.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
}

LeaderBoard.auth = true