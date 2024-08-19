import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from "xlsx";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const UserContentViews = () => {
    const [limit, setLimit] = useState(10);
    const [teamGroup, setTeamGroup] = useState('All'); // Default to 'All'
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);

        try {
            const teamGroupQuery = teamGroup !== 'All' ? `&teamGroup=${teamGroup}` : '';
            const fetchLimit = limit === 'All' ? Infinity : parseInt(limit);
            const chunkSize = 50; // Fetch 50 records per chunk
            let offset = 0;
            let allData = [];

            const fetchData = async (chunkSize, offset) => {
                const response = await fetch(`/api/reports/usercontentviews?limit=${chunkSize}&offset=${offset}${teamGroupQuery}`);
                return response.json();
            };

            if (limit === 'All') {
                // Fetch all data at once if limit is 'All'
                const { data } = await fetchData(fetchLimit, offset);
                allData = data;
                setProgress(100);
            } else {
                while (true) {
                    const { data: chunkData } = await fetchData(chunkSize, offset);
                    if (chunkData.length === 0) break; // If no more data, break the loop
                    allData.push(...chunkData);
                    offset += chunkSize;
                    setProgress(Math.min((offset / fetchLimit) * 100, 100));
                    if (chunkData.length < chunkSize || allData.length >= fetchLimit) break;
                }
            }

            // Format Data for Rank Report
            const formattedData = allData.map((user, index) => ({
                rank: index + 1,
                views: user.views,
                empId: user.empId,
                fullname: user.fullname,
                teamGroup: user.teamGrop,
                branch: user.branch,
                department: user.department,
                group: user.group,
                position: user.position,
            }));

            // Format Data for View Details
            const viewDetailsData = [];
            allData.forEach((user, index) => {
                // Add header row for each user
                viewDetailsData.push({
                    rank: `Rank ${index + 1}`,
                    empId: `empId: ${user.empId}`,
                    fullname: `fullname: ${user.fullname}`,
                    contentId: '', // Empty fields for alignment
                    title: '',
                    categories: '',
                    subcategories: '',
                    groups: '',
                    subgroups: '',
                    createdAt: '',
                });

                // Add content view details for each user
                user.contentviews.forEach(view => {
                    viewDetailsData.push({
                        rank: '',
                        empId: '',
                        fullname: '',
                        contentId: view.contentId,
                        title: view.title,
                        categories: view.categories,
                        subcategories: view.subcategories,
                        groups: view.groups,
                        subgroups: view.subgroups,
                        createdAt: moment(view.createdAt).locale('th').format('LLL'),
                    });
                });
            });

            // Create workbook and add sheets
            const wb = XLSX.utils.book_new();
            const wsRankReport = XLSX.utils.json_to_sheet(formattedData);
            const wsViewDetails = XLSX.utils.json_to_sheet(viewDetailsData);

            XLSX.utils.book_append_sheet(wb, wsRankReport, "Rank Report");
            XLSX.utils.book_append_sheet(wb, wsViewDetails, "View Details");

            // Export to Excel
            XLSX.writeFile(wb, `UserViewsReport_Top${limit}-${teamGroup}.xlsx`);

        } catch (err) {
            console.error("Error exporting data: ", err);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
        <h2 className="text-lg font-bold mb-4">User Content Views Rank</h2>
        <div className="flex flex-row gap-4 items-center">
            <div className="mb-4">
                <label htmlFor="rankLimit" className="mr-2">TeamGroup:</label>
                <select value={teamGroup} 
                    onChange={(e) => setTeamGroup(e.target.value)}  
                    className="p-1 border rounded-md"    
                >
                    <option value="All">All</option>
                    <option value="AL">AL</option>
                    <option value="Retail">Retail</option>
                    <option value="TCON">TCON</option>
                </select>
                <label htmlFor="rankLimit" className="mr-2 ml-2">Rank:</label>
                <select
                    id="rankLimit"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="p-1 border rounded-md"
                >
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                    <option value={100}>Top 100</option>
                    <option value={120}>Top 120</option>
                    <option value={150}>Top 150</option>
                    <option value={200}>Top 200</option>
                    <option value={500}>Top 500</option>
                    <option value={1000}>Top 1000</option>
                    <option value={'All'}>All</option>
                    {/* Add more options as needed */}
                </select>
            </div>
            <div className="mb-4">
                <button
                    onClick={handleExport}
                    className="p-2 bg-blue-500 text-xs text-white font-bold rounded-full"
                    disabled={loading}
                >
                    {loading ? "Exporting..." : "Export to Excel"}
                </button>
            </div>
        </div>
        {loading && (
            <div className="flex items-center">
                <ClipLoader size={30} color={"#0056FF"} />
                <span className="ml-2">{`Exporting... ${Math.round(progress)}%`}</span>
            </div>
        )}
    </div>
    );
};

export default UserContentViews;
