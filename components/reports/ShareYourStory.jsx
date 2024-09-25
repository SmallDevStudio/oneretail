import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import { CircularProgress } from '@mui/material';
import * as XLSX from "xlsx";

moment.locale('th');

const ShareYourStory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/reports/share-your-story');
                setData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);

        try {
            const rawData = data;

            // Format dates using moment before exporting
            const formattedData = rawData.map(item => {
                const media = item.medias.length > 0 ? item.medias[0] : {}; // ถ้ามี media, ให้ดึงตัวแรก
                return {
                    id: item._id,
                    post: item.post,
                    media_id: media.public_id || "N/A", // ตรวจสอบว่ามี media หรือไม่
                    media_url: media.url || "N/A", // ตรวจสอบว่ามี media หรือไม่
                    creator_name: item.userId.fullname,
                    creator_empId: item.userId.empId,
                    creator_teamGroup: item.userId.teamGrop,
                    pinned: item.pinned,
                    like: item.likeCount,
                    comments: item.commentCount,
                    views: item.views,
                    createdAt: moment(item.createdAt).locale('th').format('LLL'),
                };
            });

            setProgress(100);

            // Create Excel Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, `share-your-story-report.xlsx`);

            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setLoading(false);
        }
    };

    if (loading || !data) return <CircularProgress />;


    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
            <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">Share Your Story</span>
                <button className="bg-[#0056FF] text-white rounded-2xl p-2 w-1/6 mt-2" 
                    onClick={handleExport}>
                        Export
                </button>
            </div>
        </div>
    );
};

export default ShareYourStory;