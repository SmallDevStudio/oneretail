"use client";
import { useState } from 'react';
import { AppLayout } from "@/themes";
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LeaderBoard() {
    const { data, error } = useSWR('/api/leaderboard', fetcher);
    const { data: usersData, error: usersError } = useSWR('/api/users/emp', fetcher);

    const [selectedTeam, setSelectedTeam] = useState("All");

    if (error || usersError) return <div>Failed to load</div>;
    if (!data || !usersData) return <div>Loading...</div>;

    const filterByTeam = (users, team) => {
        if (team === "All") return users;
        return users.filter(user => user.teamGrop === team);
    };

    const filteredUsers = filterByTeam(usersData.data, selectedTeam);
    const filteredPoints = data.data.filter(point => filteredUsers.some(user => user.userId === point.userId));
    
    const topThree = filteredPoints.slice(0, 3);
    const others = filteredPoints.slice(3);

    return (
        <div>
            <div className="flex justify-center mt-5">
                <h1 className="text-[35px] font-black text-[#0056FF]" style={{ fontFamily: "Ekachon" }}>Leaderboard</h1>
            </div>

            <div className="flex justify-center my-5">
                {["All", "Retail", "AL"].map(team => (
                    <button 
                        key={team} 
                        className={`p-2 mx-2 ${selectedTeam === team ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setSelectedTeam(team)}
                    >
                        {team}
                    </button>
                ))}
            </div>

            <div className="flex bg-[#0056FF] mb-5 p-5 justify-center">
                {topThree.length > 1 && (
                    <div className="flex flex-col items-center">
                        <span className="font-bold" style={{ fontSize: "12px" }}>{topThree[1].fullname}</span>
                        <span className="font-bold" style={{ fontSize: "22px" }}>{topThree[1].totalPoints}</span>
                        <span>#2</span>
                        {topThree[1].pictureUrl ? (
                            <Image 
                                src={topThree[1].pictureUrl} 
                                alt={topThree[1].fullname} 
                                width="50" 
                                height="50"
                                className="rounded-full border-3 border-[#0056FF] dark:border-white"
                            />
                        ) : (
                            <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                        )}
                    </div>
                )}
                {topThree.length > 0 && (
                    <div className="flex flex-col items-center mx-5">
                        <span className="font-bold" style={{ fontSize: "12px" }}>{topThree[0].fullname}</span>
                        <span className="font-bold" style={{ fontSize: "22px" }}>{topThree[0].totalPoints}</span>
                        <span>#1</span>
                        {topThree[0].pictureUrl ? (
                            <Image 
                                src={topThree[0].pictureUrl} 
                                alt={topThree[0].fullname} 
                                width="50" 
                                height="50"
                                className="rounded-full border-3 border-[#0056FF] dark:border-white"
                            />
                        ) : (
                            <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                        )}
                    </div>
                )}
                {topThree.length > 2 && (
                    <div className="flex flex-col items-center">
                        <span className="font-bold" style={{ fontSize: "12px" }}>{topThree[2].fullname}</span>
                        <span className="font-bold" style={{ fontSize: "22px" }}>{topThree[2].totalPoints}</span>
                        <span>#3</span>
                        {topThree[2].pictureUrl ? (
                            <Image 
                                src={topThree[2].pictureUrl} 
                                alt={topThree[2].fullname} 
                                width="50" 
                                height="50"
                                className="rounded-full border-3 border-[#0056FF] dark:border-white"
                            />
                        ) : (
                            <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                        )}
                    </div>
                )}
            </div>

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
                            <td>
                                {user.pictureUrl ? (
                                    <Image 
                                        src={user.pictureUrl} 
                                        alt={user.fullname} 
                                        width="50" 
                                        height="50"
                                    />
                                ) : (
                                    <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                                )}
                            </td>
                            <td>{user.fullname}</td>
                            <td>{user.totalPoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

LeaderBoard.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
}

LeaderBoard.auth = true;