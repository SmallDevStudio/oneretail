import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import moment from "moment";
import "moment/locale/th";
import { AdminLayout } from "@/themes";
import Loading from "../Loading";
import * as XLSX from "xlsx";
import Image from "next/image";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ExamAnswerTable = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { data, error, mutate } = useSWR('/api/examinations/answerslist', fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data || loading ) return <Loading />;

    console.log(data);

    const handleExport = async () => {
        setLoading(true);
        setProgress(0);
    
        try {

            const { data: rawData } = await mutate();
            // Format dates using moment before exporting
            const formattedData = rawData.map(item => ({
                empId: item.user?.empId,
                name:  item.user?.fullname,
                teamGroup: item.emp?.teamGrop ? item.emp.teamGrop : '-',
                position: item.emp?.position ? item.emp.position : '-',
                answerCount: item.examCount,
                createdAt: moment(item.createdAt).format('LLL'),
            }));
    
            setProgress(100);
    
            // Create Excel Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
            // Export to Excel
            XLSX.writeFile(workbook, `ExamAnswer.xlsx`);
    
            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        console.log(id);
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this post? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/examinations/delete?id=${id}`);
                mutate();
            } catch (error) {
                console.error(error);
            }
        }
    }


    return (
        <div className="p-5">
            <div className="flex justify-end mb-5">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleExport}
                >
                    Export
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-auto w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Picture</th>
                            <th className="border px-4 py-2">EmpId</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">TeamGroup</th>
                            <th className="border px-4 py-2">Position</th>
                            <th className="border px-4 py-2">AnswerCount</th>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data && data?.data?.length > 0 ? (
                            data?.data?.map((item, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 text-center">{index + 1} </td>
                                    <td className="border px-4 py-2 text-center">
                                        <div className="flex justify-center items-center">
                                            <Image
                                                src={item?.user?.pictureUrl}
                                                width={50}
                                                height={50}
                                                alt={item?.user?.fullname}
                                                loading="lazy"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2 text-center">{item?.user?.empId}</td>
                                    <td className="border px-4 py-2 text-center">{item?.user?.fullname}</td>
                                    <td className="border px-4 py-2 text-center">{item?.emp?.teamGrop? item?.emp?.teamGrop : "-"}</td>
                                    <td className="border px-4 py-2 text-center">{item?.emp?.position? item?.emp?.position : "-"}</td>
                                    <td className="border px-4 py-2 text-center">{item?.examCount}</td>
                                    <td className="border px-4 py-2 text-center">{moment(item?.createdAt).format("LLL")}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <button 
                                            className="bg-gray-100 text-gray-500 font-bold p-1 rounded-full"
                                            onClick={() => handleDelete(item?._id)}
                                        >
                                            <RiDeleteBin5Line />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ): 
                            <div>
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No data
                                </td>
                            </tr>
                            </div>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExamAnswerTable;

ExamAnswerTable.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

ExamAnswerTable.auth = true;
