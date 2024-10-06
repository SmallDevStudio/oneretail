import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosArrowBack } from "react-icons/io";
import { AppLayout } from "@/themes";

const colors = {
    1: "#FF0000",
    2: "#FF8A00",
    3: "#FFC700",
    4: "#B9D21E",
    5: "#00D655",
};

const SurveyGroup = () => {
    const router = useRouter();
    const { position, startDate, endDate } = router.query;
    const teamGrop = 'Retail';

    const [groupData, setGroupData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSurveyData = async () => {
        console.log("Fetching survey data with:", { startDate, endDate, teamGrop, position }); // Debug log
        try {
            const response = await axios.get(`/api/survey/board/bbdservice/position`, {
                params: { startDate, endDate, teamGrop, position },
            });
            console.log("API Response:", response.data); // Debug log to check API response
            setGroupData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching survey data:", error);
            setError("Failed to fetch survey data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Router query:", router.query); // Debug log to check query parameters
        if (teamGrop && position && startDate && endDate) {
            setLoading(true); // Set loading state before API call
            fetchSurveyData();
        } else {
            setLoading(false); // Ensure loading stops if parameters are not present
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, position]);

    // Handle bar click to display details of the selected group
    const handleBarClick = (group) => {
        setSelectedGroup(group);
    };

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
                <span className="font-black text-2xl text-[#0056FF]">{position}</span>
            </div>

            <div className="mt-4 bg-white shadow-md text-xs w-full">
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart 
                            data={groupData}
                            layout="vertical"
                            onClick={({ activeLabel }) => handleBarClick(activeLabel)}
                            margin={{ top: 10, right: 20, left: -35, bottom: 5 }}
                        >
                            <XAxis type="number" />
                            <YAxis 
                                dataKey="group"
                                type="category"
                                tickFormatter={(label) => label.length > 10 ? `${label.substring(0, 10)}...` : label}
                            />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ display: 'flex', flexDirection: 'column' }}
                                formatter={(value, name, props) => {
                                    const { payload } = props;
                                    return [
                                        `Total: ${value}`,
                                        `Verbatim: ${payload.memoCount}`
                                    ];
                                }}
                            />
                            <Legend
                                {...{
                                    payload: surveyDetails.map(detail => ({
                                        value: detail.label,
                                        type: "square",
                                        color: detail.color || '#333'
                                    }))
                                }}
                            />
                            <Bar dataKey="total" fill="#8884d8">
                                {groupData.map((group, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[group.average]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {selectedGroup && (
                <div 
                    className="mt-4 px-4 py-2 bg-white shadow-md"
                    onClick={() => router.push(`/survey/BBDSERVICE/${position}/${selectedGroup}?startDate=${startDate}&endDate=${endDate}`)}
                >
                    <h3 className="text-lg font-bold">รายละเอียดสำหรับเขต: {selectedGroup}</h3>
                    <span className="text-sm text-[#0056FF]">(คลิกเพื่อดูรายละเอียด)</span>
                    <ul className="text-sm mt-1">
                        {surveyDetails
                            .sort((a, b) => b.value - a.value)
                            .map(detail => (
                                <li key={detail.value} style={{ color: detail.color }}>
                                    <span className="font-bold">{detail.label} ({detail.value}): {groupData.find(group => group.group === selectedGroup)?.counts[detail.value] || 0} คน</span>
                                </li>
                            ))}
                    </ul>
                    <span className="flex font-bold mt-2">
                        รวม: {groupData.find(group => group.group === selectedGroup)?.total || 0} คน
                    </span>
                </div>
            )}
        </div>
    );
};

export default SurveyGroup;

SurveyGroup.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyGroup.auth = true;
