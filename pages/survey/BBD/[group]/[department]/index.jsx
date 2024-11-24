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
    const { group, department, startDate, endDate } = router.query;
    const teamGrop = "Retail";

    const [branchData, setBranchData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const fetchSurveyData = async () => {
        try {
            const response = await axios.get(`/api/survey/board/bbd/department`, {
                params: { startDate, endDate, teamGrop, group, department },
            });
            setBranchData(response.data.data);
        } catch (error) {
            console.error("Error fetching survey data:", error);
        }
    };

    useEffect(() => {
        if (teamGrop && group && department) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, group, department]);

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
                                cursor={{ fill: "transparent" }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload; // Access the data for the hovered group
                                        const counts = data.counts || {}; // Counts for each value
                                        const memoCount = data.memoCount || {}; // Memo count for each value

                                        return (
                                            <div
                                                style={{
                                                    backgroundColor: "white",
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <p style={{ fontWeight: "bold", margin: 0 }}>
                                                    {`${data.branch}`}
                                                </p>
                                                <p style={{ fontWeight: "bold", margin: 0, marginBottom: 5 }}>
                                                    {`Total: ${data.total}`}
                                                </p>
                                                {surveyDetails.map((detail) => (
                                                    <p
                                                        key={detail.value}
                                                        style={{
                                                            margin: 0,
                                                            color: detail.color,
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {`Verbatim: ${memoCount[detail.value] || 0}  Total: ${
                                                            counts[detail.value] || 0
                                                        }`}
                                                    </p>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null; // Return nothing when not hovering
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
                        {surveyDetails.map(detail => (
                                <Bar
                                    key={detail.value}
                                    dataKey={`counts.${detail.value}`}
                                    stackId="a"
                                    fill={detail.color}
                                    onClick={(data) => handleBarClick(data.payload.group)}
                                />
                            ))}
                    </BarChart>
                </ResponsiveContainer>
            )}
            </div>

            {/* Data breakdown for selected group */}
            {selectedBranch && (
                <div className="mt-4 px-4 py-2 bg-white shadow-md">
                    <h3 
                        className="text-lg font-bold"
                        onClick={() => router.push(`/survey/BBD/${group}/${department}/memo?branch=${selectedBranch}&startDate=${startDate}&endDate=${endDate}`)}
                    >
                        รายละเอียดสำหรับสาขา: {selectedBranch}
                    </h3>
                    <span 
                        className="text-sm text-[#0056FF]"
                        onClick={() => router.push(`/survey/BBD/${group}/${department}/memo?branch=${selectedBranch}&startDate=${startDate}&endDate=${endDate}`)}
                    >
                        (คลิกเพื่อดู Verbatim)
                    </span>
                    <ul className="text-sm mt-1">
                    {surveyDetails
                            .sort((a, b) => b.value - a.value) // Sort from 5 to 1
                            .filter(detail => {
                                const branch = branchData.find(branch => branch.branch === selectedBranch);
                                const total = branch?.counts[detail.value] || 0;
                                return total > 0; // Only include items with total > 0
                            })
                            .map(detail => {
                                const branch = branchData.find(branch => branch.branch === selectedBranch);
                                const total = branch?.counts[detail.value] || 0;
                                const verbatim = branch?.memoCount[detail.value] || 0;

                                return (
                                    <li key={detail.value} style={{ color: detail.color }}>
                                        <div className="flex flex-row gap-4">
                                            <span className="font-bold">
                                                ({detail.value}) {detail.label}: {total} คน
                                            </span>
                                            <span
                                                className="text-sm font-normal text-gray-600 cursor-pointer"
                                                onClick={() => 
                                                    router.push(
                                                        `/survey/verbatim?teamGrop=${teamGrop}&group=${group}&department=${department}&branch=${selectedBranch}&startDate=${startDate}&endDate=${endDate}&value=${detail.value}`
                                                    )
                                                }
                                            >
                                                <strong>Verbatim:</strong> {verbatim} รายการ
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
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