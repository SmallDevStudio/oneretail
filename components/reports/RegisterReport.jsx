import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const RegisterReport = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const { data, error: fetchError, isLoading, mutate } = useSWR(`/api/reports/register`, fetcher);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);
        setError(null);

        try {
            const { data: groupedData } = await mutate(); // Access the grouped data

            if (typeof groupedData !== 'object' || Array.isArray(groupedData)) {
                throw new Error("Data is not in the expected format");
            }

            const excelData = [];

            // Prepare data for Excel
            for (const [monthYear, items] of Object.entries(groupedData)) {
                excelData.push([monthYear]); // Add month header
                excelData.push(["empId", "fullname", "userId", "createdAt"]); // Add column headers

                items.forEach(item => {
                    excelData.push([item.empId, item.fullname, item.userId, moment(item.createdAt).format('LLL')]);
                });

                excelData.push([]); // Add an empty row for separation between months
            }

            // Create Excel Workbook
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, `register-report.xlsx`);

            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setError('Failed to export data');
            setLoading(false);
        }
    };

    if (fetchError) return <div>Failed to load</div>;
    if (isLoading || !data) return <div><CircularProgress /></div>;

    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
            <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">Register Report</span>
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

export default RegisterReport;
