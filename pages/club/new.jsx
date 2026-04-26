import React, { useState, useEffect, useCallback, useMemo } from "react";
import ClubLeaderboardResult from "@/components/club/ClubLeaderboardResult";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NewClub() {
  const [activeTab, setActiveTab] = useState("region");
  const router = useRouter();
  const { tab } = router.query;
  const [selectedData, setSelectedData] = useState({
    month: "",
    year: "",
    region: "",
    zone: "",
    reward: "",
  });
  const [disable, setDisable] = useState({
    region: true,
    zone: true,
    reward: true,
  });

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("region");
    }
  }, [tab]);

  useEffect(() => {
    const tab = router.query.tab || "region";
    setActiveTab(tab);
  }, [router.query.tab]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
  }, []);

  useEffect(() => {
    if (selectedData.month & selectedData.year) {
      setDisable.region = false;
    } else if (selectedData.region) {
      setDisable.zone = false;
    } else if (selectedData.zone) {
      setDisable.reward = false;
    }
  }, [selectedData]);

  console.log(selectedData);

  const handleChange = (type, e) => {
    const data = e.target.value;
    setSelectedData((prev) => ({
      ...prev,
      [type]: data,
    }));
  };

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
              activeTab === "region"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("region")}
          >
            Region
          </li>
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "zone"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("zone")}
          >
            Zone
          </li>
        </ul>
      </div>

      {/* Selected Data */}
      <div className="p-4 border rounded-lg bg-white mx-4 mt-2">
        <div className="flex flex-row items-center gap-2 w-full">
          <label className="block text-sm font-bold text-gray-700">Month</label>
          <select
            className="text-sm border border-gray-300 rounded-md py-1 px-2 w-1/2"
            onChange={(e) => handleChange("month", e)}
            value={selectedData.month}
          >
            <option value="">Select month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            className="text-sm border border-gray-300 rounded-md py-1 px-2 w-1/2"
            onChange={(e) => handleChange("year", e)}
            value={selectedData.year}
          >
            <option value="">Select year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="flex flex-row items-center gap-2 w-full mt-4">
          <label className="block text-sm font-bold text-gray-700">
            Region
          </label>
          <select
            className="text-sm border border-gray-300 rounded-md py-1 px-2 w-full"
            disabled={disable.region}
            onChange={(e) => handleChange("region", e)}
            value={selectedData.region}
          >
            <option value="">Select region</option>
            <option value="rh1">RH1</option>
            <option value="rh2">RH2</option>
            <option value="rh3">RH3</option>
            <option value="rh4">RH4</option>
            <option value="rh5">RH5</option>
          </select>
        </div>
        <div className="flex flex-row items-center gap-2 w-full mt-4">
          <label className="block text-sm font-bold text-gray-700">Zone</label>
          <select
            className="text-sm border border-gray-300 rounded-md py-1 px-2 w-full"
            disabled={disable.zone}
            onChange={(e) => handleChange("zone", e)}
            value={selectedData.zone}
          >
            <option value="">Select zone</option>
            <option value="all">All</option>
            <option value="zone1">Zone 1</option>
            <option value="zone2">Zone 2</option>
            <option value="zone3">Zone 3</option>
            <option value="zone4">Zone 4</option>
            <option value="zone5">Zone 5</option>
          </select>
        </div>
        <div className="flex flex-row items-center gap-2 w-full mt-4">
          <label className="block text-sm font-bold text-gray-700">
            Reward
          </label>
          <select
            className="text-sm border border-gray-300 rounded-md py-1 px-2 w-full"
            disabled={disable.reward}
            onChange={(e) => handleChange("reward", e)}
            value={selectedData.reward}
          >
            <option value="">Select Reward</option>
            <option value="grand ambassador">Grand Ambassador</option>
            <option value="ambassador">Ambassador</option>
            <option value="diamond">Diamond</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
          </select>
        </div>
        <div className="flex items-center justify-center gap-2 w-full mt-4">
          <button className="text-sm font-bold bg-[#0056FF] text-white px-4 py-2 rounded-md hover:bg-[#0041c4]">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
