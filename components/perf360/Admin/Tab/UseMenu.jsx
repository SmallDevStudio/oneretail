import { useState, useEffect } from "react";
import useSWR from "swr";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/th";
import { Dialog, Slide } from "@mui/material";
import { Fragment, forwardRef } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";

moment.locale("th");

const GroupData = [
  { name: "Retail", value: "Retail" },
  { name: "AL", value: "AL" },
  { name: "TCON", value: "TCON" },
  { name: "PB", value: "PB" },
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UseMenu() {
  const [group, setGroup] = useState("Retail");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);

  return (
    <div className="flex flex-col p-4 w-full">
      {/* Header */}
      <div className="flex flex-col w-full">
        <h2 className="flex font-bold items-center justify-center w-full">
          การเข้าใช้งานระบบ Menu
        </h2>
        {/* filter */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          <div>
            <select
              name="group"
              id="group"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
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
