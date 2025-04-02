import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/themes/Layout/AppLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import Announce from "@/components/club/Announce";
import LeaderBoard from "@/components/club/Leaderboard";
import Rules from "@/components/club/Rules";
import Experience from "@/components/club/Experience";

export default function Club() {
  const [activeTab, setActiveTab] = useState("experience");

  const router = useRouter();

  useEffect(() => {
    const tab = router.query.tab || "experience";
    setActiveTab(tab);
  }, [router.query.tab]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-[100vh]">
      <div>
        <Image
          src={"/images/coming-soon.jpg"}
          alt="Leaderboard"
          width={500}
          height={500}
          className="object-contain"
          loading="lazy"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <h1 className="text-3xl font-bold">
        <span className="text-[#0056FF]">One</span>
        <span className="text-[#F68B1F]">Retail</span> Club
      </h1>
    </div>
  );
}
