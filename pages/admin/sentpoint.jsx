import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useSWR from "swr";
import moment from "moment";
import "moment/locale/th";
import Image from "next/image";
import { useRouter } from "next/router";
import { DataGrid } from '@mui/x-data-grid';
import Loading from "@/components/Loading";
import { IoIosSearch } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import Avatar from "@/components/utils/Avatar";
import * as XLSX from 'xlsx';

moment.locale("th");

const fetcher = url => axios.get(url).then(res => res.data);

export default function Sentpoint() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const apiUrl = useMemo(() => {
        if (startDate && endDate) {
          return `/api/sendpointcoins/send?startDate=${startDate}&endDate=${endDate}`;
        }
        return `/api/sendpointcoins/send`;
    }, [startDate, endDate]);

    const { data: sentData, error, isLoading } = useSWR(apiUrl, fetcher, {
        onSuccess: (data) => {
          setData(data.data);
        },
    });

    useEffect(() => {
        if (data && search) {
            const filteredData = data.filter((item) =>
                item.fullname.toLowerCase().includes(search.toLowerCase()) ||
                item.empId.toLowerCase().includes(search.toLowerCase()) ||
                item.ref.toLowerCase().includes(search.toLowerCase())
            );
            setFilterData(filteredData);
        } else {
            setFilterData(data);
        }
    }, [data, search]);

    console.log("data", data);

    const handleExport = () => {
        setLoading(true);
        if (!filterData && filterData.length === 0) {
            setLoading(false);
            return;
        }

        const formattedData = filterData.map(item => ({
            empId: item.empId,
            fullname: item.fullname,
            teamGroup: item.teamGrop,
            chief_th: item.chief_th,
            chief_en: item.chief_en,
            position: item.position,
            department: item.department,
            branch: item.branch,
            group: item.group,
            point: item.point,
            coins: item.coins,
            ref: item.ref,
            createdAt: moment(item.createdAt).locale('th').format('LLLL'),
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const filename = `report-sent-point-coins-${moment().format("YYYYMMDD")}.xlsx`;
        XLSX.writeFile(workbook, filename);

        setLoading(false);
    };

    if (isLoading || loading) return <Loading />;

    const columns = [
        { field: "pictureUrl", headerName: "รูป", width: 100,
            renderCell: (params) => {
                return (
                    <Avatar src={params.value} size={40}/>
                );
            },
        },
        { field: "empId", headerName: "รหัสพนักงาน", width: 100 },
        { field: "fullname", headerName: "ชื่อ-นามสกุล", width: 250 },
        { field: "teamGroup", headerName: "teamGroup", width: 150 },
        { field: "point", headerName: "Point", width: 100 },
        { field: "coins", headerName: "Conins", width: 100 },
        { field: "ref", headerName: "Reference", width: 350 },
        { field: "createdAt", headerName: "วันที่", width: 200,
            renderCell: (params) => {
                return moment(params.value).format("DD/MM/YYYY HH:mm");
            },
         },
    ];

    return (
        <div className="flex flex-col p-5 max-w-screen w-full">
            <h1 className="text-xl font-bold text-[#0056FF]">รายงานส่งคะแนน</h1>
            <div className="flex flex-col w-full mt-5">
                {/* Toolbar */}
                <div className="flex flex-row justify-between items-center gap-4 mb-2 w-full">
                    {/* Search */}
                    <div className="relative">
                        <input 
                            type="text"
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="ค้นหา"
                            className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <IoIosSearch className="w-5 h-5 text-gray-500" />
                        </div>
                        {search && (
                            <button 
                            className="absolute right-2 top-2 text-gray-500"
                            onClick={() => setSearch("")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filter */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-2 ml-4">
                            <div>
                                <label className="mr-2 font-bold">วันที่เริ่มต้น</label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    className="border border-gray-300 rounded-md px-3 py-2" 
                                />
                            </div>
                            <div>
                                <label className="mr-2 font-bold">วันที่สิ้นสุด</label>
                                <input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)} 
                                    className="border border-gray-300 rounded-md px-3 py-2" 
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-white font-bold bg-green-500 hover:bg-green-600 rounded-lg"
                                onClick={handleExport}
                            >
                                <RiFileExcel2Line size={20} />
                                Export
                            </button>
                        </div>
                    </div>

                </div>

                {/* Table */}
                <div>
                    <DataGrid
                        rows={filterData}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        getRowId={(row) => row._id}
                        sx={{
                            border: 0,
                            "& .MuiDataGrid-cell:hover": {
                                color: "primary.main",
                            },
                            "& .MuiDataGrid-columnHeader:hover": {
                                color: "primary.main",
                            },
                        }}
                    />
                    {filterData.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">ไม่พบข้อมูล</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
