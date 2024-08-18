import React, { useState, useEffect } from "react";
import useSWR from "swr";
import moment from "moment";
import "moment/locale/th";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import CircularProgress from '@mui/material/CircularProgress';
import { AppLayout } from "@/themes";
import Loading from "@/components/Loading";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

const valueMapping = [
    { value: 5, label: 'เยี่ยมสุดๆ', color: '#00D655' },
    { value: 4, label: 'ดี', color: '#B9D21E' },
    { value: 3, label: 'ปานกลาง', color: '#FFC700' },
    { value: 2, label: 'พอใช้', color: '#FF8A00' },
    { value: 1, label: 'แย่', color: '#FF0000' },
];

const Survey = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
    const [group, setGroup] = useState(''); // Default to no department filter

    const { data: survey, error: surveyError, isLoading } = useSWR(() => `/api/survey/report?month=${month}&year=${year}&group=${group}`, fetcher);

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleDepartmentChange = (event) => {
        setGroup(event.target.value);
    };

    if (surveyError) return <div>Error loading data</div>;
    if (!survey) return <CircularProgress />;

    // Extract unique departments from survey data
    const groups = new Set();
    Object.keys(survey.data).forEach(week => {
        Object.values(survey.data[week]).forEach(surveyWeekData => {
            surveyWeekData.empDetails.forEach(emp => {
                if (emp.group) { // Ensure department is not undefined or null
                    groups.add(emp.group);
                }
            });
        });
    });

    const departmentOptions = Array.from(groups).map(dept => (
        <option key={dept} value={dept}>{dept}</option>
    ));

    // Prepare chart data
    const labels = Object.keys(survey.data).map(week => `Week ${week}`);
    const datasets = valueMapping.map(({ value, label, color }) => ({
        label,
        data: labels.map(weekLabel => {
            const weekNumber = weekLabel.split(' ')[1]; // Extract the week number
            return survey.data[weekNumber]?.[value]?.count || 0;
        }),
        borderColor: color,
        backgroundColor: color,
        fill: false,
    }));

    const chartData = {
        labels,
        datasets
    };

    if (isLoading) return <Loading />;

    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row items-center gap-2">
                <h2 className="text-2xl font-bold">Survey Report</h2>
            </div>
            
            {/* Tools */}
            <div className="flex flex-row items-center gap-2 mt-4">
                <label className="text-xs font-bold">Month</label>
                <select
                    value={month}
                    onChange={handleMonthChange}
                    className="w-1/4 border-2 border-gray-300 p-1 rounded-full text-xs outline-none"
                >
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {moment().month(i).format("MMMM")}
                        </option>
                    ))}
                </select>
                <label className="text-xs font-bold">Group</label>
                <select
                    value={group}
                    onChange={handleDepartmentChange}
                    className="w-1/4 border-2 border-gray-300 p-1 rounded-full text-xs outline-none"
                >
                    <option value="">All</option>
                    {departmentOptions}
                </select>
            </div>

            {/* Chart */}
            <div className="flex mt-4 h-[400px]">
                <Line 
                    data={chartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                    className="w-full h-1/2"
                />
            </div>
        </div>
    );
};

export default Survey;

Survey.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Survey.auth = true;
