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
  { name: "All", value: "All" },
  { name: "BBD", value: "Retail" },
  { name: "AL", value: "AL" },
  { name: "TCON", value: "TCON" },
  { name: "PB", value: "PB" },
];
export default function NewLeaderBoard() {
  const [group, setGroup] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [teamGrop, setTeamGrop] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [top3, setTop3] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  const leaderboardUrl =
    teamGrop === "All"
      ? "/api/newleaderboard"
      : `/api/newleaderboard?teamGrop=${teamGrop}`;

  const { data, error, mutate, isLoading } = useSWR(leaderboardUrl, fetcher, {
    onSuccess: (data) => {
      setLeaderboard(data.data.rank);
      if (userId) {
        const found = data.data.rank.find((item) => item.userId === userId);
        setCurrentUser(found);
      }
      if (data.data.rank?.length >= 3) {
        const reordered = [
          data.data.rank[1],
          data.data.rank[0],
          data.data.rank[2],
        ]; // 2 1 3
        setTop3(reordered);
      }
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [status, session]);

  useEffect(() => {
    if (data && data.data?.group) {
      const rhGroups = Object.entries(data.data.group)
        .filter(([groupName]) =>
          ["RH1", "RH2", "RH3", "RH4", "RH5"].includes(groupName)
        )
        .map(([groupName, users]) => ({
          name: groupName,
          users,
        }));

      setGroup(rhGroups);
    }
  }, [data]);

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
      setTeamGrop(router.query.tab);
    } else {
      setActiveTab("All");
      setTeamGrop("All");
      window.history.pushState(null, "", `?tab=All`);
    }
  }, [router.query.tab]);

  if (status === "loading") return <Loading />;
  if (isLoading || !data || !leaderboard) return <Loading />;

  const handleActiveTab = async (tab) => {
    setActiveTab(tab);
    setTeamGrop(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
    setIsFetching(true);

    const url =
      tab === "All"
        ? "/api/newleaderboard"
        : `/api/newleaderboard?teamGrop=${tab}`;

    await mutate(url);
    setIsFetching(false);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Header */}
      <div className="flex flex-col items-center justify-center w-full p-4">
        <h1
          className="text-3xl font-bold text-[#0056FF]"
          style={{ fontFamily: "Ekachon" }}
        >
          Leaderboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-col w-full">
        <ul className="flex flex-row items-center justify-between">
          {team.map((item, index) => (
            <li
              key={index}
              className={`px-6 py-1 rounded-t-lg ${
                teamGrop === item.value
                  ? "bg-[#0056FF] text-white font-bold"
                  : "bg-gray-200"
              }`}
              onClick={() => handleActiveTab(item.value)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Group */}
      <div className="bg-[#0056FF] px-2 py-4 rounded-b-xl text-white">
        <div className="flex justify-around items-end w-full">
          {(group.length > 0
            ? [...group].sort((a, b) => {
                const getNumber = (name) =>
                  parseInt(name.replace("RH", "")) || 0;
                return getNumber(a.name) - getNumber(b.name);
              })
            : top3
          ).map((item, idx) => {
            const user = group.length > 0 ? item.users[0] : item;
            const isCenter = !group.length && user.rank === 1;

            return (
              <div
                key={item.name || user.userId}
                className={`flex flex-col items-center justify-end transition-transform duration-300 ${
                  isCenter ? "scale-110" : "scale-100"
                } w-24`}
              >
                {/* อันดับหรือชื่อกลุ่ม */}
                <span className="text-sm font-bold mb-2 whitespace-nowrap">
                  {group.length > 0 ? item.name : `อันดับ ${user.rank}`}
                </span>

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                  <Avatar
                    src={user.pictureUrl}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                    userId={user.userId}
                    key={user.userId}
                  />
                </div>

                {/* Fullname: 2 lines fixed */}
                <span
                  className="text-[13px] font-semibold text-center leading-tight text-white mb-1 overflow-hidden text-ellipsis"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: "2.6em",
                  }}
                >
                  {user.fullname}
                </span>

                {/* Total Points */}
                <span className="font-bold text-lg">{user.totalPoints}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-4">
        {isFetching ? (
          <CircularProgress />
        ) : (
          <>
            {/* current user card */}
            {currentUser && (
              <div className="flex flex-row items-center justify-between px-4 py-2 border rounded-full bg-[#0056FF] mb-2 shadow">
                <div className="flex flex-row items-center space-x-4">
                  <span className="text-sm font-bold text-white">
                    {currentUser.rank}
                  </span>
                  <Avatar
                    src={currentUser.pictureUrl}
                    size={40}
                    userId={currentUser.userId}
                  />
                  <span className="text-sm font-semibold text-white">
                    {currentUser.fullname}
                  </span>
                </div>
                <span className="text-sm font-bold bg-[#F68B1F] text-white px-2 py-1 rounded-full">
                  {currentUser.totalPoints}
                </span>
              </div>
            )}

            {/* user card */}
            <div className="flex flex-col w-full px-2 py-2 gap-2">
              {leaderboard
                .filter((l) => (group.length === 0 ? l.rank > 3 : true))
                .map((l, lindex) => (
                  <div
                    key={lindex}
                    className="flex flex-row items-center justify-between px-2 py-1 border rounded-full bg-gray-100"
                  >
                    <div className="flex flex-row items-center space-x-4">
                      <span className="text-sm font-bold text-[#0056FF]">
                        {l.rank}
                      </span>
                      <Avatar
                        src={l.pictureUrl}
                        size={40}
                        userId={l.userId}
                        key={l.userId}
                      />
                    </div>
                    <span className="text-sm text-[#0056FF] font-bold">
                      {l.fullname}
                    </span>
                    <span className="text-sm font-bold bg-[#0056FF] text-white px-2 py-1 rounded-full">
                      {l.totalPoints}
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
