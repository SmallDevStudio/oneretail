import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import CircularProgress from '@mui/material/CircularProgress';

const fetcher = (url) => fetch(url).then((res) => res.json());

const LeaderboardWidget = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");

    console.log(leaderboard);

    const { data, error: swrError } = useSWR("/api/dashboard/leaderboard", fetcher, {
        onSuccess: (data) => {
            setLeaderboard(data.data);
            setLoading(false);
        },
    });

    const filteredLeaderboard = leaderboard.filter(user => filter === "All" || user.teamGrop === filter);

    if (!data || !leaderboard) return <p>Loading...</p>;
    if (error || swrError) return <p>{error || swrError}</p>;

    return (
        <div className="p-2 bg-white rounded-2xl border-2 shadow-lg text-sm justify-center items-center">
            <div className="flex justify-center items-center">
                <div className="flex justify-space-around items-center mb-2">
                    {["All", "Retail", "AL"].map(team => (
                        <button
                            key={team}
                            className={`font-bold rounded-full ${filter === team ? "active" : ""} ${filter === team ? "bg-[#0056FF] text-white" : "bg-white text-black"}`}
                            onClick={() => setFilter(team)}
                            style={{
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                            }}
                        >
                            {team}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table className="w-full" style={{
                    borderCollapse: "collapse",
                    borderSpacing: "0",
                    border: "1px solid #0056FF",
                    borderRadius: "15px",
                }}>
                    <thead className="bg-[#0056FF] text-white">
                        <tr>
                            <th className="px-4 py-2">Rank</th>
                            <th className="px-4 py-2">Picture</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaderboard.slice(0, 10).map((user, index) => (
                            <tr key={user.userId}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">
                                    <Image src={user.pictureUrl} alt="user" width="30" height="30" style={{ borderRadius: "50%", objectFit: "cover", width: "30px", height: "30px" }}/>
                                </td>
                                <td className="border px-4 py-2">{user.fullname}</td>
                                <td className="border px-4 py-2 font-bold">{user.totalPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};


export default LeaderboardWidget;
