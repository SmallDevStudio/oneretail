import { useState, useEffect, useCallback } from "react";
import LeaderBoard from "@/components/club/Leaderboard";
import HallOfFamePage from "@/components/club/HallOfFame/HallOfFamePage";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Test() {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [type, setType] = useState("Grand%20Ambassador");
  const router = useRouter();

  useEffect(() => {
    const tab = router.query.tab || "leaderboard";
    setActiveTab(tab);
  }, [router.query.tab]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setType("Grand%20Ambassador");
    window.history.pushState(null, "", `?tab=${tab}`);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center bg-white p-4">
        <Image
          src="/images/club/club-logo.png"
          alt="club logo"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Tabs */}
      <div>
        <ul className="flex flex-row items-center justify-center flex-wrap gap-6">
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "hall-of-fame"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("hall-of-fame")}
          >
            Hall of Fame
          </li>
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "leaderboard"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("leaderboard")}
          >
            Leaderboard
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "hall-of-fame" && <HallOfFamePage typeData={type} />}
        {activeTab === "leaderboard" && (
          <LeaderBoard handleTabClick={handleTabClick} />
        )}
      </div>
    </div>
  );
}
