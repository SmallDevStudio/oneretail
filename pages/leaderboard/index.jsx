"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LeaderBoard from "@/components/NewLeaderboard/Leaderboard";
import NewLeaderBoard from "@/components/NewLeaderboard/NewLeaderBoard";
import Divider from "@mui/material/Divider";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LeaderBoardPage() {
  const [activeTab, setActiveTab] = useState("newleaderboard");

  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("newleaderboard");
      window.history.pushState(null, "", `?tab=newleaderboard`);
    }
  }, [tab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="flex flex-row justify-center items-center p-4">
        <h2
          className="text-4xl font-bold text-[#0056FF]"
          style={{ fontFamily: "Ekachon" }}
        >
          Leaderboard
        </h2>
      </div>
      {/* Tabs */}
      <div className="flex flex-row justify-center items-center">
        <ul className="flex flex-row gap-4">
          <li
            className={`inline-block p-1 border-b-2 rounded-t-lg font-bold ${
              activeTab === "newleaderboard"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("newleaderboard")}
          >
            (BBD) Zone & Region
          </li>
          <li
            className={`inline-block p-1 border-b-2 rounded-t-lg font-bold ${
              activeTab === "leaderboard"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("leaderboard")}
          >
            BBD, AL, TCON
          </li>
        </ul>
      </div>
      <Divider flexItem sx={{ width: "100%", mt: 1 }} />
      <div>
        {activeTab === "leaderboard" && <LeaderBoard />}
        {activeTab === "newleaderboard" && <NewLeaderBoard />}
      </div>
    </div>
  );
}
