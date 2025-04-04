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

export default function Times() {
  const [useTime, setUseTime] = useState([]);
  const [group, setGroup] = useState("");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const { data } = useSWR("/api/perf360/admin/usetime", fetcher, {
    onSuccess: (data) => {
      setUseTime(data.data);
    },
  });

  useEffect(() => {
    if (!useTime || useTime.length === 0) return;

    const grouped = {};

    useTime.forEach(({ user, createdAt }) => {
      if (!user || !user.emp) return;

      const userGroup = user.emp.teamGrop || "";
      const date = moment(createdAt).format("DD/MM/YYYY");
      const hour = moment(createdAt).hour();

      if (group && userGroup !== group) return;
      if (start_date && moment(createdAt).isBefore(moment(start_date))) return;
      if (end_date && moment(createdAt).isAfter(moment(end_date))) return;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][hour]) grouped[date][hour] = new Set();

      grouped[date][hour].add(user);
    });

    const result = Object.entries(grouped).map(([date, hours]) => {
      let total = 0;
      for (let h = 0; h < 24; h++) {
        total += hours[h] ? hours[h].size : 0;
      }
      return {
        date,
        total,
        detail: hours,
      };
    });

    // sort by date
    result.sort((a, b) =>
      moment(a.date, "DD/MM/YYYY").isAfter(moment(b.date, "DD/MM/YYYY"))
        ? 1
        : -1
    );

    setChartData(result);
  }, [useTime, group, start_date, end_date]);

  const handleBarClick = (data) => {
    const detail = Object.entries(data.detail)
      .map(([h, set]) => {
        const users = Array.from(set); // ✅ แปลง Set เป็น Array
        return {
          hour: `${h.padStart(2, "0")}:00`,
          count: users.length,
          users, // ✅ ใส่ users เข้าไปเพื่อใช้ต่อ
        };
      })
      .sort((a, b) => b.count - a.count); // มาก -> น้อย

    setDetailData({ date: data.date, list: detail });
  };

  const handleOpenDetail = (data) => {
    setSelectedData(data);
    setOpenDialog(true);
  };

  const handleCloseDetail = () => {
    setSelectedData([]);
    setOpenDialog(false);
  };

  const handleExportExcel = () => {
    if (!useTime || useTime.length === 0) return;

    const exportData = [];

    useTime.forEach(({ user, createdAt }) => {
      if (!user || !user.emp) return;

      const userGroup = user.emp.teamGrop || "";
      if (group && userGroup !== group) return;

      if (start_date && moment(createdAt).isBefore(moment(start_date))) return;
      if (end_date && moment(createdAt).isAfter(moment(end_date))) return;

      exportData.push({
        รหัสพนักงาน: user.empId,
        "ชื่อ-นามสกุล": user.fullname,
        กลุ่ม: user.emp.teamGrop,
        ตำแหน่ง: user.emp.position,
        เวลาเข้าใช้งาน: moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
      });
    });

    if (exportData.length === 0) {
      alert("ไม่มีข้อมูลสำหรับ export ค่ะ");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Perf360 Usage");

    XLSX.writeFile(workbook, "Perf360_Usage_Report.xlsx");
  };

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666"];

  return (
    <div className="flex flex-col p-4 w-full">
      <h2 className="text-center text-lg font-bold mb-4">
        รายงานการเข้าใช้งาน Perf360
      </h2>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <select
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/3"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">ทุกกลุ่ม</option>
          {GroupData.map((item, index) => (
            <option key={index} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>

        <DatePicker
          selected={start_date ? new Date(start_date) : null}
          onChange={(date) =>
            setStartDate(date ? date.toISOString().split("T")[0] : null)
          }
          dateFormat="dd-MM-yyyy"
          placeholderText="เลือกวันที่เริ่มต้น"
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/3"
        />

        <DatePicker
          selected={end_date ? new Date(end_date) : null}
          onChange={(date) =>
            setEndDate(date ? date.toISOString().split("T")[0] : null)
          }
          dateFormat="dd-MM-yyyy"
          placeholderText="เลือกวันที่สิ้นสุด"
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/3"
        />
      </div>

      {/* Chart */}
      <div className="w-[100vw] h-[80vw] sm:h-[400px] mb-4 -mx-14 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, bottom: 10, left: 0, right: 0 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ display: "none" }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} onClick={handleBarClick}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail Box */}
      {detailData?.list?.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md w-full max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2 text-center text-lg">
            รายละเอียดช่วงเวลาเข้าใช้งานวันที่ {detailData.date}
          </h3>
          <ul className="space-y-1">
            {detailData.list.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b py-1"
                onClick={() => handleOpenDetail(item)}
              >
                <span>{item.hour}</span>
                <span>{item.count} คน</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleExportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold"
        >
          Export Excel
        </button>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDetail}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <div className="p-5">
          <h3 className="text-lg font-semibold text-center mb-4">
            ผู้เข้าใช้งานช่วงเวลา {selectedData?.hour} ({selectedData?.count}{" "}
            คน)
          </h3>

          {selectedData?.users?.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {selectedData.users.map((user, index) => (
                <li
                  key={index}
                  className="border-b py-1 flex justify-between items-center"
                >
                  <div className="flex w-[40px] h-[40px]">
                    <Image
                      src={user.pictureUrl}
                      alt={user.fullname}
                      width={40}
                      height={40}
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span>{user.fullname}</span>
                  <span className="text-gray-500">{user.empId}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-sm text-gray-500">ไม่มีข้อมูล</div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleCloseDetail}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              ปิด
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
