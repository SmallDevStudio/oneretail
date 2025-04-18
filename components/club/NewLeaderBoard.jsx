import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "@/components/utils/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const team = [
  { name: "BM", value: "BM" },
  { name: "CLSM", value: "CLSM" },
  { name: "CLSA", value: "CLSA" },
  { name: "CFSA", value: "CFSA" },
  { name: "CISA", value: "CISA" },
  { name: "WB", value: "WB" },
  { name: "PB", value: "PB" },
  { name: "RPB", value: "RPB" },
  { name: "MDS", value: "MDS" },
  { name: "MAL", value: "MAL" },
  { name: "GH", value: "GH" },
  { name: "NC", value: "NC" },
  { name: "UC", value: "UC" },
];

export default function NewLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("BM");
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const { data, error, mutate } = useSWR("/api/club/newclub", fetcher, {
    onSuccess: (data) => {
      setLoading(false);
      setLeaderboard(data.data);
    },
  });

  const { data: user, error: userError } = useSWR(
    () => (userId ? `/api/users/${userId}` : null),
    fetcher
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
    if (!user) return;
  }, [status, session, user]);

  const handleActiveTab = async (tab) => {
    setActiveTab(tab);
  };

  const currentUserClub =
    leaderboard[activeTab]?.find((item) => item.empId === user.user?.empId) ||
    null;

  if (loading || !leaderboard || !user) return <Loading />;

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Header */}
      <div className="flex flex-col items-center justify-center w-full">
        <h1
          className="text-3xl font-bold text-[#0056FF]"
          style={{ fontFamily: "Ekachon" }}
        >
          Leaderboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-row px-2 py-1 mt-2 overflow-auto scroll-none w-full">
        <ul className="flex flex-row items-center justify-center gap-2">
          {team.map((team) => (
            <li
              key={team.value}
              className={`inline-block px-4 py-0.5 rounded-full font-bold ${
                activeTab === team.value
                  ? "bg-[#0056FF] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={() => handleActiveTab(team.value)}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>

      {/*corrent user*/}

      {currentUserClub && (
        <div className="p-2 my-2">
          <div className="grid grid-cols-5 items-center px-4 py-2 mb-2 border rounded-full bg-[#0056FF] text-white shadow">
            <div className="flex flex-row items-center gap-3">
              <span className="text-sm font-bold">{currentUserClub.rank}</span>
              <span className="text-sm font-bold">{currentUserClub.empId}</span>
            </div>
            <div className="flex flex-col col-span-3">
              <span className="text-sm font-bold">{currentUserClub.name}</span>
              <div className="flex flex-row flex-wrap items-center gap-2 text-[10px] text-white">
                {currentUserClub.region && (
                  <span>{currentUserClub.region}</span>
                )}
                {currentUserClub.branch && (
                  <span>{currentUserClub.branch}</span>
                )}
                {currentUserClub.zone && <span>{currentUserClub.zone}</span>}
                {currentUserClub.team && <span>{currentUserClub.team}</span>}
              </div>
            </div>
            <span className="flex items-center justify-center text-sm font-bold bg-[#F2871F] px-2 py-0.5 rounded-full">
              {currentUserClub.achieve ?? currentUserClub.kpi}
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-4">
        {/* Leaderboard */}
        <div className="flex flex-col w-full px-2 py-2 gap-2">
          {(leaderboard[activeTab] || []).map((item, index) => (
            <div
              key={item._id || index}
              className="grid grid-cols-5 items-center px-4 py-1 border rounded-full bg-gray-100"
            >
              <div className="flex flex-row items-center gap-3">
                <span className="text-sm font-bold text-[#0056FF]">
                  {item.rank}
                </span>
                <span className="text-sm font-bold text-[#F2871F]">
                  {item.empId}
                </span>
              </div>
              <div className="flex flex-col col-span-3">
                <span className="text-sm text-[#0056FF] font-bold ">
                  {item.name}
                </span>
                <div className="flex flex-row flex-wrap items-center gap-2 text-[10px] text-gray-500">
                  {item.region && <span>{item.region}</span>}
                  {item.branch && <span>{item.branch}</span>}
                  {item.zone && <span>{item.zone}</span>}
                  {item.team && <span>{item.team}</span>}
                </div>
              </div>
              <span className="flex items-center justify-center text-sm font-bold bg-[#0056FF] text-white px-2 py-0.5 rounded-full">
                {item.achieve ? item.achieve : item.kpi}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
