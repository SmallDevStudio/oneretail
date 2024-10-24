import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/th"; // Import Thai locale for moment
import DatePicker, { registerLocale } from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS
import th from "date-fns/locale/th"; // Import Thai locale for DatePicker

// Register Thai locale for the DatePicker
registerLocale('th', th);

moment.locale('th'); // Set moment locale to Thai

export default function Leaderboard() {
   const [data, setData] = useState(null);
   const [position, setPosition] = useState('');
   const [endDate, setEndDate] = useState(new Date()); // Set as Date object

   useEffect(() => {
        const fetchData = async () => {
            try {
                // Format endDate to 'yyyy-mm-dd' for query
                const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
                const response = await axios.get(`/api/reports/leaderboard2`, {
                    params: {
                        position,
                        endDate: formattedEndDate // Send formatted date to the API
                    }
                });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [endDate, position]);

    if (!data) return <div><CircularProgress /></div>;

    const handleExport = async () => {
        try {
            const rawData = data.data;

            // Format dates using moment before exporting
            const formattedData = rawData.map(item => ({
                ...item,
            }));

            // Create Excel Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, 'leaderboard.xlsx');
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    return (
        <div className="flex flex-col w-full px-5 py-2">
            <div className="flex flex-row bg-gray-100 border-2 border-gray-200 items-center rounded-2xl px-4 py-2">
                <h1 className="text-xl font-bold">Leaderboard:</h1>

                {/* DatePicker with Thai months */}
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)} // Update the selected date
                    dateFormat="dd/MM/yyyy" // Display format
                    locale="th" // Use Thai locale
                    className="border-gray-400 rounded-2xl px-4 py-1 ml-2"
                />

                <select
                    className="border-gray-400 rounded-2xl px-4 py-1 ml-2"
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                >
                    <option value="">All</option>
                    <option value="BM">BM</option>
                    <option value="Gen">Gen</option>
                    <option value="IVS">IVS</option>
                    <option value="LS">LS</option>
                    <option value="Wealth">Wealth</option>
                </select>
                <button
                    className="bg-[#0056FF] text-white rounded-2xl p-2 ml-2"
                    onClick={handleExport}
                >
                    Export
                </button>
            </div>
        </div>
    );
}
