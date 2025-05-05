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
import moment from "moment";
import "moment/locale/th";
moment.locale("th");

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

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export default function NewLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("BM");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);

  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const { data, error, mutate } = useSWR("/api/club/newclub", fetcher, {
    onSuccess: (data) => {
      setLoading(false);
      setLeaderboard(data.data);
      const parsed = data.months.map((m) => {
        const [year, month] = m.split("-");
        return { year: +year, month: +month };
      });
      setAvailableMonths(parsed);
      // auto select latest
      const latest = parsed[parsed.length - 1];
      setSelectedMonth(latest?.month);
      setSelectedYear(latest?.year);
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

  const filteredLeaderboard = (leaderboard[activeTab] || []).filter(
    (item) => item.month === selectedMonth && item.year === selectedYear
  );

  const currentUserClub =
    (leaderboard[activeTab] || []).find(
      (item) =>
        item.empId === user.user?.empId &&
        item.month === selectedMonth &&
        item.year === selectedYear
    ) || null;

  const getPreviousRankMap = () => {
    const monthsSorted = [...availableMonths].sort((a, b) => {
      if (a.year === b.year) return a.month - b.month;
      return a.year - b.year;
    });

    const currentIndex = monthsSorted.findIndex(
      (m) => m.year === selectedYear && m.month === selectedMonth
    );
    const prevMonth = monthsSorted[currentIndex - 1];
    if (!prevMonth) return {};

    const prevData =
      (leaderboard[activeTab] || []).filter(
        (item) => item.month === prevMonth.month && item.year === prevMonth.year
      ) || [];

    const rankMap = {};
    prevData.forEach((item) => {
      rankMap[item.empId] = item.rank;
    });

    return rankMap;
  };

  const previousRankMap = getPreviousRankMap();

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
        {/* Month */}
        <div className="mt-2 flex gap-2 items-center">
          <span>เดือน</span>
          <select
            value={`${selectedYear}-${selectedMonth}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setSelectedYear(+year);
              setSelectedMonth(+month);
            }}
            className="px-2 py-1 outline-none"
          >
            {availableMonths.map((m, i) => (
              <option key={i} value={`${m.year}-${m.month}`}>
                {thaiMonths[m.month - 1]} {m.year}
              </option>
            ))}
          </select>
        </div>
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
          {filteredLeaderboard.map((item, index) => (
            <div
              key={item._id || index}
              className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
            >
              {/* Rank + empId + arrow */}
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center gap-1">
                  <span className="text-sm font-bold text-[#0056FF]">
                    {item.rank}
                  </span>
                  <span className="text-sm font-bold text-[#F2871F]">
                    {item.empId}
                  </span>
                  <span className="ml-1 whitespace-nowrap">
                    {(() => {
                      const prevRank = previousRankMap[item.empId];
                      if (prevRank === undefined) {
                        return (
                          <span className="text-xs text-blue-500 font-semibold">
                            🆕
                          </span>
                        );
                      } else if (prevRank > item.rank) {
                        return (
                          <span className="text-sm text-green-500 font-bold leading-none">
                            ▲
                          </span>
                        );
                      } else if (prevRank < item.rank) {
                        return (
                          <span className="text-sm text-red-500 font-bold leading-none">
                            ▼
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-sm text-yellow-500 font-bold leading-none">
                            –
                          </span>
                        );
                      }
                    })()}
                  </span>
                </div>
              </div>

              {/* Name + Info */}
              <div className="flex flex-col px-2">
                <span className="text-sm text-[#0056FF] font-bold truncate">
                  {item.name}
                </span>
                <div className="flex flex-row flex-wrap items-center gap-2 text-[10px] text-gray-500">
                  {item.region && <span>{item.region}</span>}
                  {item.zone && <span>{item.zone}</span>}
                  {item.team && <span>{item.team}</span>}
                </div>
              </div>

              {/* Percent */}
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm font-bold bg-[#0056FF] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                  {item.achieve ? item.achieve : item.kpi}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
