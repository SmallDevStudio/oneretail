"use client";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/themes";
import Redeems from "@/components/redeem/Redeems";
import Trans from "@/components/redeem/Trans";
import Report from "@/components/redeem/Report";
import RedeemReportTable from "@/components/redeem/RedeemReportTable";

const RedeemPage = () => {
  const [activeTab, setActiveTab] = useState("redeem");

  return (
    <div className="p-4 text-sm">
      <h1 className="text-2xl font-bold mb-4">จัดการแลกของรางวัล</h1>
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "redeem" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("redeem")}
          >
            จัดการของรางวัล
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "redeemTrans" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("redeemTrans")}
          >
            ของรางวัลที่แลกแล้ว
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "report" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("report")}
          >
            รายงาน
          </button>
        </div>
        {activeTab === "redeem" ? (
          <Redeems />
        ) : activeTab === "redeemTrans" ? (
          <Trans />
        ) : activeTab === "report" ? (
          <RedeemReportTable />
        ) : null}
      </div>
    </div>
  );
};

export default RedeemPage;

RedeemPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

RedeemPage.auth = true;


