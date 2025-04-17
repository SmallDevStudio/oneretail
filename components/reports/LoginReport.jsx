import React, { useEffect, useState } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/th";
import { group } from "console";

moment.locale("th");

const LoginReport = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setProgress(10);

    try {
      const res = await axios.get(
        `/api/reports/login?startDate=${startDate || ""}&endDate=${
          endDate || ""
        }`
      );
      setProgress(50);

      const formattedData = res.data.data.map((item) => ({
        วันที่: moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss"),
        "User ID": item.userId,
        "Emp ID": item.emp?.empId || "",
        ชื่อ: item.user?.fullname || "",
        teamGrop: item.emp?.teamGrop || "",
        group: item.emp?.group || "",
        ตำแหน่ง: item.emp?.position || "",
        แผนก: item.emp?.department || "",
        สาขา: item.emp?.branch || "",
        Action: item.action,
        Page: item.page,
      }));

      setProgress(70);

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "LoginReport");

      setProgress(90);

      XLSX.writeFile(
        workbook,
        `login-report-${moment().format("YYYYMMDD_HHmmss")}.xlsx`
      );

      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error("Error exporting data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
      <div className="flex flex-row items-center gap-2">
        <span className="font-bold text-lg">Login Report</span>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor="startDate">startDate</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            className="border border-gray-300 rounded-xl p-2"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor="endDate">endDate</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            className="border border-gray-300 rounded-xl p-2"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="bg-[#0056FF] text-white rounded-2xl p-2 w-1/6 mt-2"
          onClick={handleExport}
        >
          Export
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <LinearProgress variant="determinate" value={progress} />
          <span className="text-xs">กำลังดำเนินการ: {progress}%</span>
        </div>
      )}
    </div>
  );
};

export default LoginReport;
