import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";  // Import Thai locale
import Image from "next/image";
import { LinearProgress, Box, Button } from "@mui/material";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

moment.locale('th'); // Set locale globally

const VoteNameTable = () => {
    const [voteNames, setVoteNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/campaigns/votename?page=${page}`);
                setVoteNames(response.data.data.voteNames);
                setTotalPages(response.data.data.totalPages);
                setLoading(false);
            } catch (error) {
                setError("An unexpected error occurred");
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
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
                const response = await axios.get('/api/campaigns/votename', {
                    params: {
                        page: currentPage,
                        pageSize: pageSize,
                    },
                });

                const data = response.data.data.voteNames;

                if (data.length > 0) {
                    allData = allData.concat(data);
                    currentPage++;
                    setProgress((prevProgress) => Math.min(100, prevProgress + (data.length / voteNames.length) * 100));
                } else {
                    hasMore = false;
                }
            }

            const dataToExport = allData.map((vote) => ({
                ...vote,
                createdAt: moment(vote.createdAt).format('LLL')
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "VoteNames");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, 'voteNames.xlsx');
        } catch (error) {
            console.error('Error exporting data:', error);
        }
        setProgress(100);
        setExporting(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="overflow-x-auto p-5">
            <div className="flex justify-end mb-4">
                <Button variant="contained" color="primary" onClick={handleExport} disabled={exporting}>
                   <span>Export</span>
                </Button>
            </div>
            {exporting && (
                <Box sx={{ width: '100%', marginBottom: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
            <table className="table-auto w-full">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">รูปผู้ใช้</th>
                        <th className="px-4 py-2">ชื่อผู้ใช้</th>
                        <th className="px-4 py-2">รหัสพนักงาน</th>
                        <th className="px-4 py-2">ชื่อมาสคอต</th>
                        <th className="px-4 py-2">คำอธิบาย</th>
                        <th className="px-4 py-2">วันที่สร้าง</th>
                    </tr>
                </thead>
                <tbody>
                    {voteNames.map((vote) => (
                        <tr key={vote._id}>
                            <td className="border px-4 py-2">
                                <Image src={vote.user?.pictureUrl} alt="user" width="50" height="50" style={{ borderRadius: '50%', objectFit: 'cover', width: '50px', height: '50px'}}/>
                            </td>
                            <td className="border px-4 py-2">{vote.user?.fullname}</td>
                            <td className="border px-4 py-2">{vote.user?.empId}</td>
                            <td className="border px-4 py-2">{vote.name}</td>
                            <td className="border px-4 py-2">{vote.description}</td>
                            <td className="border px-4 py-2">{moment(vote.createdAt).format('LLL')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default VoteNameTable;
