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
    1: "#FF5733",  // Red
    2: "#33FF57",  // Green
    3: "#3357FF",  // Blue
    4: "#F1C40F",  // Yellow
    5: "#8E44AD",  // Purple
    6: "#3498DB",
    7: "#E67E22",
    8: "#2ECC71",
    9: "#E74C3C",
    10: "#9B59B6",
    11: "#34495E",
    12: "#16A085",
    13: "#27AE60",
    14: "#2980B9",
    15: "#8E44AD",
    16: "#2C3E50",
    17: "#F1C40F",
    18: "#E67E22",
    19: "#E74C3C",
    20: "#95A5A6",
    // You can map more groups or color them dynamically if more groups are added
};

const SurveyGroup = () => {
    const router = useRouter();
    const { teamGrop, Group, startDate, endDate } = router.query;

    const [departmentData, setDepartmentData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchSurveyData = async () => {
        try {
            const response = await axios.get(`/api/survey/board/group`, {
                params: { startDate, endDate, teamGrop, group: Group },
            });
            setDepartmentData(response.data.data);
        } catch (error) {
            console.error("Error fetching survey data:", error);
        }
    };

    useEffect(() => {
        if (teamGrop && Group) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, Group]);

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
                <span className="font-black text-2xl text-[#0056FF]">{Group}</span>
                <span className="font-bold text-md text-[#0056FF]">(สำนักงานเขตธุรกิจ {departmentData.length} เขต)</span>
            </div>

            <div className="flex flex-row items-center gap-1 mt-2 px-2 w-full text-gray-400 text-xs">
                <MdOutlineHome size={15}
                    onClick={() => router.push(`/main`)}
                />
                <IoIosArrowForward size={15}/>
                <div
                    className="flex flex-row items-center gap-1"
                    onClick={() => router.push(`/survey`)}
                >
                    <span>TeamGroup</span>
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
                        
                        <Tooltip />
                        
                        {/* ปรับ Legend ให้เป็นสองแถว */}
                       
                        {/* Bar ที่ถูกเปลี่ยนให้เป็นแนวแกน Y */}
                        <Bar dataKey="total" fill="#8884d8">
                            {departmentData.map((department, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index+1]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            </div>

            {/* Data breakdown for selected group */}
            {selectedDepartment && (
                <div 
                    className="mt-4 px-4 py-2 bg-white shadow-md"
                    onClick={() => router.push(`/survey/${teamGrop}/${Group}/${selectedDepartment}?startDate=${startDate}&endDate=${endDate}`)}
                >
                    <h3 className="text-lg font-bold">รายละเอียดสำหรับเขต: {selectedDepartment}</h3>
                    <span className="text-sm text-[#0056FF]">(คลิกเพื่อดูรายละเอียด)</span>
                    <ul className="text-sm mt-1">
                        {surveyDetails
                            .sort((a, b) => b.value - a.value) // Sort from 5 to 1
                            .map(detail => (
                                <li key={detail.value} style={{ color: detail.color }}>
                                    <span className="font-bold">{detail.label} ({detail.value}): {departmentData.find(department => department.department === selectedDepartment)?.counts[detail.value] || 0} คน</span>
                                </li>
                            ))}
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