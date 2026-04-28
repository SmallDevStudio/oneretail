import React, { useState, useEffect, useCallback, useMemo } from "react";
import ClubLeaderboardResult from "@/components/club/ClubLeaderboardResult";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { CiExport } from "react-icons/ci";

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
  const [zones, setZones] = useState([]);
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    const fetchZone = async () => {
      if (!selectedData.month || !selectedData.year || !selectedData.region)
        return;

      const res = await fetch(
        `/api/club/reports?month=${selectedData.month}&year=${selectedData.year}&region=${selectedData.region}`,
      );

      const result = await res.json();

      if (result.success) {
        const uniqueZones = [
          ...new Set(result.data.map((item) => item.zone)),
        ].sort((a, b) => a.localeCompare(b));

        setZones(uniqueZones);
      }
    };

    fetchZone();
  }, [selectedData.month, selectedData.year, selectedData.region]);

  const disable = useMemo(() => {
    return {
      region: !(selectedData.month && selectedData.year),
      zone: !selectedData.region,
      reward: !selectedData.zone,
    };
  }, [selectedData]);

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

  const handleChange = (type, e) => {
    const value = e.target.value;

    setSelectedData((prev) => {
      let newData = { ...prev, [type]: value };

      if (type === "region") {
        newData.zone = "";
        newData.reward = "";
      }

      if (type === "zone") {
        newData.reward = "";
      }

      return newData;
    });
  };

  const handleSubmit = async () => {
    let { month, year, region, zone, reward } = selectedData;

    try {
      // ✅ build params แบบ dynamic
      const params = {
        month,
        year,
        region,
        reward,
      };

      // 👉 ถ้าไม่ใช่ all ค่อยส่ง zone
      if (zone !== "all") {
        params.zone = zone;
      }

      const res = await axios.get("/api/club/reports", { params });

      const result = res.data;

      if (!result.success) return;

      const raw = result.data;

      // 🔥 sort มาก → น้อย
      raw.sort((a, b) => b.achieve - a.achieve);

      const structured = {};

      raw.forEach((item) => {
        const { region, rewardtype, zone, branch } = item;

        if (!structured[region]) structured[region] = {};
        if (!structured[region][rewardtype])
          structured[region][rewardtype] = {};
        if (!structured[region][rewardtype][zone])
          structured[region][rewardtype][zone] = {};
        if (!structured[region][rewardtype][zone][branch])
          structured[region][rewardtype][zone][branch] = [];

        structured[region][rewardtype][zone][branch].push(item);
      });

      setDataset(structured);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen pb-6 pt-2">
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
      <div className="bg-white">
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
      <div className="bg-gray-100 min-h-screen pt-2">
        <div className="p-4 border rounded-lg bg-white mx-4 mt-2">
          <div className="flex flex-row items-center gap-2 w-full">
            <label className="block text-sm font-bold text-gray-700">
              Month
            </label>
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
              <option value="2025">2025</option>
              <option value="2026">2026</option>
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
              <option value="RH1">RH1</option>
              <option value="RH2">RH2</option>
              <option value="RH3">RH3</option>
              <option value="RH4">RH4</option>
              <option value="RH5">RH5</option>
            </select>
          </div>
          <div className="flex flex-row items-center gap-2 w-full mt-4">
            <label className="block text-sm font-bold text-gray-700">
              Zone
            </label>

            <select
              className="text-sm border border-gray-300 rounded-md py-1 px-2 w-full"
              disabled={disable.zone}
              onChange={(e) => handleChange("zone", e)}
              value={selectedData.zone}
            >
              <option value="">Select zone</option>
              <option value="all">All</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
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
              <option value="Grand Ambassador">Grand Ambassador</option>
              <option value="Ambassador">Ambassador</option>
              <option value="Diamond">Diamond</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-2 w-full mt-4">
            <button
              className="text-sm font-bold bg-[#0056FF] text-white px-4 py-2 rounded-md hover:bg-[#0041c4]"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Data Display */}
        {dataset && <ClubLeaderboardResult dataset={dataset} />}
      </div>
    </div>
  );
}
