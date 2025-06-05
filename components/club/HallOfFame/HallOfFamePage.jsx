import { useState, useEffect, useCallback } from "react";
import HallOfFameTab from "@/components/club/HallOfFame/HallOfFameTab";
import Image from "next/image";
import { useRouter } from "next/router";

export default function HallOfFamePage({ typeData }) {
  const [activeTab, setActiveTab] = useState("Grand%20Ambassador");
  const [type, setType] = useState(typeData);
  const router = useRouter();

  useEffect(() => {
    if (typeData) {
      setActiveTab(typeData);
      setType(typeData);
      window.history.pushState(
        null,
        "",
        `?tab=hall-of-fame&subtab=${typeData}`
      );
    } else {
      setActiveTab("Grand%20Ambassador");
      setType("Grand%20Ambassador");
      window.history.pushState(
        null,
        "",
        `?tab=hall-of-fame&subtab=Grand%20Ambassador`
      );
    }
  }, [typeData]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setType(tab);
    window.history.pushState(null, "", `?tab=hall-of-fame&subtab=${tab}`);
  }, []);

  console.log("typeData", typeData);

  return (
    <div>
      {/* Tabs */}
      <div>
        <ul className="flex flex-row items-center justify-center flex-wrap gap-1">
          <li
            className={`inline-block px-2 rounded-t-lg font-bold ${
              activeTab === "Grand%20Ambassador"
                ? "bg-[#0056FF] text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("Grand%20Ambassador")}
          >
            Grand Ambassador
          </li>
          <li
            className={`inline-block px-2 rounded-t-lg font-bold ${
              activeTab === "Ambassador"
                ? "bg-[#0056FF] text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("Ambassador")}
          >
            Ambassador
          </li>
        </ul>
      </div>

      {/* Hall of Fame */}
      <HallOfFameTab typeData={type} />
    </div>
  );
}
