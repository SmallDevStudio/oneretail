import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Admin from "@/components/perf360/Admin";
import News from "@/components/perf360/News";
import PopUp from "@/components/perf360/PopUp";
import Menu from "@/components/perf360/Menu";

export default function Perf360Admin() {
  const [activeTab, setActiveTab] = useState("admin");

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    } else {
      window.history.pushState(null, "", `?tab=admin`);
      setActiveTab("admin");
    }
  }, [router.query.tab]);

  const handleTabClick = (tab) => {
    window.history.pushState(null, "", `?tab=${tab}`);
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col pb-20 w-full">
      {/* Header */}
      <div className="flex flex-row justify-center items-center gap-2 py-4 font-['ttb-bold'] w-full">
        <span className="text-2xl font-bold">Admin</span>
        <div>
          <span className="text-2xl font-bold text-[#0056FF]">Perf</span>
          <span className="text-2xl font-bold text-[#F2871F]">360</span>
        </div>
      </div>
      {/* Menu */}
      <ul className="flex flex-row gap-2 justify-between items-center px-2">
        <li
          className={`px-4 py-1 text-lg rounded-lg
            ${
              activeTab === "admin"
                ? "bg-[#0056FF] text-white font-bold"
                : "bg-gray-300 text-black"
            }
            `}
          onClick={() => handleTabClick("admin")}
        >
          Admin
        </li>
        <li
          className={`px-4 py-1 text-lg rounded-lg
            ${
              activeTab === "popup"
                ? "bg-[#0056FF] text-white font-bold"
                : "bg-gray-300 text-black"
            }
            `}
          onClick={() => handleTabClick("popup")}
        >
          Popup
        </li>
        <li
          className={`px-4 py-1 text-lg rounded-lg
            ${
              activeTab === "menu"
                ? "bg-[#0056FF] text-white font-bold"
                : "bg-gray-300 text-black"
            }
            `}
          onClick={() => handleTabClick("menu")}
        >
          Menu
        </li>
        <li
          className={`px-4 py-1 text-lg rounded-lg
            ${
              activeTab === "news"
                ? "bg-[#0056FF] text-white font-bold"
                : "bg-gray-300 text-black"
            }
            `}
          onClick={() => handleTabClick("news")}
        >
          News
        </li>
      </ul>
      {/* Content */}
      <div>
        {activeTab === "admin" && <Admin />}
        {activeTab === "popup" && <PopUp />}
        {activeTab === "menu" && <Menu />}
        {activeTab === "news" && <News />}
      </div>
    </div>
  );
}
