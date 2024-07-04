import { useState, useEffect } from 'react';
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
    const [jumpPage, setJumpPage] = useState('');

    const fetchData = async (page, pageSize) => {
        setLoading(true);
        try {
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
                formattedDate: item.createdAt,
                userId: item.userId,
                fullname: item.user?.fullname || 'N/A',
                empId: item.user?.empId || 'N/A',
                createdAt: item.timestamp
            }));
            setRows(dataWithIds);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page, pageSize);
    }, [page, pageSize]);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/answers', {
                params: {
                    page: 1,
                    pageSize: total, // Fetch all records
                    startDate: startDate ? startDate.toISOString() : null,
                    endDate: endDate ? endDate.toISOString() : null,
                },
            });
            
            const dataToExport = response.data.data.map((item) => ({
                ...item,
                id: item._id,
                questionText: item.questionId.question,
                correctAnswer: item.questionId.correctAnswer,
                answerText: item.questionId.options[item.answer],
                correctAnswerText: item.questionId.options[item.questionId.correctAnswer],
                isCorrectText: item.isCorrect ? 'ถูก' : 'ผิด',
                timestamp: moment(item.createdAt).local('th').format('LLL'),
                fullname: item.user?.fullname || 'N/A',
                empId: item.user?.empId || 'N/A',
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Answers");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, 'answers.xlsx');
        } catch (error) {
            console.error('Error exporting data:', error);
        }
        setLoading(false);
    };

    const totalPages = Math.ceil(total / pageSize);

    if (loading) return <Loading />;

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleJumpPageChange = (e) => {
        setJumpPage(e.target.value);
    };

    const handleJumpPageSubmit = () => {
        const newPage = parseInt(jumpPage, 10) - 1;
        if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div style={{ width: '100%' }}>
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
                            onChange={(e) => {
                                setPageSize(e.target.value);
                                setPage(0); // Reset to the first page
                            }}
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }} className='table text-sm mx-2'>
                <thead className="bg-gray-200 border-2 border-gray-300 ">
                    <tr className="border-2 border-gray-300 ">
                        <th >Full Name</th>
                        <th className='mr-2'>EmpId</th>
                        <th>Question</th>
                        <th>Answer Given</th>
                        <th>Correct Answer</th>
                        <th>Result</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody className="border-2 border-gray-300 ">
                    {rows.map((row, index) => (
                        <tr key={index} className="border-2 border-gray-300 ">
                            <td>{row.fullname}</td>
                            <td className='mr-2'>{row.empId}</td>
                            <td>{row.questionText}</td>
                            <td>{row.answerText}</td>
                            <td>{row.correctAnswerText}</td>
                            <td className={row.isCorrectText === 'ถูก'? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{row.isCorrectText}</td>
                            <td>{moment(row.timestamp).local('th').format('LLL')}</td> {/* Ensure correct date display */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </Button>
                <div>
                    <span>
                        Page {page + 1} of {totalPages}
                    </span>
                    <TextField
                        label="Jump to Page"
                        type="number"
                        value={jumpPage}
                        onChange={handleJumpPageChange}
                        InputLabelProps={{ shrink: true }}
                        style={{ width: 100, marginLeft: 20, marginRight: 10 }}
                    />
                    <Button variant="contained" onClick={handleJumpPageSubmit}>
                        Go
                    </Button>
                </div>
                <Button
                    variant="contained"
                    disabled={page === totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default AnswersTable;
