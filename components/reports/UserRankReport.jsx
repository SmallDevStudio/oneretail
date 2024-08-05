import { useState } from "react";
import useSWR from "swr";
import * as XLSX from "xlsx";
import { ClipLoader } from "react-spinners";
import moment from "moment-timezone";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

const UserRankReport = () => {
    const [limit, setLimit] = useState(10);
    const [teamGroup, setTeamGroup] = useState('All'); // Default to 'All'
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    console.log('limit', limit);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);
    
        try {
            // Ensure that teamGroup is not undefined or null before appending to the query
            const teamGroupQuery = teamGroup ? `&teamGroup=${teamGroup}` : '';
            const fetchData = async (limit, offset) => {
                const response = await fetch(`/api/dashboard/rank?limit=${limit}&offset=${offset}${teamGroupQuery}`);
                return response.json();
            };
    
            const allData = [];
            const chunkSize = parseInt(limit); // ตั้งค่า chunkSize ตามต้องการ
            let offset = 0;

            while (offset < limit) {
                const { data: chunkData } = await fetchData(limit, offset);
                allData.push(...chunkData);
                offset += chunkSize; // เพิ่ม offset ตาม chunkSize ไม่ใช่ limit
                setProgress(Math.min((offset / limit) * 100, 100));
            }
    
            // สร้างข้อมูลสำหรับ sheet "Rank Report"
            const formattedData = allData.map((user, index) => {
                const totalPoints = user.points.reduce((acc, curr) => acc + curr.point, 0);
                return {
                    rank: index + 1,
                    empId: user.empId,
                    fullname: user.fullname,
                    totalPoints: totalPoints,
                    teamGrop: user.teamGrop,
                    branch: user.branch,
                    department: user.department,
                    group: user.group,
                    chief_th: user.chief_th,
                    chief_eng: user.chief_eng,
                    position: user.position,
                };
            });
    
            // สร้างข้อมูลสำหรับ sheet "Point Details" โดยจัดกลุ่มตาม fullname
            const pointDetailsData = [];
            allData.forEach((user) => {
                // ใส่ fullname เป็น row เพื่อระบุชื่อของ user ก่อนที่จะใส่ข้อมูล point ของ user
                pointDetailsData.push({
                    fullname: user.fullname,
                    point: '',
                    description: '',
                    createdAt: '',
                });
                
                user.points.forEach((point) => {
                    pointDetailsData.push({
                        fullname: '', // แสดงชื่อครั้งเดียวเมื่อเริ่ม group
                        type: point.type === 'earn' ? 'รายได้' : 'รายจ่าย',
                        point: point.point,
                        description: point.description,
                        createdAt: moment(point.createdAt).locale('th').format('LLL'), // ใช้ moment เพื่อแสดงวันที่ในรูปแบบไทย
                    });
                });
            });
    
            const wb = XLSX.utils.book_new();
    
            // เพิ่ม sheet "Rank Report"
            const wsRankReport = XLSX.utils.json_to_sheet(formattedData);
            XLSX.utils.book_append_sheet(wb, wsRankReport, "Rank Report");
    
            // เพิ่ม sheet "Point Details"
            const wsPointDetails = XLSX.utils.json_to_sheet(pointDetailsData);
            XLSX.utils.book_append_sheet(wb, wsPointDetails, "Point Details");
    
            // บันทึกไฟล์
            XLSX.writeFile(wb, `UserRankReport_Top${limit}-${teamGroup}.xlsx`);
    
        } catch (err) {
            console.error("Error exporting data: ", err);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
            <h2 className="text-lg font-bold mb-4">User Rank Top</h2>
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

export default UserRankReport;
