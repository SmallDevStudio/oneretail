import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";

const SurveyTeam = () => {
    const [groupData, setGroupData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const router = useRouter();
    const teamGrop = 'Retail';

    // Fetch the survey data
    const fetchSurveyData = async () => {
        try {
            const response = await axios.get(`/api/survey/board/bbd`, {
                params: { startDate, endDate, teamGrop }
            });
            setGroupData(response.data.data);
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
    const handleBarClick = (group) => {
        setSelectedGroup(group);
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
                <span className="font-bold text-[#F2871F]">{teamGrop === 'Retail' ? 'BBD' : teamGrop}</span>
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
            {groupData.length === 0 ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height={300} >
                    <BarChart data={groupData} 
                        onClick={({ activeLabel }) => handleBarClick(activeLabel)}
                        margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                    >
                        <XAxis dataKey="group" />
                        <YAxis />
                        <XAxis dataKey="group" />
                            <YAxis />
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
                                                    {`${data.group}`}
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
                            <Legend
                                payload={surveyDetails.map(detail => ({
                                    value: detail.label,
                                    type: "square",
                                    color: detail.color,
                                }))}
                            />
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
            {selectedGroup && (
                <div 
                    className="mt-4 px-4 py-2 bg-white shadow-md"
                >
                    <h3 
                        className="text-lg font-bold"
                        onClick={() => router.push(`/survey/BBD/${selectedGroup}?startDate=${startDate}&endDate=${endDate}`)}
                    >
                        รายละเอียดสำหรับกลุ่ม: {selectedGroup}
                    </h3>
                    <span 
                        className="text-sm text-[#0056FF]"
                        onClick={() => router.push(`/survey/BBD/${selectedGroup}?startDate=${startDate}&endDate=${endDate}`)}
                    >
                        (คลิกเพื่อดูรายละเอียด)
                    </span>
                    <ul className="text-sm mt-1">
                        {surveyDetails
                            .sort((a, b) => b.value - a.value) // Sort from 5 to 1
                            .map(detail => {
                                const group = groupData.find(group => group.group === selectedGroup);
                                const total = group?.counts[detail.value] || 0;
                                const verbatim = group?.memoCount[detail.value] || 0;

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
                                                        `/survey/verbatim?teamGrop=${teamGrop}&group=${selectedGroup}&startDate=${startDate}&endDate=${endDate}&value=${detail.value}`
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
                            รวม: {groupData.find(group => group.group === selectedGroup)?.total || 0} คน
                    </span>
                </div>
            )}
        </div>
    );
};

export default SurveyTeam;

SurveyTeam.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyTeam.auth = true;

