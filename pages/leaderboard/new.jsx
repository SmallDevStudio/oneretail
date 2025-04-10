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
  { name: "RH1", value: "RH1" },
  { name: "RH2", value: "RH2" },
  { name: "RH3", value: "RH3" },
  { name: "RH4", value: "RH4" },
  { name: "RH5", value: "RH5" },
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

  const { data, error, mutate, isLoading } = useSWR(
    "/api/newleaderboard",
    fetcher,
    {
      onSuccess: (data) => {
        if (!data?.data?.group) return;

        // รวม user จากทุก group
        const allUsers = Object.values(data.data.group).flat();

        // จัดเรียงใหม่โดย totalPoints มากไปน้อย
        const sorted = [...allUsers].sort(
          (a, b) => b.totalPoints - a.totalPoints
        );

        // เพิ่ม rank ใหม่
        const ranked = sorted.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setLeaderboard(ranked); // ✅ ใช้ใน tab "All"
        setCurrentUser(ranked.find((u) => u.userId === userId) || null);

        // สร้าง top3 แบบ 2-1-3
        if (ranked.length >= 3) {
          setTop3([ranked[1], ranked[0], ranked[2]]);
        }

        // เซ็ต group RH1–RH5 เหมือนเดิม
        const rhGroups = Object.entries(data.data.group)
          .filter(([groupName]) =>
            ["RH1", "RH2", "RH3", "RH4", "RH5"].includes(groupName)
          )
          .map(([groupName, users]) => ({
            name: groupName,
            users,
          }));
        setGroup(rhGroups);
      },
    }
  );

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
    } else {
      setActiveTab("All");
      window.history.pushState(null, "", `?tab=All`);
    }
  }, [router.query.tab]);

  if (status === "loading") return <Loading />;
  if (isLoading || !data) return <Loading />;

  const handleActiveTab = async (tab) => {
    setActiveTab(tab);
    setTeamGrop(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
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
              className={`px-4 py-1 rounded-t-lg ${
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
        {activeTab === "All" ? (
          <div className="bg-[#0056FF] px-2 py-4 rounded-b-xl text-white">
            <div className="grid grid-cols-5 gap-1 w-full">
              {[4, 2, 1, 3, 5]
                .map((targetRank) =>
                  leaderboard.find((u) => u.rank === targetRank)
                )
                .filter(Boolean)
                .map((user) => (
                  <div
                    key={user.userId}
                    className={`flex flex-col items-center justify-end transition-transform duration-300 ${
                      user.rank === 1 ? "scale-105" : ""
                    }`}
                  >
                    <span className="text-xs font-bold whitespace-nowrap mb-1">
                      อันดับ {user.rank}
                    </span>
                    <span className="text-[11px] text-white font-light mb-2 text-center">
                      {user.emp?.group || "-"}
                    </span>

                    <div className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                      <Avatar
                        src={user.pictureUrl}
                        alt={user.fullname}
                        className="w-full h-full object-cover"
                        userId={user.userId}
                        key={user.userId}
                      />
                    </div>

                    <span
                      className="text-[11px] font-semibold text-center leading-tight text-white mb-1 overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "2.4em",
                      }}
                    >
                      {user.fullname}
                    </span>

                    <span className="font-bold text-sm">
                      {user.totalPoints}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-around items-end w-full">
            {group
              .find((g) => g.name === activeTab)
              ?.users.slice(0, 5)
              .sort((a, b) => {
                const customOrder = [4, 2, 1, 3, 5];
                return (
                  customOrder.indexOf(a.rank) - customOrder.indexOf(b.rank)
                );
              })
              .map((user) => (
                <div
                  key={user.userId}
                  className={`flex flex-col items-center justify-end w-24 ${
                    user.rank === 1 ? "scale-110" : ""
                  } transition-transform duration-300`}
                >
                  <span className="text-sm font-bold mb-2 whitespace-nowrap">
                    อันดับ {user.rank}
                  </span>
                  <div className="w-16 h-16 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                    <Avatar
                      src={user.pictureUrl}
                      alt={user.fullname}
                      className="w-full h-full object-cover"
                      userId={user.userId}
                      key={user.userId}
                    />
                  </div>
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
                  <span className="font-bold text-lg">{user.totalPoints}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="mt-4">
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

        <div className="flex flex-col w-full px-2 py-2 gap-2">
          {(activeTab === "All"
            ? leaderboard
            : group.find((g) => g.name === activeTab)?.users || []
          )
            .filter((u) => u.rank > 5)
            .map((u) => (
              <div
                key={u.userId}
                className="flex flex-row items-center justify-between px-2 py-1 border rounded-full bg-gray-100"
              >
                <div className="flex flex-row items-center space-x-4">
                  <span className="text-sm font-bold text-[#0056FF]">
                    {u.rank}
                  </span>
                  <Avatar src={u.pictureUrl} size={40} userId={u.userId} />
                </div>
                <span className="text-sm text-[#0056FF] font-bold">
                  {u.fullname}
                </span>
                <span className="text-sm font-bold bg-[#0056FF] text-white px-2 py-1 rounded-full">
                  {u.totalPoints}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
