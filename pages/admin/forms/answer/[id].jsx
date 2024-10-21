import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Loading from "@/components/Loading";
import { IoIosCloseCircle } from "react-icons/io";
import { Divider } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { AdminLayout } from "@/themes";
import * as XLSX from 'xlsx';

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const AnswerReport = () => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();
    const { id } = router.query;
    const { data, error, mutate } = useSWR(`/api/forms/answers/${id}`, fetcher, {
        onSuccess: (data) => {
            setAnswers(data.data.answers);
        },
    });
    
    if (error) return <div>Failed to load</div>;
    if (!data) return <Loading />;

    console.log('Answers:', answers);

    const handleExport = async () => {
        setLoading(true);

        try {
            const rawData = answers;

            // Format dates using moment before exporting
            const formattedData = rawData.map(item => ({
                ...item,
                user: item.user.empId + '-' + item.user.fullname,
                created_at: moment(item.createdAt).format('lll'),
                answers: item.answers.map(answer => {
                    // Format answers as "ข้อที่ {answer.index}: {answer.text or answer.option}"
                    const answerText = answer.text ? `ข้อที่ ${answer.index}: ${answer.text}` : `ข้อที่ ${answer.index}: ${answer.option}`;
                    return answerText;
                }).join(', '),  // Combine all formatted answers into a single string
            }));

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, `forms-report.xlsx`);

            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/forms/answers/${id}`);
        mutate();
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col w-full p-4">
            {/* Header */}
            <div className="flex flex-row items-center gap-2">
                <IoIosArrowBack 
                    size={30}
                    onClick={() => router.back()}
                    className="cursor-pointer inline text-gray-700"
                />
                <h1 className="text-2xl font-bold ml-4">Report:</h1>
                <span className="text-2xl font-bold text-[#0056FF]">
                    {data.data.title}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 mt-4">
                <div>
                    <button
                        className="bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={handleExport}
                    >
                        Export
                    </button>
                </div>
                <table className="table-auto w-full">
                    <thead>
                        <tr className="border bg-gray-200">
                            <th className="px-4 py-1 w-20">ลำดับ</th>
                            <th className="px-4 py-1 w-[100px]">รูป</th>
                            <th className="px-4 py-1 w-[200px]">ชื่อ</th>
                            <th className="px-4 py-1 w-3/6">คำตอบ</th>
                            <th className="px-4 py-1 w-[150px]">สร้างเมื่อ</th>
                            <th className="px-4 py-1">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {answers.length > 0 ? (
                            answers.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-sm">
                                    <td className="border px-4 py-1 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border px-4 py-1 items-center justify-center">
                                        <div className="flex items-center justify-center">
                                            <Image
                                                src={item.user.pictureUrl}
                                                alt="User Picture"
                                                width={50}
                                                height={50}
                                                className="rounded-full"
                                            />
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2">
                                        {item.user.fullname}
                                    </td>
                                    <td className="border px-4 py-2">
                                       <div className="flex flex-row gap-2">
                                            {item.answers.map((answer, index) => (
                                                <div key={index} className="flex flex-row gap-1">
                                                    <span>ข้อที่ {answer.index}: </span>
                                                    <span>{answer.text? answer.text : answer.option},</span>
                                                </div>
                                            ))}
                                        </div> 
                                    </td>
                                    <td className="border px-4 py-2">
                                        {moment(item.createdAt).format('lll')}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button
                                            className="bg-red-500 text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="border px-4 py-2 text-center">
                                    ไม่พบข้อมูล
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default AnswerReport;

AnswerReport.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
AnswerReport.auth = true;
