import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Avatar from "@/components/utils/Avatar";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewLeaderBoard() {
  const [expandedBranches, setExpandedBranches] = useState([]);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading } = useSWR("/api/newleaderboard", fetcher);

  if (status === "loading" || isLoading || !data) return <Loading />;

  const groupData = data.data.groupByRH;
  const branchData = data.data.branchSummary;

  const toggleBranch = (branchName) => {
    setExpandedBranches((prev) =>
      prev.includes(branchName)
        ? prev.filter((b) => b !== branchName)
        : [...prev, branchName]
    );
  };

  const customRankOrder = [4, 2, 1, 3, 5];
  const sortedGroupData = customRankOrder
    .map((targetRank) => groupData.find((g) => g.rank === targetRank))
    .filter(Boolean);

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="flex flex-col items-center justify-center w-full p-4">
        <h1 className="text-3xl font-bold text-[#0056FF]">Leaderboard</h1>
      </div>

      {/* Group By RH */}
      <div className="bg-[#0056FF] text-white px-4 py-4 rounded-b-xl">
        <div className="grid grid-cols-5 gap-4 text-center text-sm font-bold">
          {sortedGroupData.map((group) => (
            <div key={group.group} className="flex flex-col items-center">
              <span className="text-white">อันดับ {group.rank}</span>
              <span className="text-2xl font-bold">{group.group}</span>
              <span className="text-sm font-bold">{group.totalPoints}</span>
              <span className="text-[11px]">Users: {group.userCount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Leaderboard */}
      <div className="mt-4 px-2">
        {branchData.map((branch) => (
          <div
            key={branch.branch}
            className="mb-2 border rounded-md overflow-hidden shadow-sm"
          >
            <div
              className="flex justify-between items-center px-4 py-2 bg-gray-100 cursor-pointer"
              onClick={() => toggleBranch(branch.branch)}
            >
              <div className="flex flex-col text-sm">
                <span className="font-bold text-[#0056FF]">
                  อันดับ {branch.rank}: {branch.branch}
                </span>
                <span className="text-xs text-gray-600">
                  คะแนนรวม: {branch.totalPoints}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {expandedBranches.includes(branch.branch) ? "▲" : "▼"}
              </div>
            </div>

            {expandedBranches.includes(branch.branch) && (
              <div className="bg-white px-4 py-2">
                {branch.users.map((user) => (
                  <div
                    key={user.userId}
                    className="flex justify-between items-center border-b py-1"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#0056FF]">
                        {user.rank}
                      </span>
                      <Avatar
                        src={user.pictureUrl}
                        size={40}
                        userId={user.userId}
                      />
                      <span className="text-sm">{user.fullname}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {user.totalPoints}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
