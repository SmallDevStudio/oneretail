import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { RiFileExcel2Line, RiDeleteBinLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { MdOutlinePageview } from "react-icons/md";
import SatisfactionView from "./SatisfactionView";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const SatisfactionTable = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectData, setSelectData] = useState(null);
    const [showView, setShowView] = useState(false);

    const { data, error, isLoading, mutate } = useSWR("/api/satisfactions", fetcher);

    const onClose = () => {
        setSelectData(null);
        setShowView(false);
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'คุณต้องการลบใช่หรือไม่?',
            text: "หากลบแล้วจะไม่สามารถกู้คืนได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่ ลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
           try {
               await axios.delete(`/api/satisfactions/delete?id=${id}`);
               await mutate(); // Reload data after deletion
               Swal.fire(
                   'ลบสำเร็จ!',
                   'ข้อมูลได้ถูกลบแล้ว.',
                   'success'
               );
           } catch (error) {
               console.error(error);
               Swal.fire(
                   'เกิดข้อผิดพลาด!',
                   'ไม่สามารถลบข้อมูลได้.',
                   'error'
               );
           }
        }
    };

    const handleExport = (data) => {
        setLoading(true);
        const formattedData = data.map(item => {
            const featureLike = {};
            item.featureLike.forEach((opt, index) => {
                featureLike[`featureLike_${index + 1}`] = opt;
            });

            const improved = {};
            item.improved.forEach((opt, index) => {
                improved[`improved_${index + 1}`] = opt;
            });
    
            return {
                empId: item.user.empId,
                name: item.user.fullname,
                satisfied: item.satisfied,
                recommend: item.recommend? item.recommend : 'ไม่มี',
                ...featureLike,
                ...improved,
                featuresAdd: item.featuresAdd? item.featuresAdd : 'ไม่มี',
                problems: item.problems? item.problems : 'ไม่มี',
                suggestions: item.suggestions? item.suggestions : 'ไม่มี',
                createdAt: moment(item.createdAt).format('LLL'),
            };
        });
    
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'satisfactions.xlsx');

        setLoading(false);
        
    };
    

    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between mb-2">
                <div className="flex flex-row border border-gray-300 p-1 rounded-full">
                    <input
                        type="text"
                        placeholder="ค้นหา"
                    />
                    <button>
                        <IoIosSearch size={20}/>
                    </button>
                </div>

                <div className="flex flex-row gap-2">
                    <button
                        className="bg-green-700 text-white font-bold py-1 px-4 rounded"
                    >
                        <div className="flex flex-row items-center gap-2"
                            onClick={() => handleExport(data.data)}
                        >
                            <RiFileExcel2Line size={20}/>
                            <span>Export</span>
                        </div>
                    </button>
                </div>
            </div>

            <table className="w-full table-auto border">
                <thead className="bg-[#FF9800]/50">
                    <tr>
                        <th className="w-20">No.</th>
                        <th className="w-52">Picture</th>
                        <th className="w-32">EmpId</th>
                        <th className="w-52">Name</th>
                        <th className="w-52">Group</th>
                        <th className="w-52">Date</th>
                        <th className="w-52">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.length > 0 ? (
                        data.data.map((satisfaction, index) => (
                            <tr key={index} className="text-sm text-center">
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex justify-center items-center">
                                        <Image
                                            src={satisfaction.user.pictureUrl}
                                            alt={satisfaction.user.fullname}
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                            style={{
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                width: "40px",
                                                height: "40px",
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>{satisfaction.user.empId}</td>
                                <td>{satisfaction.user.fullname}</td>
                                <td>{satisfaction.emp?.teamGrop}</td>
                                <td>{moment(satisfaction.createdAt).format("LLLL")}</td>
                                <td>
                                    <div className="flex flex-row items-center justify-center gap-2">
                                        <button>
                                            <MdOutlinePageview 
                                                size={20}
                                                onClick={() => {
                                                    setSelectData(satisfaction);
                                                    setShowView(true);
                                                }}
                                            />
                                        </button>
                                        <button>
                                            <RiDeleteBinLine 
                                                size={20}
                                                onClick={() => handleDelete(satisfaction._id)}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex flex-row justify-between items-center mt-1 px-1 text-sm">
                <div>
                    <span>Total Record: {data.data.length}</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span>PageSize:</span>
                    <select
                        className="border border-gray-300 p-1 rounded"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div>
                    <span>Page:1/1</span>
                </div>
            </div>

            {showView && 
                <SatisfactionView 
                    data={selectData} 
                    onRequestClose={onClose} 
                    isOpen={showView}
                />}
        </div>
    );
};

export default SatisfactionTable;
