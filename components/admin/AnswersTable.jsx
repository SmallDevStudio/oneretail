// components/AnswersTable.js
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';
import 'moment/locale/th';

const AnswersTable = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/answers');
            const dataWithIds = response.data.data.map((item) => ({
                ...item,
                id: item._id,
                questionText: item.questionId.question,
                correctAnswer: item.questionId.correctAnswer,
                answerText: item.questionId.options[item.answer],
                correctAnswerText: item.questionId.options[item.questionId.correctAnswer],
                isCorrectText: item.isCorrect ? 'ถูก' : 'ผิด',
                formattedDate: moment(item.timestamp).tz('Asia/Bangkok').locale('th').format('LLL'),
                userId: item.userId,
                fullname: item.user?.fullname || 'N/A',
                empId: item.user?.empId || 'N/A'
            }));
            setRows(dataWithIds);
        };

        fetchData();
    }, []);

    const handleExport = () => {
        const dataToExport = rows.map(row => ({
            ...row,
            timestamp: moment(row.timestamp).tz('Asia/Bangkok').locale('th').format('LLL')
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Answers");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'answers.xlsx');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'userId', headerName: 'User ID', width: 150 },
        { field: 'fullname', headerName: 'Full Name', width: 150 },
        { field: 'empId', headerName: 'Employee ID', width: 150 },
        { field: 'questionText', headerName: 'Question', width: 250 },
        { field: 'answerText', headerName: 'Answer Given', width: 150 },
        { field: 'correctAnswerText', headerName: 'Correct Answer', width: 150 },
        { field: 'isCorrectText', headerName: 'Result', width: 100 },
        { field: 'formattedDate', headerName: 'Timestamp', width: 200 }
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Button variant="contained" color="primary" onClick={handleExport}>
                Export to Excel
            </Button>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    );
};

export default AnswersTable;
