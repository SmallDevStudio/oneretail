import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";
import { MdOutlineHome } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

const colors = {
    1: "#FF0000",  // Red
    2: "#FF8A00",  // Green
    3: "#FFC700",  // Blue
    4: "#B9D21E",  // Yellow
    5: "#00D655",  // Purple
    // You can map more groups or color them dynamically if more groups are added
};

const SurveyBranch = () => {
    const router = useRouter();
    const { position, group, department, startDate, endDate } = router.query;
    const teamGrop = "Retail";

    const [branchData, setBranchData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const fetchSurveyData = async () => {
        try {
            const response = await axios.get(`/api/survey/board/bbdservice/department`, {
                params: { startDate, endDate, teamGrop, position, group, department },
            });
            setBranchData(response.data.data);
        } catch (error) {
            console.error("Error fetching survey data:", error);
        }
    };

    useEffect(() => {
        if (teamGrop && position && group && department) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, position, group, department]);

     // Handle bar click to display details of the selected group
     const handleBarClick = (branch) => {
        setSelectedBranch(branch);
    };

    // Survey details
    const surveyDetails = [
        { value: 5, label: 'เยี่ยมสุดๆ', color: '#00D655' },
        { value: 4, label: 'ดี', color: '#B9D21E' },
        { value: 3, label: 'ปานกลาง', color: '#FFC700' },
        { value: 2, label: 'พอใช้', color: '#FF8A00' },
        { value: 1, label: 'แย่', color: '#FF0000' }
    ];

    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row justify-between items-center gap-2 mt-5 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => router.back()}
                    size={25}
                />
                <h2 className="text-3xl font-bold text-[#0056FF]">
                    รายงานอุณหภูมิ <span className="text-[#F2871F]">ความสุข</span>
                </h2>
                <div></div>
            </div>

            <div className="flex flex-col justify-center items-center gap-1 mt-2 w-full">
                <span className="font-black text-lg text-[#0056FF]">{department}</span>
            </div>

        {/* Chart */}
        <div className="mt-4 bg-white shadow-md text-xs w-full">
            {branchData.length === 0 ? (
                <div className="flex justify-center items-center h-96">
                    <CircularProgress />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                        data={branchData}
                        layout="vertical"  // เปลี่ยน layout เป็นแนวตั้ง
                        onClick={({ activeLabel }) => handleBarClick(activeLabel)}
                        margin={{ top: 10, right: 20, left: -35, bottom: 5 }}
                    >
                        {/* แกน X จะแสดงผลเป็นค่าตัวเลข เช่นจำนวนคน */}
                        <XAxis type="number" />
                        
                        {/* แกน Y จะเป็น label ของ branch */}
                        <YAxis 
                            dataKey="branch"
                            type="category"
                            tickFormatter={(label) => label.length > 0 ? `${label.substring(0, 0)} ` : label}
                        />
                        
                        {/* Custom Tooltip */}
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            formatter={(value, name, props) => {
                                const { payload } = props;  // payload contains the data of the hovered branch
                                return [
                                    `Total: ${value}`,  // Total number of people (or whatever 'total' represents)
                                    `Verbatim: ${payload.memoCount}`  // Show memo count
                                ];
                            }}
                            
                        />

                        {/* ปรับ Legend ให้เป็นสองแถว */}
                        <Legend
                            {...{
                                payload: surveyDetails.map(detail => ({
                                    value: detail.label,
                                    type: "square",
                                    color: detail.color || '#333' // Default color if not mapped
                                }))
                            }}
                        />
                    
                        {/* Bar ที่ถูกเปลี่ยนให้เป็นแนวแกน Y */}
                        <Bar dataKey="total" fill="#8884d8">
                            {branchData.map((branch, index) => (
                                <Cell key={`cell-${index}`} fill={colors[branch.average]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            </div>

            {/* Data breakdown for selected group */}
            {selectedBranch && (
                <div 
                    className="mt-4 px-4 py-2 bg-white shadow-md"
                    onClick={() => router.push(`/survey/BBDSERVICE/${position}/${group}/${department}/memo?branch=${selectedBranch}&startDate=${startDate}&endDate=${endDate}`)}
                >
                    <h3 className="text-lg font-bold">รายละเอียดสำหรับสาขา: {selectedBranch}</h3>
                    <span className="text-sm text-[#0056FF]">(คลิกเพื่อดูรายละเอียด)</span>
                    <ul className="text-sm mt-1">
                        {surveyDetails
                            .sort((a, b) => b.value - a.value) // Sort from 5 to 1
                            .map(detail => (
                                <li key={detail.value} style={{ color: detail.color }}>
                                    <span className="font-bold">{detail.label} ({detail.value}): {branchData.find(branch => branch.branch === selectedBranch)?.counts[detail.value] || 0} คน</span>
                                </li>
                            ))}
                    </ul>
                    <span 
                        className="flex font-bold mt-2">
                            รวม: {branchData.find(branch => branch.branch === selectedBranch)?.total || 0} คน
                    </span>
                </div>
            )}
        </div>
    );

}

export default SurveyBranch;

SurveyBranch.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyBranch.auth = true;