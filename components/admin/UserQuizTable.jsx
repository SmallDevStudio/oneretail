// components/admin/UserQuizTable.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import Image from 'next/image';

const UserQuizTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/quizz');
        const dataWithIds = response.data.data.map((item, index) => ({
          ...item,
          id: item._id,
        }));
        setRows(dataWithIds);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const handleExport = () => {
    const dataToExport = rows.map(row => ({
      ...row,
      date: moment(row.date).format('LLL')
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserQuizzes");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'userQuizzes.xlsx');
  };

  const columns = [
    { 
      field: 'pictureUrl', 
      headerName: 'Picture', 
      width: 100,
      renderCell: (params) => (
        <Image src={params.value} alt="User" width={50} height={50} style={{ borderRadius: '50%' }} />
      ),
    },
    { field: 'fullname', headerName: 'Full Name', width: 250 },
    { 
      field: 'scores', 
      headerName: 'Scores', 
      width: 400,
      renderCell: (params) => (
        <ul>
          {params.value.map((score, index) => (
            <li key={index}>
              คะแนนที่ได้: <span className='font-bold text-[#0056FF] text-lg'>{score.score}</span> / วันที่:{moment(score.date).format('LLL')}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button variant="contained" color="primary" onClick={handleExport} style={{ marginBottom: 20 }}>
        Export to Excel
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 100]}
        pagination
      />
    </div>
  );
};

export default UserQuizTable;
