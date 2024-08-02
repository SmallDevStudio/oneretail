import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, TextField, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import 'moment/locale/th';
import Image from 'next/image';

moment.locale('th');

const UserQuizTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/quizz');
        const sortedData = response.data.data.map((item, index) => ({
          ...item,
          id: `${item.userId}-${item.date}`, // กำหนดค่า id ที่ไม่ซ้ำกัน
        })).sort((a, b) => new Date(b.date) - new Date(a.date)); // จัดเรียงตามวันที่ใหม่สุดก่อน
  
        setRows(sortedData); // ตั้งค่าข้อมูลที่จัดเรียงแล้ว
        setLoading(false); // ยกเลิกสถานะการโหลด
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // เรียกข้อมูลจาก API
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const handleExport = () => {
    let filteredRows = rows;
    if (startDate && endDate) {
      filteredRows = rows.filter(row =>
        moment(row.date).isBetween(moment(startDate), moment(endDate), 'day', '[]')
      );
    }

    const dataToExport = filteredRows.map(({ empId, fullname, score, date }) => ({
      empId,
      fullname,
      score,
      date: moment(date).format('LLL'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserQuizzes");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'userQuizzes.xlsx');
  };

  const columns = [
    { field: 'empId', headerName: 'Emp ID', width: 150 },
    { 
      field: 'pictureUrl', 
      headerName: 'Picture', 
      width: 100,
      renderCell: (params) => (
        <Image src={params.value} alt="User" width={50} height={50} style={{ borderRadius: '50%' }} />
      ),
    },
    { field: 'fullname', headerName: 'Full Name', width: 250 },
    { field: 'score', headerName: 'Score', width: 100 },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      renderCell: (params) => moment(params.value).format('LLL'),
    }
  ];

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export to Excel
        </Button>
      </div>
      <DataGrid
        rows={rows} // ข้อมูลที่จัดเรียงแล้ว
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 100]}
        pagination
        sortingOrder={['desc', 'asc']} // ตั้งค่าการจัดเรียงจากใหม่ไปเก่าก่อน
      />
    </div>
  );
};

export default UserQuizTable;
