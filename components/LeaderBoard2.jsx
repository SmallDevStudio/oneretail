import React, { useState } from "react";
import useSWR from 'swr';
import Image from 'next/image';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { RiInformationFill } from "react-icons/ri";
import InformationModal from "./InformationModal";

const fetcher = (url) => axios.get(url).then(res => res.data);

const LeaderBoard2 = ({ usersData, loggedInUserId }) => {
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const { data, error, isLoading } = useSWR('/api/leaderboard2', fetcher);

    if (isLoading) return <Loading />;
    if (!data) return <div>Error {error}</div>;

    const filterByTeam = (users, team) => {
        if (team === "All") return users;
        return users.filter(user => user.teamGrop === team);
    };

    const filteredUsers = filterByTeam(usersData.data, selectedTeam);
    const filteredPoints = data.data.filter(point => filteredUsers.some(user => user.userId === point.userId));
    
    const topThree = filteredPoints.slice(0, 3);
    const others = filteredPoints.slice(3);

    // Find the logged-in user's rank and data
    const loggedInUserRank = filteredPoints.findIndex(user => user.userId === loggedInUserId);
    const loggedInUser = filteredPoints[loggedInUserRank];

    // Remove the logged-in user from the others list if they are not in the top 3 and not in others
    if (loggedInUserRank > 2) {
        others.splice(loggedInUserRank - 3, 1);
    }

    const handleClick = () => {
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row w-full items-center justify-center gap-1">
                <span className="text-2xl font-bold text-center text-[#F68B1F]">ภารกิจพิชิตหัวตาราง</span>
                <RiInformationFill className="text-[#F68B1F]/70" size={18} 
                    onClick={() => handleClick()}
                />
            </div>
            <div className="relative bg-yellow-600/70 min-h-[30vh] rounded-b-2xl p-2 shadow-lg">
                <div className="flex justify-center">
                    {["All", "Retail", "AL", "TCON", "PB"].map(team => (
                        <button 
                            key={team} 
                            className={`p-2 mx-2 ${selectedTeam === team ? 'bg-[#F68B1F] text-white' : 'bg-gray-200'} w-20 text-center justify-center rounded-full mt-2 font-bold text-[#0056FF]`}
                            onClick={() => setSelectedTeam(team)}
                        >
                            {team}
                        </button>
                    ))}
                </div>

                <div className="flex mb-5 p-5 justify-center text-white min-w-[100px]">
                    {topThree.length > 1 && (
                        <div className="flex flex-col items-center mt-5">
                            <span className="font-bold truncate" style={{ fontSize: "12px" }}>{topThree[1].fullname}</span>
                            <span className="font-bold mb-4" style={{ fontSize: "22px" }}>{topThree[1].totalPoints}</span>
                            <div className="relative justify-center items-center text-center w-full ml-10">
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
                                <Image src={"/images/leaderboard/2.svg"} alt="Medal" width="100" height="100" 
                                className="" style={{ 
                                    width: '90px', 
                                    height: '90px',
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '-20px',
                                    }} 
                                />
                            </div>
                        </div>
                    )}
                    {topThree.length > 0 && (
                        <div className="flex flex-col items-center mx-3 mt-[-15px] min-w-[100px]">
                            <span className="font-bold text-sm truncate" style={{ fontSize: "12px" }}>{topThree[0].fullname}</span>
                            <span className="font-bold text-md mb-2" style={{ fontSize: "22px" }}>{topThree[0].totalPoints}</span>
                            <div className="relative justify-center items-center text-center w-full">
                            {topThree[0].pictureUrl ? (
                                <Image 
                                    src={topThree[0].pictureUrl} 
                                    alt={topThree[0].fullname} 
                                    width="70" 
                                    height="70"
                                    className="relative rounded-full border-3 border-[#0056FF] dark:border-white ml-3 mt-2"
                                />
                            ) : (
                                <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                            )}
                            <Image src={"/images/leaderboard/1.svg"} alt="Medal" width="150" height="150" 
                                className="" style={{ 
                                    width: '120px',
                                    height: '120px',
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '0',
                                    transition: 'all 0.5s ease'
                                    }} 
                                />
                            </div>
                        </div>
                    )}
                    {topThree.length > 2 && (
                        <div className="flex flex-col items-center mt-5 min-w-[100px]">
                            <span className="font-bold truncate" style={{ fontSize: "12px" }}>{topThree[2].fullname}</span>
                            <span className="font-bold" style={{ fontSize: "22px" }}>{topThree[2].totalPoints}</span>
                            <div className="relative justify-center items-center text-center w-full">
                            {topThree[2].pictureUrl ? (
                                <Image 
                                    src={topThree[2].pictureUrl} 
                                    alt={topThree[2].fullname} 
                                    width="50" 
                                    height="50"
                                    className="relative rounded-full border-3 border-[#0056FF] mt-4 ml-7"
                                />
                            ) : (
                                <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                            )}
                                <Image src={"/images/leaderboard/3.svg"} alt="Medal" width="100" height="100" 
                                className="relative" style={{ 
                                    width: '90px', 
                                    height: '90px',
                                    position: 'absolute',
                                    top: '-5px',
                                    left: '7px',
                                    }} 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <table className="flex w-full p-2">
                <div className="flex flex-col w-full">
                    {loggedInUserRank > 2 && loggedInUser && (
                        <tr key={loggedInUser.userId} className='flex w-full p-2 text-[#0056FF]'>
                            <div className="flex w-full border-2 p-2 rounded-full border-[#F68B1F]/60 items-center">
                            <td className="w-10 ml-2">
                                <span className="font-bold">{loggedInUserRank + 1}</span>
                            </td>
                            <td className="w-20 h-15 ml-2">
                                {loggedInUser.pictureUrl ? (
                                    <Image 
                                        src={loggedInUser.pictureUrl} 
                                        alt={loggedInUser.fullname} 
                                        width="50" 
                                        height="50"
                                        className="rounded-full border-3 border-[#0056FF] dark:border-white"
                                    />
                                ) : (
                                    <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                                )}
                            </td>
                            <td className="w-full ml-2">
                                <span className="font-bold text-md truncate">{loggedInUser.fullname}</span>
                            </td>
                            <td className="flex w-25 justify-end items-center align-middle mr-2">
                                <span className="font-bold bg-[#0056FF] rounded-full p-1 w-20 h-6 text-center text-white text-sm">
                                    {loggedInUser.totalPoints}
                                </span>
                            </td>
                            </div>
                        </tr>
                    )}
                    {others.map((user, index) => {
                        const displayRank = index + 4 + (loggedInUserRank > 2 && index >= loggedInUserRank - 3 ? 1 : 0);
                        return (
                            <tr key={user.userId} className='flex w-full p-2 text-[#0056FF]'>
                                <div className="flex w-full border-2 p-2 rounded-full border-[#F68B1F]/60 items-center bg-yellow-700/20">
                                <td className="w-10 ml-2">
                                    <span className="font-bold">{displayRank}</span>
                                </td>
                                <td className="w-20 h-15 ml-2">
                                    {user.pictureUrl ? (
                                        <Image 
                                            src={user.pictureUrl} 
                                            alt={user.fullname} 
                                            width="50" 
                                            height="50"
                                            className="rounded-full border-3 border-[#0056FF] dark:border-white"
                                        />
                                    ) : (
                                        <div className="rounded-full border-3 border-[#0056FF] dark:border-white bg-gray-300" style={{ width: '50px', height: '50px' }} />
                                    )}
                                </td>
                                <td className="w-full ml-2">
                                    <span className="font-bold text-md truncate">{user.fullname}</span>
                                </td>
                                <td className="flex w-25 justify-end items-center align-middle mr-2">
                                    <span className="font-bold bg-[#0056FF] rounded-full p-1 w-20 h-6 text-center text-white text-sm">
                                        {user.totalPoints}
                                    </span>
                                </td>
                                </div>
                            </tr>
                        );
                    })}
                </div>
            </table>
            <InformationModal 
                isOpen={showModal} 
                onRequestClose={handleClose}
                className="z-50"
                style={{ zIndex: 50 }}
            />
        </div>
    );
};

export default LeaderBoard2;