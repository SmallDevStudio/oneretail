import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";
moment.locale("th");
import Avatar from "../utils/Avatar";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const position = [
  { name: "BM", value: "BM" },
  { name: "CLSM", value: "CLSM" },
  { name: "CLSA", value: "CLSA" },
  { name: "CFSA", value: "CFSA" },
  { name: "CISA", value: "CISA" },
  { name: "CFSA", value: "CFSA" },
  { name: "CFSA_YINDEE ", value: "CFSA_YINDEE" },
  { name: "WCRM", value: "WCRM" },
  { name: "PBCRM", value: "PBCRM" },
  { name: "EWS", value: "EWS" },
  { name: "MDS", value: "MDS" },
  { name: "MAL", value: "MAL" },
  { name: "CISAL", value: "CISAL" },
  { name: "AL_GH", value: "AL GH" },
  { name: "NC_MKT", value: "NC MKT" },
  { name: "UC_MKT", value: "UC MKT" },
];

const thaiMonths = [
  { name: "มกราคม", value: 1 },
  { name: "กุมภาพันธ์", value: 2 },
  { name: "มีนาคม", value: 3 },
  { name: "เมษายน", value: 4 },
  { name: "พฤษภาคม", value: 5 },
  { name: "มิถุนายน", value: 6 },
  { name: "กรกฎาคม", value: 7 },
  { name: "สิงหาคม", value: 8 },
  { name: "กันยายน", value: 9 },
  { name: "ตุลาคม", value: 10 },
  { name: "พฤศจิกายน", value: 11 },
  { name: "ธันวาคม", value: 12 },
];

export default function ClubLeaderboard({ handleTabClick }) {
  const [leaderboard, setLeaderboard] = useState({});
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("BM");
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data, error } = useSWR(
    selectedMonth && selectedYear
      ? `/api/club/hall-of-fame/leaderboard?month=${selectedMonth}&year=${selectedYear}`
      : null,
    fetcher,
    {
      onSuccess: (data) => {
        setLeaderboard(data.data);

        const parsed = (data.months || []).map((m) => {
          const [year, month] = m.split("-");
          return { year: +year, month: +month };
        });

        parsed.sort((a, b) =>
          a.year === b.year ? b.month - a.month : b.year - a.year
        );

        setAvailableMonths(parsed);

        if (!selectedMonth || !selectedYear) {
          setSelectedYear(parsed[0]?.year);
          setSelectedMonth(parsed[0]?.month);
        }
      },
    }
  );

  const getCurrentUserData = () => {
    for (const rewardKey in leaderboard) {
      const reward = leaderboard[rewardKey];
      for (const pos in reward.positions) {
        const found = reward.positions[pos].find(
          (u) => u.empId === session?.user?.empId
        );
        if (found) return found;
      }
    }
    return null;
  };

  const currentUser = getCurrentUserData();

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (rewardtype) => {
    if (!rewardtype) return;
    const encode = encodeURIComponent(rewardtype);
    router.push(`/club/hall-of-fame?type=${encode}`);
  };

  if (!leaderboard || status === "loading" || !session) return <Loading />;

  return (
    <div className="flex flex-col w-full pb-20 bg-gray-200">
      <div className="flex flex-col items-center justify-center bg-white w-full">
        <h1 className="text-3xl font-bold text-[#0056FF]">Leaderboard</h1>
        {/* selected month & year */}
        {availableMonths.length > 0 && (
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
                  {moment(`${m.year}-${m.month}-01`).format("MMMM YYYY")}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-row p-4 bg-white gap-4 overflow-x-auto">
        {position.map((p, i) => (
          <div
            key={i}
            className="cursor-pointer"
            onClick={() => handleActiveTab(p.value)}
          >
            <div
              className={`px-4 py-1 rounded-full ${
                activeTab === p.value
                  ? "bg-[#0056FF] text-white"
                  : "bg-gray-200"
              }`}
            >
              {p.name}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-6">
        {Object.entries(leaderboard).map(([rewardKey, rewardData]) => {
          const posUsers = rewardData.positions[activeTab] || [];
          if (!posUsers.length) return null;

          return (
            <div
              key={rewardKey}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                {rewardData.badge.image && (
                  <Image
                    src={rewardData.badge.image}
                    alt={rewardData.badge.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
                <h2 className="text-xl font-bold">
                  {rewardData.badge.name || rewardKey}
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {posUsers.map((user, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 border rounded-full bg-gray-50"
                    onClick={() => handleTabClick("hall-of-fame", rewardKey)}
                  >
                    <div className="flex items-center gap-1">
                      {/* <div className="font-bold text-blue-600">{user.rank}</div> */}
                      <Avatar
                        key={user.empId}
                        src={user.user?.pictureUrl}
                        size={40}
                        userId={user.userId}
                      />
                    </div>
                    <div className="flex flex-col ml-4">
                      <span className="font-semibold text-gray-800 text-sm">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.empId}
                      </span>
                    </div>
                    <div className="text-sm font-bold bg-yellow-400 px-2 py-0.5 rounded-full">
                      {user.achieve}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
