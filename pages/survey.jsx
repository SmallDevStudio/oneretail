import React, { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { AppLayout } from "@/themes";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from "next/router";

moment.locale('th');

const fetcher = (url) => fetch(url).then((res) => res.json());

const valueMapping = [
    { value: 5, label: 'เยี่ยมสุดๆ', color: '#00D655' },
    { value: 4, label: 'ดี', color: '#B9D21E' },
    { value: 3, label: 'ปานกลาง', color: '#FFC700' },
    { value: 2, label: 'พอใช้', color: '#FF8A00' },
    { value: 1, label: 'แย่', color: '#FF0000' },
];

const Survey = () => {
    const [timeRange, setTimeRange] = useState(1); // Default to 1 month
    const [limit, setLimit] = useState(10); // Default limit to 10 items
    const [page, setPage] = useState(1); // Default to first page
    const [teamGrop, setTeamGrop] = useState(''); // Default to no team filter

    const router = useRouter();

    const { data: survey, error: surveyError } = useSWR(() => `/api/survey/report?months=${timeRange}&limit=${limit}&page=${page}&teamGrop=${teamGrop}`, fetcher);

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
        setPage(1); // Reset to first page when time range changes
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1); // Reset to first page when limit changes
    };

    const handleTeamGropChange = (event) => {
        setTeamGrop(event.target.value);
        setPage(1); // Reset to first page when team group changes
    };

    if (surveyError) return <div>Error loading data</div>;
    if (!survey) return <CircularProgress />;

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (survey.data.length === limit) setPage(page + 1);
    };

    return (
        <div className="flex-1 flex-col p-2 mb-20">
            <div className="flex flex-row items-center gap-2">
                <IoIosArrowBack 
                    size={20}
                    onClick={() => router.back()}
                />
                <span className="text-2xl font-bold">Survey Report</span>
            </div>
            {/* Tools */}
            <div className="flex flex-row items-center gap-2 mt-4">
                <label className="text-xs font-bold">Range</label>
                <select
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    className="w-1/4 border-2 border-gray-300 p-1 rounded-full text-xs outline-none"
                >
                    <option value={1}>1 month</option>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                </select>
                <label className="text-xs font-bold">Limit</label>
                <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="w-1/4 border-2 border-gray-300 p-1 rounded-full text-xs outline-none"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <label className="text-xs font-bold">Team</label>
                <select
                    value={teamGrop}
                    onChange={handleTeamGropChange}
                    className="w-1/4 border-2 border-gray-300 p-1 rounded-full text-xs outline-none"
                >
                    <option value="">All</option>
                    <option value="Retail">Retail</option>
                    <option value="AL">AL</option>
                    <option value="TCON">TCON</option>
                </select>
            </div>
            {/* Table */}
            <div>
                <table className="table-auto text-[11px] w-full mt-4">
                    <thead className="bg-[#FF9800]/50">
                        <tr>
                            <th className="border border-gray-300 p-2 font-bold">EmpId</th>
                            <th className="border border-gray-300 p-2 font-bold">Fullname</th>
                            <th className="border border-gray-300 p-2 font-bold">Value</th>
                            <th className="border border-gray-300 p-2 font-bold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {survey.data.map((survey, index) => {
                            const valueLabel = valueMapping.find(v => v.value === survey.value);
                            return (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan="2" className="border border-gray-300 text-center">{survey.empId}</td>
                                        <td rowSpan="2" className="border border-gray-300">
                                            <div className="flex flex-col items-center">
                                                <Image
                                                    src={survey.pictureUrl}
                                                    alt={survey.fullname}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full"
                                                    style={{
                                                        objectFit: "cover",
                                                        objectPosition: "center",
                                                        height: "30px",
                                                        width: "auto",
                                                    }}
                                                />
                                                <span className="font-bold text-[10px]">{survey.fullname}</span>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 font-bold text-center" style={{ color: valueLabel.color }}>
                                            {valueLabel.label}
                                        </td>
                                        <td className="border border-gray-300 text-[10px] text-center">{moment(survey.createdAt).format("DD MMM YYYY")}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="border border-gray-300 font-bold text-[10px]">memo: {survey.memo}</td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <button 
                        onClick={handlePrevPage} disabled={page === 1} 
                        className="p-1 border rounded-full"
                    >
                        <FaAngleLeft />
                    </button>
                    <div className="flex flex-row items-center gap-1">
                        <span className="text-xs">Page {page}</span>
                        <span className="text-xs">of {Math.ceil(survey.total / limit)}</span>
                    </div>
                    <button 
                        onClick={handleNextPage} disabled={survey.data.length < limit} 
                        className="p-1 border rounded-full"
                    >
                        <FaAngleRight />
                    </button>
                </div>
                <div className="text-right text-xs mt-4">
                    Total Surveys: {survey.data.length} / {survey.total}
                </div>
            </div>
        </div>
    );
};

export default Survey;

Survey.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Survey.auth = true;
