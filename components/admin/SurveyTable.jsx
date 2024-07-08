import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, LinearProgress, Box } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Image from 'next/image';
import moment from 'moment-timezone';
import 'moment/locale/th';

const SurveyTable = () => {
    const [rows, setRows] = useState([]);
    const [exporting, setExporting] = useState(false);
    const [progress, setProgress] = useState(0);

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

    const handleExport = async () => {
        setExporting(true);
        setProgress(0);
        try {
            let allData = [];
            let currentPage = 1;
            let hasMore = true;
            const pageSize = 100; // ขนาดของแต่ละหน้าที่จะดึงข้อมูล

            while (hasMore) {
                const response = await axios.get('/api/survey', {
                    params: {
                        page: currentPage,
                        pageSize: pageSize,
                    },
                });

                if (response.data.length > 0) {
                    allData = allData.concat(response.data);
                    currentPage++;
                    setProgress(Math.min(100, (allData.length / rows.length) * 100));
                } else {
                    hasMore = false;
                }
            }

            const dataToExport = allData.map((row) => ({
                ...row,
                createdAt: moment(row.createdAt).tz('Asia/Bangkok').locale('th').format('LLL')
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Surveys");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, 'surveys.xlsx');
        } catch (error) {
            console.error('Error exporting data:', error);
        }
        setProgress(100);
        setExporting(false);
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
                <Button variant="contained" color="primary" onClick={handleExport} disabled={exporting}>
                    Export to Excel
                </Button>
            </div>
            {exporting && (
                <Box sx={{ width: '100%', marginBottom: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
            <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    );
};

export default SurveyTable;
