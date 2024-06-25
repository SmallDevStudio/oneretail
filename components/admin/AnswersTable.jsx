import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';
import 'moment/locale/th';
import Loading from '../Loading';

const AnswersTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = async (page, pageSize) => {
        setLoading(true);
        const response = await axios.get('/api/answers', {
            params: { page: page + 1, pageSize }
        });
        const dataWithIds = response.data.data.map((item) => ({
            ...item,
            id: item._id,
            questionText: item.questionId.question,
            correctAnswer: item.questionId.correctAnswer,
            answerText: item.questionId.options[item.answer],
            correctAnswerText: item.questionId.options[item.questionId.correctAnswer],
            isCorrectText: item.isCorrect ? 'ถูก' : 'ผิด',
            formattedDate: moment(item.createdAt).tz('Asia/Bangkok').locale('th').format('LLL'),
            userId: item.userId,
            fullname: item.user?.fullname || 'N/A',
            empId: item.user?.empId || 'N/A'
        }));
        setRows(dataWithIds);
        setTotal(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page, pageSize);
    }, [page, pageSize]);

    const handleExport = () => {
        let dataToExport = rows;

        if (startDate && endDate) {
            dataToExport = rows.filter(row => {
                const rowDate = moment(row.createdAt);
                return rowDate.isBetween(startDate, endDate, null, '[]');
            });
        }

        const exportData = dataToExport.map(row => ({
            ...row,
            timestamp: moment(row.createdAt).tz('Asia/Bangkok').locale('th').format('LLL')
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
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

    if (loading) return <Loading />;

    return (
        <div style={{ height: 600, width: '100%' }}>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button variant="contained" color="primary" onClick={handleExport}>
                        Export to Excel
                    </Button>
                </div>
                <div>
                    <FormControl style={{ marginRight: 20 }}>
                        <InputLabel>Page Size</InputLabel>
                        <Select
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                        >
                            {[10, 25, 50, 100].map(size => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                        onChange={(e) => setStartDate(e.target.value ? moment(e.target.value) : null)}
                        InputLabelProps={{ shrink: true }}
                        style={{ marginRight: 20 }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                        onChange={(e) => setEndDate(e.target.value ? moment(e.target.value) : null)}
                        InputLabelProps={{ shrink: true }}
                    />
                </div>
            </div>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                paginationMode="server"
                rowCount={total}
                pagination
                onPageChange={(params) => setPage(params.page)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
        </div>
    );
};

export default AnswersTable;
