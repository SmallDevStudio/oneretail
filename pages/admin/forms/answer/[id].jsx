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
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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

    console.log(answers);

    const handleExport = async () => {
        setLoading(true);
    
        try {
            const rawData = answers;
    
            // Create a set to hold all unique question indexes (for dynamic columns)
            const questionIndexes = new Set();
    
            // First pass: gather all question indexes
            rawData.forEach(item => {
                item.answers.forEach(answer => {
                    questionIndexes.add(`ข้อที่ ${answer.index}`); // Add unique question names (ข้อที่)
                });
            });
    
            // Convert set to array and sort (for consistent column order)
            const questionColumns = Array.from(questionIndexes).sort();
    
            // Second pass: format data for export
            const formattedData = rawData.map(item => {
                // Create a base object with separate empId and fullname columns
                const baseData = {
                    empId: item.user.empId,
                    fullname: item.user.fullname,
                    teamGroup: item.emp.teamGrop,
                    chief_th: item.emp.chief_th? item.emp.chief_th : '-',
                    chief_en: item.emp.chief_en? item.emp.chief_en : '-',
                    position: item.emp.position? item.emp.position : '-',
                    department: item.emp.department? item.emp.department : '-',
                    branch: item.emp.branch? item.emp.branch : '-',
                    group: item.emp.group? item.emp.group : '-',
                    created_at: moment(item.createdAt).format('lll'),
                };
    
                // Fill answers in corresponding columns
                const answerData = {};
                item.answers.forEach(answer => {
                    const questionKey = `ข้อที่ ${answer.index}`;
                    answerData[questionKey] = answer.text || answer.option; // Set text or option as the answer
                });
    
                // Merge the base data with the dynamically generated answer columns
                return { ...baseData, ...answerData };
            });
    
            // Prepare the Excel workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: ['empId', 'fullname', 'created_at', ...questionColumns] });
    
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
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this answer? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/forms/answers/delete?id=${id}`);
                mutate();
            } catch (error) {
                console.error(error);
            }
        }
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
                                                style={{ objectFit: 'cover', width: '50px', height: '50px' }}
                                                priority
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
                                            onClick={() => handleDelete(item._id)}
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
