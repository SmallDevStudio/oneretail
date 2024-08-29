import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import SocialClubTable from "@/components/Custom/SocialClubTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";
import { RiFileExcel2Line, RiDeleteBinLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import * as XLSX from 'xlsx';
import CircularProgress from '@mui/material/CircularProgress';

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const SocialClubAdmin = () => {
    const [loading, setLoading] = useState(false);

    const { data, isLoading, error } = useSWR("/api/socialclub", fetcher);

    const handleExport = (data) => {
        setLoading(true);
        const formattedData = data.map(item => {
            const options = {};
            item.options.forEach((opt, index) => {
                options[`option_${index + 1}`] = opt;
            });
    
            return {
                empId: item.empId,
                name: item.empName,    
                ...options,
                createdAt: moment(item.createdAt).format('LLL'),
            };
        });
    
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ผู้สมัคร');
        XLSX.writeFile(workbook, 'socialclub.xlsx');

        setLoading(false);
    };
    

    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div><CircularProgress /></div>;

    return (
        <div className="w-full">
            <Header title="Social Club" />
            <div className="flex flex-col p-5">
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
                            <div 
                                className="flex flex-row items-center gap-2"
                                onClick={() => handleExport(data.data)}
                            >
                                <RiFileExcel2Line size={20}/>
                                <span>Export</span>
                            </div>
                        </button>
                    </div>
                </div>
                {loading && <div><CircularProgress /></div>}
            
                <div className="w-full">
                    <SocialClubTable data={data.data} />
                </div>
            </div>
        </div>
    );
};

export default SocialClubAdmin;

SocialClubAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
