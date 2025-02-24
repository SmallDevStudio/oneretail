import { useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import * as XLSX from "xlsx";

moment.locale('th');

export default function Point() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async () => {
        if (startDate && endDate) {
            try {
                const response = await axios.get(`/api/reports/point-date?startDate=${startDate}&endDate=${endDate}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    console.log(data);

    const exportToExcel = () => {
        if (data.points.length === 0 && data.coins.length === 0) return;

        const formattedStartDate = moment(startDate).format("DD/MM/YYYY");
        const formattedEndDate = moment(endDate).format("DD/MM/YYYY");
        const dateRange = `ช่วงวันที่: ${formattedStartDate} - ${formattedEndDate}`;

        // แปลงข้อมูล Points ให้เป็นโครงสร้างที่ต้องการ
        const pointsData = data.points.map((item, index) => ({
            "ลำดับ": index + 1,
            "User ID": item.userId || "-",
            "ชื่อ-นามสกุล": item.fullname || "-",
            "รหัสพนักงาน": item.empId || "-",
            "เพศ": item.empData?.sex || "-",
            "teamGroup": item.empData?.teamGroup || "-",
            "chief_th": item.empData?.chief_th || "-",
            "chief_en": item.empData?.chief_en || "-",
            "position": item.empData?.position || "-",
            "department": item.empData?.department || "-",
            "branch": item.empData?.branch || "-",
            "group": item.empData?.group || "-",
            "คะแนน": item.points || 0,
            "desc": item.description || "-",
            "path": item.path || "-",
            "subpath": item.subpath || "-",
            "วันที่สร้าง": item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY HH:mm") : "-"
        }));

        // แปลงข้อมูล Coins ให้เป็นโครงสร้างที่ต้องการ
        const coinsData = data.coins.map((item, index) => ({
            "ลำดับ": index + 1,
            "User ID": item.userId || "-",
            "ชื่อ-นามสกุล": item.fullname || "-",
            "รหัสพนักงาน": item.empId || "-",
            "เพศ": item.empData?.sex || "-",
            "teamGroup": item.empData?.teamGroup || "-",
            "chief_th": item.empData?.chief_th || "-",
            "chief_en": item.empData?.chief_en || "-",
            "position": item.empData?.position || "-",
            "department": item.empData?.department || "-",
            "branch": item.empData?.branch || "-",
            "group": item.empData?.group || "-",
            "เหรียญ": item.coins || 0,
            "desc": item.description || "-",
            "path": item.path || "-",
            "subpath": item.subpath || "-",
            "วันที่สร้าง": item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY HH:mm") : "-"
        }));

        // สร้าง Worksheet สำหรับ Points
        const wsPoints = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_json(wsPoints, [{ "A": dateRange, "B": `Total Points: ${data.totalPoints}` }], { skipHeader: true, origin: "A1" });
        XLSX.utils.sheet_add_json(wsPoints, pointsData, { origin: "A3" });

        // สร้าง Worksheet สำหรับ Coins
        const wsCoins = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_json(wsCoins, [{ "A": dateRange, "B": `Total Coins: ${data.totalCoins}` }], { skipHeader: true, origin: "A1" });
        XLSX.utils.sheet_add_json(wsCoins, coinsData, { origin: "A3" });

        // สร้าง Workbook และเพิ่ม Sheets
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, wsPoints, "Points");
        XLSX.utils.book_append_sheet(workbook, wsCoins, "Coins");

        // กำหนดชื่อไฟล์เป็น `report-point-coins-YYYYMMDD.xlsx`
        const filename = `report-point-coins-${moment().format("YYYYMMDD")}.xlsx`;
        XLSX.writeFile(workbook, filename);
    };

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-xl font-bold">Report Point</h1>

            <div className="flex flex-row items-center gap-2 mt-5 w-full">
                <label htmlFor="startDate">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    className="border border-gray-300 rounded-md px-2 py-1"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    className="border border-gray-300 rounded-md px-2 py-1"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div className="flex flex-row items-center gap-4 mt-5">
                <button 
                    onClick={fetchData}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>

                <button
                    className={`text-white font-bold py-2 px-4 rounded ${
                        data.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'
                    }`}
                    onClick={exportToExcel}
                    disabled={data.length === 0}
                >
                    Export
                </button>
            </div>
        </div>
    );
}
