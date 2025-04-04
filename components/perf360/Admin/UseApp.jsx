import { useState, useEffect } from "react";
import UseMenu from "./Tab/UseMenu";
import UsePopup from "./Tab/UsePopup";
import UseNews from "./Tab/UseNews";

export default function UseApp() {
  const [activeTab, setActiveTab] = useState("menu");

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      {/* Header */}
      <ul className="flex flex-row justify-between items-center gap-4">
        <li
          className={`px-6 py-1 rounded-lg
            ${activeTab === "menu" ? "bg-blue-300" : "bg-gray-200"}
            `}
          onClick={() => handleActiveTab("menu")}
        >
          Menu
        </li>
        <li
          className={`px-6 py-1 rounded-lg
            ${activeTab === "popup" ? "bg-blue-300" : "bg-gray-200"}
            `}
          onClick={() => handleActiveTab("popup")}
        >
          Popup
        </li>
        <li
          className={`px-6 py-1 rounded-lg
            ${activeTab === "news" ? "bg-blue-300" : "bg-gray-200"}
            `}
          onClick={() => handleActiveTab("news")}
        >
          News
        </li>
      </ul>

      <div>
        {activeTab === "menu" && <UseMenu />}
        {activeTab === "popup" && <UsePopup />}
        {activeTab === "news" && <UseNews />}
      </div>
    </div>
  );
}
