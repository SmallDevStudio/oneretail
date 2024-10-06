import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";


const colors = {
    1: "#FF0000",  // Red
    2: "#FF8A00",  // Green
    3: "#FFC700",  // Blue
    4: "#B9D21E",  // Yellow
    5: "#00D655",  // Purple
    // You can map more groups or color them dynamically if more groups are added
};

const SurveyTeam = () => {
    const [positionData, setPositionData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const router = useRouter();
    const teamGrop = 'Retail';

    // Fetch the survey data
    const fetchSurveyData = async () => {
        try {
            const response = await axios.get(`/api/survey/board/bbdservice`, {
                params: { startDate, endDate, teamGrop }
            });
            setPositionData(response.data.data);
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
    const handleBarClick = (position) => {
        setSelectedPosition(position);
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

            <div className="flex flex-row justify-center items-center gap-2 px-2 w-full">
                <span className="font-bold text-[#0056FF]">TeamGroup:</span>
                <span className="font-bold text-[#F2871F]">{teamGrop === 'Retail' ? 'BBD (service)' : teamGrop}</span>
            </div>

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
            {positionData.length === 0 ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height={300} >
                    <BarChart data={positionData} 
                        onClick={({ activeLabel }) => handleBarClick(activeLabel)}
                        margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                    >
                        <XAxis dataKey="position" />
                        <YAxis />
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
                        <Legend
                            {...{
                                payload: surveyDetails.map(detail => ({
                                    value: detail.label,
                                    type: "square",
                                    color: detail.color || '#333' // Default color if not mapped
                                }))
                            }}
                        />
                        <Bar dataKey="total" fill="#8884d8">
                            {positionData.map((position, index) => (
                                <Cell key={`cell-${index}`} fill={colors[position.average]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            </div>

            {/* Data breakdown for selected group */}
            {selectedPosition && (
                <div 
                    className="mt-4 px-4 py-2 bg-white shadow-md"
                    onClick={() => router.push(`/survey/BBDSERVICE/${selectedPosition}?startDate=${startDate}&endDate=${endDate}`)}
                >
                    <h3 className="text-lg font-bold">รายละเอียดสำหรับกลุ่ม: {selectedPosition}</h3>
                    <span className="text-sm text-[#0056FF]">(คลิกเพื่อดูรายละเอียด)</span>
                    <ul className="text-sm mt-1">
                        {surveyDetails
                            .sort((a, b) => b.value - a.value) // Sort from 5 to 1
                            .map(detail => (
                                <li key={detail.value} style={{ color: detail.color }}>
                                    <span className="font-bold">{detail.label} ({detail.value}): {positionData.find(position => position.position === selectedPosition)?.counts[detail.value] || 0} คน</span>
                                </li>
                            ))}
                    </ul>
                    <span 
                        className="flex font-bold mt-2">
                            รวม: {positionData.find(position => position.position === selectedPosition)?.total || 0} คน
                    </span>
                </div>
            )}
        </div>
    );
};

export default SurveyTeam;

SurveyTeam.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyTeam.auth = true;

