import React, { useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const UsersReport = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);
        setError(null);

        let allData = [];
        let hasMore = true;
        let skip = 0;
        const limit = 500; // จำกัดจำนวนการโหลดในแต่ละครั้ง

        try {
            const res = await axios.get(`/api/reports/users`, {
                params: { limit, skip },
            });

            const allData = res.data.data;

            // Format dates using moment before exporting
            const formattedData = allData.map(item => ({
                ...item,
                createdAt: moment(item.createdAt).format('LLL'),
                updatedAt: moment(item.updatedAt).format('LLL')
            }));

            // Create Excel Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, `users-report.xlsx`);

            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setError('Failed to export data');
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
            <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">Users Report</span>
                <button className="bg-[#0056FF] text-white rounded-2xl p-2 w-1/6 mt-2" 
                    onClick={handleExport} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Export'}
                </button>
            </div>
            {loading && <div>Progress: {progress}%</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default UsersReport;
