import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import NewRules from "@/components/club/NewRules";
import ComingSoon from "@/components/club/ComingSoon";

export default function Club() {
  const [activeTab, setActiveTab] = useState("rules");

  const router = useRouter();

  useEffect(() => {
    const tab = router.query.tab || "rules";
    setActiveTab(tab);
  }, [router.query.tab]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
  }, []);

  return (
    <div className="pb-20 mt-2">
      {/* Header */}
      <div className="flex flex-col justify-center p-4 items-center w-full h-full">
        <Image
          src="/images/club/club-logo.png"
          alt="club-log"
          width={200}
          height={200}
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
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "rules"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("rules")}
          >
            กติกา
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "rules" && <NewRules />}
        {activeTab === "leaderboard" && <ComingSoon />}
        {activeTab === "hall-of-fame" && <ComingSoon />}
      </div>
    </div>
  );
}
