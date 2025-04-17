import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, LinearProgress, Box, TextField } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

const SurveyTable = () => {
  const [rows, setRows] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/survey");
      const dataWithIds = response.data.map((item, index) => ({
        ...item,
        id: item._id,
        formattedDate: moment(item.createdAt).format("LLL"),
      }));
      setRows(dataWithIds);
    };

    fetchData();
  }, []);

  const fetchDataForExport = async (
    currentPage,
    pageSize,
    startDate,
    endDate
  ) => {
    const response = await axios.get("/api/survey", {
      params: {
        page: currentPage,
        pageSize: pageSize,
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response.data;
  };

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);

    try {
      let allData = [];
      let currentPage = 1;
      let hasMore = true;
      const pageSize = 100;

      while (hasMore) {
        const data = await fetchDataForExport(
          currentPage,
          pageSize,
          startDate,
          endDate
        );

        if (data.length > 0) {
          allData = allData.concat(data);
          currentPage++;
          setProgress((prevProgress) =>
            Math.min(100, prevProgress + (data.length / pageSize) * 100)
          );
        } else {
          hasMore = false;
        }
      }

      const dataToExport = allData.map((row) => ({
        วันที่: moment(row.createdAt).format("LLL"),
        "User ID": row.userId,
        "Emp ID": row.empId || "",
        ชื่อ: row.fullname || "",
        teamGrop: row.emp?.teamGrop || "",
        group: row.emp?.group || "",
        ตำแหน่ง: row.emp?.position || "",
        แผนก: row.emp?.department || "",
        สาขา: row.emp?.branch || "",
        คะแนน: row.value,
        ความคิดเห็น: row.memo || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Surveys");
      XLSX.writeFile(workbook, "surveys.xlsx");

      setProgress(100);
    } catch (error) {
      console.error("Error exporting data:", error);
    }

    setExporting(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userId", headerName: "User ID", width: 150 },
    { field: "fullname", headerName: "Full Name", width: 150 },
    { field: "empId", headerName: "Employee ID", width: 150 },
    {
      field: "pictureUrl",
      headerName: "Picture",
      width: 100,
      renderCell: (params) => (
        <Image
          src={params.value}
          alt="User"
          width={50}
          height={50}
          className="rounded-full"
        />
      ),
    },
    { field: "value", headerName: "Value", width: 110 },
    { field: "memo", headerName: "Memo", width: 200 },
    {
      field: "formattedDate",
      headerName: "Created At",
      width: 200,
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <div className="flex justify-end mb-4 gap-2">
        <div className="flex space-x-4">
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={exporting}
        >
          Export to Excel
        </Button>
      </div>
      {exporting && (
        <Box sx={{ width: "100%", marginBottom: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default SurveyTable;
