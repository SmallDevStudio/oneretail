// components/SurveyTable.js
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Image from 'next/image';
import moment from 'moment-timezone';
import 'moment/locale/th';

const SurveyTable = () => {
    const [rows, setRows] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/survey');
            const dataWithIds = response.data.map((item, index) => ({
                ...item,
                id: item._id,
                formattedDate: moment(item.createdAt).tz('Asia/Bangkok').locale('th').format('LLL')
            }));
            setRows(dataWithIds);
        };

        fetchData();
    }, []);

    const handleExport = () => {
        const dataToExport = rows.map(row => ({
            ...row,
            createdAt: moment(row.createdAt).tz('Asia/Bangkok').locale('th').format('LLL')
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Surveys");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'surveys.xlsx');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'userId', headerName: 'User ID', width: 150 },
        { field: 'fullname', headerName: 'Full Name', width: 150 },
        { field: 'empId', headerName: 'Employee ID', width: 150 },
        { 
            field: 'pictureUrl', 
            headerName: 'Picture', 
            width: 100,
            renderCell: (params) => (
                <Image src={params.value} alt="User" width={50} height={50} className='rounded-full'/>
            )
        },
        { field: 'value', headerName: 'Value', width: 110 },
        { field: 'memo', headerName: 'Memo', width: 200 },
        { 
            field: 'formattedDate', 
            headerName: 'Created At', 
            width: 200 
        }
    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            <div className="flex justify-end mb-4">
                <Button variant="contained" color="primary" onClick={handleExport}>
                    Export to Excel
                </Button>
            </div>
            
            <DataGrid rows={rows} columns={columns} pageSize={5} />
            
        </div>
    );
};

export default SurveyTable;
