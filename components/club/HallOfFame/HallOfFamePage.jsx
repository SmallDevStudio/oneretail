import { useState, useEffect, useCallback } from "react";
import HallOfFameTab from "@/components/club/HallOfFame/HallOfFameTab";
import { useRouter } from "next/router";

export default function HallOfFamePage({ typeData }) {
  const [activeTab, setActiveTab] = useState("Grand Ambassador");
  const [type, setType] = useState(typeData);
  const router = useRouter();
  const { subtab } = router.query;

  useEffect(() => {
    if (subtab) {
      const capitalized = decodeURIComponent(subtab)
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

      if (["Grand Ambassador", "Ambassador"].includes(capitalized)) {
        setActiveTab(capitalized); // ✅ set decoded value
        setType(capitalized);
      }
    }
  }, [subtab]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setType(tab);
    const encoded = encodeURIComponent(tab); // ✅ encode when pushing to URL
    window.history.pushState(null, "", `?tab=hall-of-fame&subtab=${encoded}`);
  }, []);

  return (
    <div>
      {/* Tabs */}
      <div>
        <ul className="flex flex-row items-center justify-center flex-wrap gap-1">
          <li
            className={`inline-block px-2 rounded-t-lg font-bold ${
              activeTab === "Grand Ambassador"
                ? "bg-[#0056FF] text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("Grand Ambassador")}
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
