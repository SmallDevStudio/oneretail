import { useState, useEffect } from "react";
import axios from "axios";
import { Divider, Slide, Dialog, CircularProgress } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const GroupData = [
  { name: "Retail", value: "Retail" },
  { name: "AL", value: "AL" },
  { name: "TCON", value: "TCON" },
  { name: "PB", value: "PB" },
];

export default function Times() {
  const [group, setGroup] = useState("");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);

  return (
    <div className="flex flex-col p-4 w-full">
      {/* Header */}
      <div className="flex flex-col w-full">
        <h2 className="flex font-bold items-center justify-center w-full">
          รายงานการเข้าใช้งาน Perf360
        </h2>
        {/* filter */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          <div>
            <select
              name="group"
              id="group"
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">เลือกกลุ่ม</option>
              {GroupData.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <DatePicker
              selected={start_date ? new Date(start_date) : null}
              onChange={(date) =>
                setStartDate(date ? date.toISOString().split("T")[0] : null)
              }
              dateFormat="dd-MM-yyyy"
              placeholderText="เลือกวันที่เริ่มต้น"
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <DatePicker
              selected={end_date ? new Date(end_date) : null}
              onChange={(date) =>
                setEndDate(date ? date.toISOString().split("T")[0] : null)
              }
              dateFormat="dd-MM-yyyy"
              placeholderText="เลือกวันที่สิ้นสุด"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col mt-5 items-center w-full">
        <div>
          <button className="flex flex-row items-center gap-2 p-2 bg-green-500 font-bold text-white rounded-lg">
            Download Data
          </button>
        </div>
      </div>
    </div>
  );
}
