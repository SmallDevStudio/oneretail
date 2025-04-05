// ✅ FINAL COMPONENT - covers all 7 requirements
import { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/th";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Dialog, Slide } from "@mui/material";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import Image from "next/image";

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

const formatThaiDate = (dateStr) => {
  const date = moment(dateStr).locale("th");
  const year = date.year();
  return date.format("DD-MM-") + year.toString().slice(0);
};

export default function UseMenu() {
  const [data, setData] = useState([]);
  const [group, setGroup] = useState("");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubmenuUsers, setSelectedSubmenuUsers] = useState([]);
  const [chartPage, setChartPage] = useState(0);
  const pageSize = 7;

  const today = moment().format("YYYY-MM-DD");

  useEffect(() => {
    if (start_date && moment(start_date).isAfter(today)) {
      toast.error("วันที่เริ่มต้นต้องไม่มากกว่าวันปัจจุบัน");
      return;
    }
    if (end_date && start_date && moment(end_date).isBefore(start_date)) {
      toast.error("วันที่สิ้นสุดต้องไม่น้อยกว่าวันเริ่มต้น");
      return;
    }

    setSelectedDay(null);

    const fetchActivity = async () => {
      let url = "/api/perf360/admin/usemenu";
      const query = [];
      if (group) query.push(`group=${group}`);
      if (start_date) query.push(`startDate=${start_date}`);
      if (end_date) query.push(`endDate=${end_date}`);
      if (query.length > 0) url += `?${query.join("&")}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchActivity();
  }, [group, start_date, end_date, today]);

  const groupedByDate = {};
  data.forEach((item) => {
    const date = moment(item.createdAt).format("YYYY-MM-DD");
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(item);
  });

  const chartData = Object.entries(groupedByDate).map(([date, acts]) => ({
    date: formatThaiDate(date),
    count: acts.length,
    rawDate: date,
  }));

  const selectedDetails = selectedDay ? groupedByDate[selectedDay] || [] : [];

  const detailedGrouped = {};
  selectedDetails.forEach((a) => {
    const key = `${a.menu}||${a.submenu}`;
    if (!detailedGrouped[key]) detailedGrouped[key] = [];
    detailedGrouped[key].push(a);
  });

  const detailList = Object.entries(detailedGrouped)
    .map(([key, acts]) => {
      const [menu, submenu] = key.split("||");
      return {
        menu,
        submenu,
        count: acts.length,
        users: acts.map((a) => a.user),
      };
    })
    .sort((a, b) => b.count - a.count);

  const exportExcel = () => {
    const rows = data.map((a) => ({
      menu: a.menu,
      submenu: a.submenu,
      group: a.group,
      empId: a.user.empId,
      fullname: a.user.fullname,
      position: a.user.position,
      teamGrop: a.user.teamGrop,
      createdAt:
        formatThaiDate(a.createdAt) + " " + moment(a.createdAt).format("HH:mm"),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activity Logs");
    XLSX.writeFile(wb, "menu_activity.xlsx");
  };

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666"];

  const paginatedChartData = chartData?.slice(
    chartPage * pageSize,
    chartPage * pageSize + pageSize
  );

  return (
    <div className="flex flex-col p-4 w-full">
      <h2 className="text-lg font-bold text-center">การเข้าใช้งานระบบ Menu</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 my-4">
        <select
          className="border rounded-md p-2 w-full md:w-1/3"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">ทั้งหมด</option>
          {GroupData.map((g) => (
            <option key={g.value} value={g.value}>
              {g.name}
            </option>
          ))}
        </select>

        <DatePicker
          selected={start_date ? new Date(start_date) : null}
          onChange={(date) =>
            setStartDate(date ? moment(date).format("YYYY-MM-DD") : null)
          }
          placeholderText="วันที่เริ่มต้น"
          className={`border rounded-md p-2 w-full md:w-1/3 ${
            start_date && moment(start_date).isAfter(today)
              ? "border-red-500"
              : ""
          }`}
        />
        <DatePicker
          selected={end_date ? new Date(end_date) : null}
          onChange={(date) =>
            setEndDate(date ? moment(date).format("YYYY-MM-DD") : null)
          }
          placeholderText="วันที่สิ้นสุด"
          className={`border rounded-md p-2 w-full md:w-1/3 ${
            end_date && start_date && moment(end_date).isBefore(start_date)
              ? "border-red-500"
              : ""
          }`}
        />
      </div>

      {/* Chart */}
      <div className="w-[100vw] h-[70vw] sm:h-[400px] mb-4 -mx-16 px-4">
        <ResponsiveContainer>
          <BarChart
            data={paginatedChartData}
            margin={{ top: 10, bottom: 10, left: 0, right: 0 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              onClick={(data) => setSelectedDay(data.rawDate)}
            >
              {paginatedChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {chartData.length > 7 && (
        <div className="flex justify-between items-center my-2 px-2">
          <button
            onClick={() => setChartPage((prev) => Math.max(prev - 1, 0))}
            disabled={chartPage === 0}
            className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ← ก่อนหน้า
          </button>
          <span>สัปดาห์ที่ {chartPage + 1}</span>
          <button
            onClick={() =>
              setChartPage((prev) =>
                (prev + 1) * pageSize < chartData.length ? prev + 1 : prev
              )
            }
            disabled={(chartPage + 1) * pageSize >= chartData.length}
            className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ถัดไป →
          </button>
        </div>
      )}

      {/* Detail Section */}
      {selectedDay && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md w-full max-w-2xl mx-auto">
          <h3 className="text-center font-bold">
            รายละเอียด:{" "}
            <span className="text-[#0056FF]">
              {formatThaiDate(selectedDay)}
            </span>
          </h3>
          {detailList.map((item, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-[#0056FF]">{item.menu}</p>
              <div
                className="ml-4 cursor-pointer"
                onClick={() => {
                  setSelectedSubmenuUsers(item.users);
                  setDialogOpen(true);
                }}
              >
                <div className="flex justify-between">
                  <span className="">{item.submenu}</span>
                  <span>{item.count} ครั้ง</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Export */}
      <div className="flex mt-6 justify-center items-center w-full">
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Export to Excel
        </button>
      </div>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        TransitionComponent={Transition}
        fullWidth
      >
        <div className="p-4">
          <h3 className="text-lg font-bold text-center mb-4">ผู้ใช้งาน</h3>
          <ul className="space-y-1 text-sm">
            {selectedSubmenuUsers.map((u, i) => (
              <li key={i} className="border-b flex justify-between py-1">
                <div className="flex w-[30px] h-[30px]">
                  <Image
                    src={u.pictureUrl}
                    alt="avatar"
                    width={30}
                    height={30}
                    className="rounded-full object-contain"
                  />
                </div>
                <span className="text-gray-500">{u.empId}</span>
                <span>{u.fullname}</span>
                <span>{u.teamGrop}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              ปิด
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
