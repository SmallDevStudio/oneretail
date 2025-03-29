import { useState, useEffect } from "react";
import axios from "axios";
import Times from "./Admin/Times";
import Use from "./Admin/Use";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("times");

  return (
    <div className="flex flex-col w-full p-4">
      {/* Header */}
      <div className="flex border-b border-gray-300">
        <ul className="flex flex-row items-center justify-center text-center gap-4 w-full">
          <li
            className={`px-6 py-2 rounded-t-lg
              ${activeTab === "times" ? "bg-[#0056FF]/50" : "bg-gray-200"}`}
            onClick={() => setActiveTab("times")}
          >
            ช่วงเวลาใช้งาน
          </li>
          <li
            className={`px-6 py-2 rounded-t-lg
            ${activeTab === "use" ? "bg-[#0056FF]/50" : "bg-gray-200"}`}
            onClick={() => setActiveTab("use")}
          >
            การเข้าใช้งาน
          </li>
        </ul>
      </div>
      <div>
        {activeTab === "times" && <Times />}
        {activeTab === "use" && <Use />}
      </div>
    </div>
  );
}
