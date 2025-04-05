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
  Legend,
} from "recharts";
import { Dialog, Slide, Divider } from "@mui/material";
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

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666"];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formatThaiDate = (dateStr) => {
  const date = moment(dateStr).locale("th");
  const year = date.year();
  return date.format("DD-MM-") + year.toString().slice(0);
};

export default function UsePopup() {
  const [data, setData] = useState([]);
  const [group, setGroup] = useState("");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartPage, setChartPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
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

    setSelectedDate(null);
    setSelectedUsers([]);

    const fetchActivity = async () => {
      let url = "/api/perf360/admin/usenews";
      const query = [];
      if (group) query.push(`group=${group}`);
      if (start_date) query.push(`startDate=${start_date}`);
      if (end_date) query.push(`endDate=${end_date}`);
      if (query.length > 0) url += `?${query.join("&")}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
          setData(result.data);

          const grouped = {};
          result.data.forEach((popup) => {
            const { click = [], views = [] } = popup;
            [...click, ...views].forEach((act) => {
              const date = moment(act.createdAt).format("YYYY-MM-DD");
              if (!grouped[date]) grouped[date] = { click: 0, view: 0 };
              if (act.activity === "click") grouped[date].click += 1;
              else if (act.activity === "view") grouped[date].view += 1;
            });
          });

          const formatted = Object.entries(grouped).map(([rawDate, value]) => ({
            rawDate,
            date: moment(rawDate).format("DD-MM-YYYY"),
            click: value.click,
            view: value.view,
          }));

          setChartData(formatted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchActivity();
  }, [group, start_date, end_date, today]);

  const paginatedChartData = chartData.slice(
    chartPage * pageSize,
    chartPage * pageSize + pageSize
  );

  const exportExcel = () => {
    const rows = data.flatMap((news) => [
      ...news.click.map((c) => ({
        activity: "click",
        title: news.title,
        empId: c.empId,
        fullname: c.fullname,
        teamGrop: c.teamGrop,
        position: c.position,
        createdAt:
          formatThaiDate(c.createdAt) +
          " " +
          moment(c.createdAt).format("HH:mm"),
      })),
      ...news.views.map((v) => ({
        activity: "view",
        title: news.title,
        empId: v.empId,
        fullname: v.fullname,
        teamGrop: v.teamGrop,
        position: v.position,
        createdAt:
          formatThaiDate(v.createdAt) +
          " " +
          moment(v.createdAt).format("HH:mm"),
      })),
    ]);

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "News Logs");
    XLSX.writeFile(wb, "news_activity.xlsx");
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h2 className="text-lg font-bold text-center">การเข้าใช้งานระบบ News</h2>

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
            onClick={(e) =>
              setSelectedDate(e.activePayload?.[0]?.payload?.rawDate)
            }
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="click" fill="#8884d8" name="Click" />
            <Bar dataKey="view" fill="#FF8042" name="View" />
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

      {selectedDate && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md w-full max-w-2xl mx-auto mt-4">
          <h3 className="text-center font-bold text-[#0056FF]">
            รายละเอียด: {formatThaiDate(selectedDate)}
          </h3>
          {data.map((popup) => {
            const click = popup.click?.filter(
              (c) => moment(c.createdAt).format("YYYY-MM-DD") === selectedDate
            );
            const views = popup.views?.filter(
              (v) => moment(v.createdAt).format("YYYY-MM-DD") === selectedDate
            );
            if (click.length === 0 && views.length === 0) return null;
            return (
              <div key={popup._id} className="mt-3">
                <p className="font-semibold">{popup.title}</p>
                <div className="flex gap-6 mt-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded-md"
                    onClick={() => {
                      setSelectedUsers(click.map((c) => c));
                      setModalTitle("Click");
                      setDialogOpen(true);
                    }}
                  >
                    Click: {click.length}
                  </button>
                  <button
                    className="bg-orange-600 text-white px-2 py-1 rounded-md"
                    onClick={() => {
                      setSelectedUsers(views.map((v) => v));
                      setModalTitle("View");
                      setDialogOpen(true);
                    }}
                  >
                    View: {views.length}
                  </button>
                </div>
                <Divider className="my-2" />
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        TransitionComponent={Transition}
        fullWidth
      >
        <div className="p-4">
          <h3 className="text-lg font-bold text-center mb-4">
            {modalTitle} Users
          </h3>
          <ul className="space-y-1 text-sm">
            {selectedUsers.map((u, i) => (
              <li key={i} className="border-b flex justify-between py-1">
                <div className="flex w-[30px] h-[30px]">
                  {u.pictureUrl && (
                    <Image
                      src={u.pictureUrl}
                      alt="avatar"
                      width={30}
                      height={30}
                      className="rounded-full object-contain"
                    />
                  )}
                </div>
                <span className="text-gray-500">{u.empId}</span>
                <span>{u.fullname}</span>
                <span className="text-gray-500">{u.teamGrop}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              ปิด
            </button>
          </div>
        </div>
      </Dialog>

      {/* Export */}
      <div className="flex mt-6 justify-center items-center w-full">
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}
