import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ContentReport = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { data, error, isLoading, mutate } = useSWR(`/api/reports/content`, fetcher);

    console.log(data);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);

        try {
            const { data: rawData } = await mutate();

            // Format dates using moment before exporting
            const formattedData = rawData.map(item => ({
                ...item,
                createdAt: moment(item.createdAt).format('LLL'),
                updatedAt: moment(item.updatedAt).format('LLL')
            }));

            setProgress(100);

            // Create Excel Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, `content-report.xlsx`);

            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setLoading(false);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (isLoading || !data) return <div><CircularProgress /></div>;

    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
            <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">Content Report</span>
                <button className="bg-[#0056FF] text-white rounded-2xl p-2 w-1/6 mt-2" 
                    onClick={handleExport}>
                        Export
                </button>
            </div>
        </div>
    );
};

export default ContentReport;
