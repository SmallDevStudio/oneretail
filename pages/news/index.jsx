import { useState, useEffect } from "react";
import axios from "axios";
import { Divider } from "@mui/material";

export default function NewsPage() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [news, setNews] = useState([]);

  return (
    <div className="bg-[#0056FF] p-5 min-h-screen">
      {/* Header */}
      <div className="text-[#F2871F] text-5xl font-black flex justify-center p-4 mb-2">
        News
      </div>
      {/* Tabs */}
      <div>
        <ul className="flex items-center">
          <li className="bg-white px-4 py-1 rounded-t-lg">xxxxxxx</li>
          <li className="bg-white px-4 py-1 rounded-t-lg border-b border-gray-200">
            xxxxxxx
          </li>
          <li className="bg-white px-4 py-1 rounded-t-lg border-b border-gray-200">
            xxxxxxx
          </li>
        </ul>
      </div>
      {/* Content */}
      <div className="bg-white rounded-b-xl min-h-[70vh] p-2"></div>
    </div>
  );
}
