import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";
import { MdOutlineHome } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

const SurveyGroup = () => {
    const router = useRouter();
    const teamGrop = 'TCON';
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [departmentData, setDepartmentData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchSurveyData = async () => {
        try {
            const response = await axios.get(`/api/survey/board/tcon/department`, {
                params: { startDate, endDate, teamGrop },
            });
            setDepartmentData(response.data.data);
        } catch (error) {
            console.error("Error fetching survey data:", error);
        }
    };

    useEffect(() => {
        if (teamGrop) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop]);

     // Handle bar click to display details of the selected group
     const handleBarClick = (department) => {
        setSelectedDepartment(department);
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
                <span className="font-black text-2xl text-[#0056FF]">{teamGrop}</span>
            </div>


            {/* Date picker */}
            <div className="flex flex-row justify-evenly items-center gap-2 p-2 w-full text-sm">
                <div className="flex flex-row items-center gap-1">
                    <label htmlFor="startDate" className="font-bold">วันที่เริ่ม</label>
                    <input 
                        type="date" 
                        id="startDate"
                        defaultValue={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        max={endDate}
                        className="border-2 border-gray-300 rounded-lg p-1"
                    />
                </div>

                <div className="flex flex-row items-center gap-1">
                    <label htmlFor="endDate" className="font-bold">วันที่สิ้นสุด</label>
                    <input 
                        type="date" 
                        id="endDate" 
                        defaultValue={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        max={new Date().toISOString().split("T")[0]}
                        className="border-2 border-gray-300 rounded-lg p-1"
                    />
                </div>

            </div>

            {/* Chart */}
            <div className="mt-4 bg-white shadow-md text-xs w-full">
            {departmentData.length === 0 ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                        data={departmentData}
                        layout="vertical"  // เปลี่ยน layout เป็นแนวตั้ง
                        onClick={({ activeLabel }) => handleBarClick(activeLabel)}
                        margin={{ top: 10, right: 20, left: -35, bottom: 5 }}
                    >
                        {/* แกน X จะแสดงผลเป็นค่าตัวเลข เช่นจำนวนคน */}
                        <XAxis type="number" />
                        
                        {/* แกน Y จะเป็น label ของ department */}
                        <YAxis 
                            dataKey="department"
                            type="category"
                            tickFormatter={(label) => label.length > 10 ? `${label.substring(0, 0)} ` : label}
                        />
                        
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
                                                    {`${data.department}`}
                                                </p>
                                                <p style={{ fontWeight: "bold", margin: 0, marginBottom: "5px" }}>
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
            {selectedDepartment && (
                <div 
                    className="mt-4 px-4 py-2 bg-white shadow-md"
                >
                    <h3 
                        className="text-lg font-bold"
                        onClick={() => router.push(`/survey/verbatim?teamGrop=${teamGrop}&department=${selectedDepartment}&startDate=${startDate}&endDate=${endDate}`)}
                        >
                            รายละเอียดสำหรับเขต: {selectedDepartment}
                    </h3>
                    <span 
                        className="text-sm text-[#0056FF]"
                        onClick={() => router.push(`/survey/verbatim?teamGrop=${teamGrop}&department=${selectedDepartment}&startDate=${startDate}&endDate=${endDate}`)}
                    >
                        (คลิกเพื่อดูรายละเอียด)
                    </span>
                    <ul className="text-sm mt-1">
                    {surveyDetails
                            .sort((a, b) => b.value - a.value) // Sort from 5 to 1
                            .filter(detail => {
                                const department = departmentData.find(department => department.department === selectedDepartment);
                                const total = department?.counts[detail.value] || 0;
                                return total > 0; // Only include items with total > 0
                            })
                            .map(detail => {
                                const department = departmentData.find(department => department.department === selectedDepartment);
                                const total = department?.counts[detail.value] || 0;
                                const verbatim = department?.memoCount[detail.value] || 0;

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
                                                        `/survey/verbatim?teamGrop=${teamGrop}&department=${selectedDepartment}&startDate=${startDate}&endDate=${endDate}&value=${detail.value}`
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
                            รวม: {departmentData.find(department => department.department === selectedDepartment)?.total || 0} คน
                    </span>
                </div>
            )}
        </div>
    );
};

export default SurveyGroup;

SurveyGroup.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyGroup.auth = true